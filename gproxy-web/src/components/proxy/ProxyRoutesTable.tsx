import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useMockTemplates } from "@/hooks/useMockTemplates";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 组件不再需要任何属性
export function ProxyRoutesTable() {
  const {
    templates,
    isLoading,
    error,
    refreshTemplates,
    updateMockStatus,
    getTemplateContent,
    selectedTemplateContent,
    isLoadingContent,
  } = useMockTemplates();

  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 过滤模板
  const filteredTemplates = templates.filter((template) =>
    template.path.toLowerCase().includes(templateSearchQuery.toLowerCase())
  );

  // 计算总页数
  const totalPages = Math.ceil(filteredTemplates.length / pageSize);

  // 获取当前页的模板
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 页码变化处理函数
  const handlePageChange = (page: number) => {
    // 确保页码在有效范围内
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  // 每页显示数量变化处理函数
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    // 重置到第一页
    setCurrentPage(1);
  };

  // 切换模板的使用状态
  const toggleMockStatus = async (templateId: string, newStatus: boolean) => {
    await updateMockStatus(templateId, newStatus);
  };

  // 查看模板内容
  const viewTemplateContent = async (templateId: string) => {
    setSelectedTemplate(templateId);
    await getTemplateContent(templateId);
  };

  // 关闭模板内容对话框
  const closeTemplateDialog = () => {
    setSelectedTemplate(null);
  };

  // 获取选中的模板
  const currentTemplate = selectedTemplate
    ? templates.find((t) => t.id === selectedTemplate)
    : null;

  // 生成页码数组
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // 最多显示的页码数

    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大显示页码数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 否则，计算应该显示哪些页码
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = startPage + maxVisiblePages - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mock模板</CardTitle>
          <CardDescription>管理API Mock模板</CardDescription>
          <div className="flex justify-between mt-2">
            <Input
              className="max-w-sm"
              placeholder="搜索模板..."
              value={templateSearchQuery}
              onChange={(e) => setTemplateSearchQuery(e.target.value)}
            />
            {!isLoading && !error && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  每页显示：
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // 加载中显示骨架屏
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            // 错误提示
            <div className="text-center py-8 text-destructive">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={refreshTemplates}
              >
                重新加载
              </Button>
            </div>
          ) : (
            // 显示模板列表
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>路径</TableHead>
                  <TableHead className="w-[120px]">Mock状态</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      没有找到模板
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        {template.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                            {template.path}
                          </code>
                          {template.description && (
                            <span className="text-xs text-muted-foreground mt-1">
                              {template.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={template.useMock}
                            onCheckedChange={(checked: boolean) =>
                              toggleMockStatus(template.id, checked)
                            }
                          />
                          <span className="text-xs">
                            {template.useMock ? "已启用" : "已禁用"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => viewTemplateContent(template.id)}
                        >
                          查看内容
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {/* 分页控制 */}
        {!isLoading && !error && filteredTemplates.length > 0 && (
          <CardFooter className="flex justify-between py-4">
            <div className="text-sm text-muted-foreground">
              第 {currentPage} 页，共 {totalPages} 页 (共{" "}
              {filteredTemplates.length} 条记录)
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* 模板内容查看对话框 */}
      <Dialog open={!!selectedTemplate} onOpenChange={closeTemplateDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate ? currentTemplate.path : "模板内容"}
            </DialogTitle>
          </DialogHeader>
          <div className="border rounded-md p-4 bg-muted">
            {isLoadingContent ? (
              <div className="py-8">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <pre className="text-sm overflow-auto max-h-[400px] font-mono whitespace-pre-wrap">
                {selectedTemplateContent || "无法加载模板内容"}
              </pre>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
