// components/ui/badge.tsx
import * as React from "react";
import { cn } from "./utils";

export const Badge: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted-foreground/10 text-muted-foreground", className)}>{children}</span>;
};

export default Badge;
