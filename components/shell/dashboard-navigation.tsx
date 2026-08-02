"use client";

import { usePathname } from "next/navigation";
import { MobileNavigation } from "./mobile-navigation";
import { Sidebar } from "./sidebar";

export function DashboardNavigation({ placement }: { placement: "mobile" | "sidebar" }) {
  const currentPath = usePathname() || "/";

  return placement === "sidebar" ? <Sidebar currentPath={currentPath} /> : <MobileNavigation currentPath={currentPath} />;
}
