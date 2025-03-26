import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export interface SettingsCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onSave: () => void;
  footer?: React.ReactNode;
}

export const SettingsCard = ({
  title,
  description,
  children,
  onSave,
  footer,
}: SettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onSave}>保存设置</Button>
        {footer}
      </CardFooter>
    </Card>
  );
};
