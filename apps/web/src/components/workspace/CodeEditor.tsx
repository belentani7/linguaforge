"use client";

import dynamic from "next/dynamic";
import type { Monaco, OnMount } from "@monaco-editor/react";
import { Skeleton } from "@/components/ui/skeleton";

const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => <Skeleton className="h-[460px] w-full" />,
});

let registered = false;

/** Snippets específicos de agentes: se suman al IntelliSense nativo de JavaScript de Monaco. Se registran una sola vez. */
function registerAgentSnippets(monaco: Monaco) {
  const snippets = [
    {
      label: "agent-tool",
      doc: "Herramienta registrada para tool calling",
      insert: "const herramientas = {\n  ${1:nombre}: async (${2:args}) => {\n    ${3:return { ok: true };}\n  },\n};",
    },
    {
      label: "sse-loop",
      doc: "Lectura de un stream de Server-Sent Events",
      insert:
        "const res = await fetch(${1:'/api/tutor'}, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(${2:payload}) });\nconst reader = res.body!.getReader();\nconst decoder = new TextDecoder();\nfor (;;) {\n  const { value, done } = await reader.read();\n  if (done) break;\n  ${3:console.log(decoder.decode(value, { stream: true }));}\n}",
    },
    {
      label: "retry-backoff",
      doc: "Reintento con backoff exponencial y límite",
      insert:
        "for (let intento = 1; intento <= ${1:3}; intento++) {\n  try {\n    return await ${2:fn}();\n  } catch (err) {\n    if (intento === ${1:3}) throw err;\n    await new Promise((r) => setTimeout(r, 2 ** intento * 100));\n  }\n}",
    },
    {
      label: "json-schema-check",
      doc: "Validación mínima de una salida estructurada",
      insert:
        "const esValido = typeof ${1:obj}?.${2:campo} === 'string' && ${1:obj}.${2:campo}.trim().length > 0;",
    },
  ];

  if (registered) return;
  registered = true;
  monaco.languages.registerCompletionItemProvider("javascript", {
    provideCompletionItems: (
      model: { getWordUntilPosition: (p: { lineNumber: number; column: number }) => { startColumn: number; endColumn: number } },
      position: { lineNumber: number; column: number },
    ) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: snippets.map((s) => ({
          label: s.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: s.doc,
          insertText: s.insert,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        })),
      };
    },
  });
}

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onEditorReady?: (editor: MonacoEditorInstance) => void;
  ariaLabel: string;
}

type MonacoEditorInstance = Parameters<OnMount>[0];

export function CodeEditor({ value, onChange, onRun, onEditorReady, ariaLabel }: CodeEditorProps) {
  const handleMount: OnMount = (editor, monaco) => {
    registerAgentSnippets(monaco);
    onEditorReady?.(editor);
    // Ctrl/Cmd + Enter ejecuta las pruebas sin salir del teclado.
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun?.());
  };

  return (
    <div className="monaco-host" role="region" aria-label={ariaLabel}>
      <MonacoEditor
        height="460px"
        defaultLanguage="javascript"
        language="javascript"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
          automaticLayout: true,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 14, bottom: 14 },
          renderLineHighlight: "all",
          quickSuggestions: { other: true, comments: false, strings: true },
          suggestOnTriggerCharacters: true,
          ariaLabel,
        }}
      />
    </div>
  );
}
