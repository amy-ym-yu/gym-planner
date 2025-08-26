import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className = "", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`h-5 w-5 rounded border border-primary flex items-center justify-center ${className}`}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="text-primary">
      ✓
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = "Checkbox"