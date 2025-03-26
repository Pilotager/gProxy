import { toast } from "@/components/ui/use-toast";

export function useClipboard() {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "已复制",
        description: "内容已成功复制到剪贴板",
      });
      return true;
    } catch (error) {
      console.error("复制失败:", error);
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    copyToClipboard,
  };
}
