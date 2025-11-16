// components/ui/label.tsx
import * as React from "react";
import { cn } from "./utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, children, ...props }, ref) => {
  return (
    <label ref={ref} className={cn("block text-sm font-medium text-muted-foreground", className)} {...props}>
      {children}
    </label>
  );
});
Label.displayName = "Label";

export default Label;
