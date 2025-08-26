import React from 'react'
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"

// Type definitions - these extend the original Radix props (including children)
interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  className?: string
  children?: React.ReactNode
}

interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  className?: string  
  children?: React.ReactNode
}

interface SelectItemProps {
  className?: string
  children?: React.ReactNode
  value: string
  disabled?: boolean
  onSelect?: () => void
}

// Type definition for Select root
interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

// Root Select component
const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(({ ...props }, ref) => (
  <SelectPrimitive.Root ref={ref} {...props} />
))
Select.displayName = "Select"

// Trigger (the button you click to open dropdown)
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={`
      flex h-10 w-full items-center justify-between 
      rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
      hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
      disabled:cursor-not-allowed disabled:opacity-50
      ${className}
    `}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-70" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

// Content (the dropdown menu)
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={`
        z-50 min-w-[8rem] overflow-hidden 
        rounded-md border border-gray-200 bg-white shadow-lg
        ${className}
      `}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = "SelectContent"

// Individual option items
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={`
      relative flex w-full cursor-pointer select-none items-center 
      rounded-sm py-2 pl-8 pr-2 text-sm 
      hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
      data-[disabled]:pointer-events-none data-[disabled]:opacity-50
      ${className}
    `}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"

// Value placeholder
const SelectValue = SelectPrimitive.Value

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
}