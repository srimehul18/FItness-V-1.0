import React from "react";
import { cn } from "./utils";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export const Card = ({ className, children }: CardProps) => {
  return (
    <div
      className={cn(
        `
        rounded-2xl 
        p-5 
        transition-colors duration-300

        bg-white text-slate-900 shadow-lg

        dark:bg-[#050b1a] 
        dark:text-slate-100 
        dark:shadow-[0_0_30px_rgba(59,130,246,0.15)]
        `,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
