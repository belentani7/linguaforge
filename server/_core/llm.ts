export async function invokeLLM(opts: { prompt: string; model?: string }): Promise<{ text: string; model: string }> {
  return {
    text: 'LLM offline stub',
    model: opts.model ?? 'stub',
  };
}
