// components/ui/textarea.tsx
import * as React from "react";
import { cn } from "./utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return <textarea ref={ref} className={cn("min-h-[80px] w-full rounded-md border px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring", className)} {...props} />;
});
Textarea.displayName = "Textarea";

export default Textarea;
