import React from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted flex flex-col text-center text-xs text-muted-foreground pt-4 select-none border-r">
        {value.split("\n").map((_, i) => (
          <div key={i} className="h-6">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        className="font-mono text-sm min-h-[450px] w-full pl-12 pr-4 py-4 resize-none bg-background focus:outline-none"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        spellCheck={false}
      />
    </div>
  );
}
