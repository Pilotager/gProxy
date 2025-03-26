import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateFileDialogProps {
  routeName: string;
  onRouteNameChange: (name: string) => void;
  onCreateFile: () => void;
  isCreating: boolean;
  children: React.ReactNode;
}

export function CreateFileDialog({
  routeName,
  onRouteNameChange,
  onCreateFile,
  isCreating,
  children,
}: CreateFileDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建 Mock 文件</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="route-name">路由名称</Label>
          <Input
            id="route-name"
            value={routeName}
            onChange={(e) => onRouteNameChange(e.target.value)}
            placeholder="例如: api/users"
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-2">
            文件将创建在 templates 目录下对应的路径
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={onCreateFile} disabled={isCreating}>
            {isCreating ? "创建中..." : "创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
