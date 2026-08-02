import type { ReactNode } from "react";

export type ContentWidth = "reading" | "wide";

export function DashboardContent({ children, width = "wide" }: { children: ReactNode; width?: ContentWidth }) {
  return <div className={width === "reading" ? "dashboard-reading" : "dashboard-wide"}>{children}</div>;
}
