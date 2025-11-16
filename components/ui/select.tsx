// components/ui/select.tsx
import * as React from "react";
import { cn } from "./utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => {
  return (
    <select ref={ref} className={cn("w-full rounded-md border px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring", className)} {...props}>
      {children}
    </select>
  );
});
Select.displayName = "Select";

export const SelectTrigger = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const SelectContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const SelectItem = ({ children, value, ...props }: any) => <option value={value} {...props}>{children}</option>;
export const SelectValue = ({ children, ...props }: any) => <span {...props}>{children}</span>;

export default Select;
