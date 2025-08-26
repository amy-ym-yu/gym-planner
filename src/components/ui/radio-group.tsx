import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

export const RadioGroup = RadioGroupPrimitive.Root

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={`h-5 w-5 rounded-full border border-primary flex items-center justify-center ${className ?? ""}`}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="h-3 w-3 rounded-full bg-primary" />
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = "RadioGroupItem"