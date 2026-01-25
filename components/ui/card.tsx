import React from "react";
import { cn } from "./utils";

export const Card: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[rgb(var(--card))] shadow-xl border border-white/10 dark:border-blue-500/20 transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
