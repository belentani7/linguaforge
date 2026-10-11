/**
 * Cliente de la API Realtime de OpenAI desde el navegador.
 * Autenticación con el secreto efímero emitido por /api/tutor/voice-token (nunca con la clave real).
 * Captura PCM16 a 24 kHz mediante AudioWorklet y reproduce los deltas de audio en cola.
 */

export const REALTIME_SAMPLE_RATE = 24000;

export interface RealtimeEvents {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (message: string) => void;
  /** Texto parcial de la respuesta del tutor (transcripción). */
  onTextDelta?: (delta: string) => void;
  /** Transcripción de lo que dijo el alumno. */
  onUserTranscript?: (text: string) => void;
  onSpeaking?: (speaking: boolean) => void;
}

const WORKLET_SOURCE = `
class PcmCapture extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      const frame = input[0];
      const pcm = new Int16Array(frame.length);
      for (let i = 0; i < frame.length; i++) {
        const s = Math.max(-1, Math.min(1, frame[i]));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      this.port.postMessage(pcm.buffer, [pcm.buffer]);
    }
    return true;
  }
}
registerProcessor("pcm-capture", PcmCapture);
`;

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function fromBase64(b64: string): Int16Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

export class RealtimeTutorSession {
  private ws: WebSocket | null = null;
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private worklet: AudioWorkletNode | null = null;
  private nextStart = 0;
  private activeSources: AudioBufferSourceNode[] = [];

  constructor(
    private readonly model: string,
    private readonly token: string,
    private readonly events: RealtimeEvents,
  ) {}

  async start(): Promise<void> {
    this.ctx = new AudioContext({ sampleRate: REALTIME_SAMPLE_RATE });
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    });

    const url = `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(this.model)}`;
    // Autenticación con subprotocolo: el navegador no permite cabeceras personalizadas en WebSocket.
    this.ws = new WebSocket(url, ["realtime", `openai-insecure-api-key.${this.token}`]);
    this.ws.onopen = () => {
      this.events.onOpen?.();
      this.send({ type: "session.update", session: { modalities: ["audio", "text"], input_audio_format: "pcm16", output_audio_format: "pcm16", turn_detection: { type: "server_vad" } } });
      void this.startCapture();
    };
    this.ws.onmessage = (e) => this.handle(e.data as string);
    this.ws.onerror = () => this.events.onError?.("websocket_error");
    this.ws.onclose = () => {
      void this.stop();
      this.events.onClose?.();
    };
  }

  private async startCapture(): Promise<void> {
    if (!this.ctx || !this.stream) return;
    const blob = new Blob([WORKLET_SOURCE], { type: "application/javascript" });
    const moduleUrl = URL.createObjectURL(blob);
    try {
      await this.ctx.audioWorklet.addModule(moduleUrl);
    } finally {
      URL.revokeObjectURL(moduleUrl);
    }
    const source = this.ctx.createMediaStreamSource(this.stream);
    this.worklet = new AudioWorkletNode(this.ctx, "pcm-capture");
    this.worklet.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
      this.send({ type: "input_audio_buffer.append", audio: toBase64(e.data) });
    };
    source.connect(this.worklet);
  }

  private handle(raw: string): void {
    let event: { type?: string; delta?: string; transcript?: string; error?: { message?: string } };
    try {
      event = JSON.parse(raw);
    } catch {
      return;
    }
    switch (event.type) {
      case "response.output_audio.delta":
      case "response.audio.delta":
        if (event.delta) this.playPcm(event.delta);
        break;
      case "response.output_audio_transcript.delta":
      case "response.text.delta":
        if (event.delta) this.events.onTextDelta?.(event.delta);
        break;
      case "conversation.item.input_audio_transcription.completed":
        if (event.transcript) this.events.onUserTranscript?.(event.transcript);
        break;
      case "input_audio_buffer.speech_started":
        this.stopPlayback();
        this.events.onSpeaking?.(false);
        break;
      case "response.created":
        this.events.onSpeaking?.(true);
        break;
      case "response.done":
        this.events.onSpeaking?.(false);
        break;
      case "error":
        this.events.onError?.(event.error?.message ?? "realtime_error");
        break;
    }
  }

  private playPcm(b64: string): void {
    if (!this.ctx) return;
    const pcm = fromBase64(b64);
    const buffer = this.ctx.createBuffer(1, pcm.length, REALTIME_SAMPLE_RATE);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < pcm.length; i++) channel[i] = pcm[i] / 0x8000;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.ctx.destination);
    const startAt = Math.max(this.ctx.currentTime, this.nextStart);
    src.start(startAt);
    this.nextStart = startAt + buffer.duration;
    this.activeSources.push(src);
    src.onended = () => {
      this.activeSources = this.activeSources.filter((s) => s !== src);
    };
  }

  private stopPlayback(): void {
    for (const s of this.activeSources) {
      try {
        s.stop();
      } catch {
        /* ya detenido */
      }
    }
    this.activeSources = [];
    this.nextStart = 0;
  }

  private send(payload: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(payload));
  }

  async stop(): Promise<void> {
    this.stopPlayback();
    this.worklet?.disconnect();
    this.worklet = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.ctx && this.ctx.state !== "closed") await this.ctx.close();
    this.ctx = null;
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) this.ws.close();
    this.ws = null;
  }
}
