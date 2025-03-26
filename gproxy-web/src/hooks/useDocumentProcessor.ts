import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface DocumentProcessorResult {
  mockData: string;
  typeDefinition: string;
}

export function useDocumentProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processDocument = async (
    inputText: string
  ): Promise<DocumentProcessorResult> => {
    if (!inputText.trim()) {
      return { mockData: "", typeDefinition: "" };
    }

    setIsProcessing(true);

    let prompt = `# 角色\n你是一位资深的技术专家\n\n# 技能\n1、能够识别输入的文档，进行解析\n2、对文档内的接口文档进行提取\n3、提取出来的接口文档进行任务\n  - 生成 {mockjs} 数据结构\n  - 生成 {typeScript} 类型定义\n  - 生成注释，注释放在每条数据后面 使用 //\n\n# 规范\n1、## 之间的内容为输入的文档\n2、返回格式：\n{\n  mock: \"\",\n  ts: \"\"\n}\n\n# 要求\n返回的 {mock} 格式要按照如下规范：\n1、头部需要包含 {const Mock = require(\"mockjs\");}\n2、在 module.exports 中 需要包含 {useMock: false,} 配置\n3、识别是 post 还是 get 请求，生成对应的 mock 数据，示例如下：\n  const Mock = require(\"mockjs\");\n  /**\n  * 我是注释\n  */\n  module.exports = {\n    useMock: false,\n\n    get: (params, query, body) => {\n      return Mock.mock({\n        code: 0,\n        data: {}\n      });\n    },\n  };\n\n# 输入\n##\n[INPUT_CONTENT]\n##\n`;

    const inputContent = `##\n${inputText}\n##\n`;
    prompt = prompt.replace("[INPUT_CONTENT]", inputContent);

    try {
      // 调用接口处理文档
      const response = await fetch(
        "https://cars-auction-im.guazi-cloud.com/largeModel/getSingleCompletion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            largerModelCode: 8,
            prompt: prompt,
          }),
        }
      );

      const data = await response.json();

      // 处理返回数据
      let newMockData = "";
      let newTypeDefinition = "";

      if (data && data.data) {
        console.log("原始数据:", data.data);

        // 检查是否是字符串
        if (typeof data.data === "string") {
          try {
            // 使用正则表达式提取mock和ts内容
            const mockMatch = data.data.match(/"mock":\s*`([\s\S]*?)`/);
            const tsMatch = data.data.match(/"ts":\s*`([\s\S]*?)`/);

            if (mockMatch && mockMatch[1]) {
              newMockData = mockMatch[1];
            } else {
              // 尝试直接从数据中提取JSON对象
              try {
                const parsedData = JSON.parse(data.data);
                if (parsedData && parsedData.mock) {
                  newMockData =
                    typeof parsedData.mock === "string"
                      ? parsedData.mock.replace(/^`|`$/g, "")
                      : JSON.stringify(parsedData.mock, null, 2);
                }
              } catch (e) {
                console.error("尝试解析JSON失败:", e);
              }
            }

            if (tsMatch && tsMatch[1]) {
              newTypeDefinition = tsMatch[1];
            } else {
              // 尝试直接从数据中提取TypeScript定义
              try {
                const parsedData = JSON.parse(data.data);
                if (parsedData && parsedData.ts) {
                  newTypeDefinition =
                    typeof parsedData.ts === "string"
                      ? parsedData.ts.replace(/^`|`$/g, "")
                      : JSON.stringify(parsedData.ts, null, 2);
                }
              } catch (e) {
                console.error("尝试解析JSON失败:", e);
              }
            }

            console.log("通过正则提取的数据:", {
              mock: newMockData,
              ts: newTypeDefinition,
            });
          } catch (error) {
            console.error("正则提取数据时出错:", error);
          }
        } else if (typeof data.data === "object") {
          // 如果已经是对象
          if (data.data.mock) {
            newMockData =
              typeof data.data.mock === "string"
                ? data.data.mock.replace(/^`|`$/g, "")
                : JSON.stringify(data.data.mock, null, 2);
          }

          if (data.data.ts) {
            newTypeDefinition =
              typeof data.data.ts === "string"
                ? data.data.ts.replace(/^`|`$/g, "")
                : JSON.stringify(data.data.ts, null, 2);
          }
        }
      }

      console.log("最终提取的数据:", newMockData, newTypeDefinition);

      return {
        mockData: newMockData,
        typeDefinition: newTypeDefinition,
      };
    } catch (error) {
      console.error("处理文档时出错:", error);
      toast({
        title: "处理失败",
        description: "文档处理过程中发生错误",
        variant: "destructive",
      });
      return { mockData: "", typeDefinition: "" };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processDocument,
    isProcessing,
  };
}
