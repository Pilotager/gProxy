import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DocumentInputCardProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export function DocumentInputCard({
  inputText,
  onInputChange,
  onProcess,
  isProcessing,
}: DocumentInputCardProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>文档输入</CardTitle>
        <CardDescription>输入任何形式的文档内容</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="请在这里输入文档内容..."
          className="min-h-[430px] resize-none"
          value={inputText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onInputChange(e.target.value)
          }
        />
        <Button
          onClick={onProcess}
          disabled={isProcessing || !inputText.trim()}
          className="w-full"
        >
          {isProcessing ? "处理中..." : "解析文档"}
        </Button>
      </CardContent>
    </Card>
  );
}
