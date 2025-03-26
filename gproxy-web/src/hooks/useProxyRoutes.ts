import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface ProxyRoute {
  id: string;
  path: string;
  targetUrl: string;
  isMockEnabled: boolean;
  mockTemplateId: string | null;
  status: "active" | "inactive";
}

// Mock data for proxy routes
const initialRoutes: ProxyRoute[] = [];

export function useProxyRoutes() {
  const [routes, setRoutes] = useState<ProxyRoute[]>(initialRoutes);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter routes based on search query
  const filteredRoutes = routes.filter((route) =>
    route.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current routes for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);

  // Delete a route
  const deleteRoute = (id: string) => {
    try {
      setRoutes(routes.filter((route) => route.id !== id));
      toast({
        title: "删除成功",
        description: "代理路由已删除",
      });
    } catch (error) {
      console.error("删除路由时出错:", error);
      toast({
        title: "删除失败",
        description: "无法删除代理路由",
        variant: "destructive",
      });
    }
  };

  return {
    routes: currentRoutes,
    totalRoutes: filteredRoutes.length,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteRoute,
    itemsPerPage,
  };
}
