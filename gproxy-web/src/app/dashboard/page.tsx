"use client";

import React, { useState } from "react";
import { DocumentInputCard } from "@/components/document/DocumentInputCard";
import { CodeEditorCard } from "@/components/document/CodeEditorCard";
import { useDocumentProcessor } from "@/hooks/useDocumentProcessor";
import { useFileCreator } from "@/hooks/useFileCreator";
import { useClipboard } from "@/hooks/useClipboard";

export default function DashboardPage() {
  // State
  const [inputText, setInputText] = useState("");
  const [mockData, setMockData] = useState("");
  const [typeDefinition, setTypeDefinition] = useState("");
  const [routeName, setRouteName] = useState("");

  // Custom hooks
  const { processDocument, isProcessing } = useDocumentProcessor();
  const { createFile, isCreating } = useFileCreator();
  const { copyToClipboard } = useClipboard();

  // Handlers
  const handleProcessDocument = async () => {
    const result = await processDocument(inputText);
    setMockData(result.mockData);
    setTypeDefinition(result.typeDefinition);
  };

  const handleCreateFile = async () => {
    const success = await createFile(routeName, mockData);
    if (success) {
      setRouteName("");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">文档解析</h1>
      <p className="text-muted-foreground">
        输入文档内容，生成 Mock 数据和类型定义
      </p>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* 左侧输入区域 */}
        <DocumentInputCard
          inputText={inputText}
          onInputChange={setInputText}
          onProcess={handleProcessDocument}
          isProcessing={isProcessing}
        />

        {/* 右侧预览区域 - 代码编辑器 */}
        <CodeEditorCard
          mockData={mockData}
          typeDefinition={typeDefinition}
          onMockDataChange={setMockData}
          onTypeDefinitionChange={setTypeDefinition}
          routeName={routeName}
          onRouteNameChange={setRouteName}
          onCopyToClipboard={copyToClipboard}
          onCreateFile={handleCreateFile}
          isCreating={isCreating}
        />
      </div>
    </div>
  );
}
