import Editor from "@monaco-editor/react";
import { MONACO_LANGUAGE } from "../components/languageMap.jsx";
 
export default function CodeEditor({ language, value, onChange }) {
  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={MONACO_LANGUAGE[language] || "plaintext"}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
      }}
    />
  );
}
 