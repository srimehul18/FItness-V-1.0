// components/ui/avatar.tsx
import * as React from "react";
import { cn } from "./utils";

export const AvatarImage: React.FC<{ src?: string; alt?: string; className?: string }> = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={cn("w-10 h-10 rounded-full object-cover", className)} />;
};

export const AvatarFallback: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className, children }) => {
  return <div className={cn("w-10 h-10 rounded-full bg-muted-foreground text-white flex items-center justify-center", className)}>{children}</div>;
};

export const Avatar: React.FC<{ src?: string; alt?: string; className?: string; children?: React.ReactNode }> = ({ src, alt, className, children }) => {
  if (src) return <AvatarImage src={src} alt={alt} className={className} />;
  return <AvatarFallback className={className}>{children}</AvatarFallback>;
};

export default Avatar;
