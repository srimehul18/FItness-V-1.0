// components/ui/tabs.tsx
import * as React from "react";
import { cn } from "./utils";

export const Tabs = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
};

export const TabsList = ({ children, className }: any) => <div className={cn("flex gap-2", className)}>{children}</div>;
export const TabsTrigger = ({ children, className, ...props }: any) => (
  <button className={cn("px-3 py-1 rounded-md text-sm hover:bg-accent/5", className)} {...props}>
    {children}
  </button>
);
export const TabsContent = ({ children, className }: any) => <div className={cn("mt-4", className)}>{children}</div>;

export default Tabs;
