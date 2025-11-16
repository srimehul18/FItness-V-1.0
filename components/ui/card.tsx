import React from "react";
import { cn } from "./utils";

export const Card: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className, children }) => {
  return <div className={cn("card", className)}>{children}</div>;
};

export default Card;
