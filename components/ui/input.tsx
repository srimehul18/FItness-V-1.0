// components/ui/input.tsx
import * as React from "react";
import { cn } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input ref={ref} className={cn("block w-full rounded-md border px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring", className)} {...props} />;
});
Input.displayName = "Input";

export { Input };
export default Input;
