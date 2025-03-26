"use client";

import React from "react";
import { PageHeader } from "@/components/proxy/PageHeader";
import { ProxyRoutesTable } from "@/components/proxy/ProxyRoutesTable";

export default function ProxyPage() {
  return (
    <div className="space-y-4">
      <PageHeader />
      <ProxyRoutesTable />
    </div>
  );
}
