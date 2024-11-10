import * as React from "react"
import { EyeIcon } from "lucide-react";
import { EyeClosedIcon } from "@radix-ui/react-icons";

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    (<div
      className={cn(
        "relative flex h-9 pr-2 w-full rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors items-center file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
        isFocused ? "border-ring focus-visible:ring-1 focus-visible:ring-ring" : "border-input"
      )}
      ref={ref}
    >
          <input 
           type={isVisible ? "text" : "password"} 
           className="h-full w-full bg-transparent px-3 py-1 rounded-md focus:outline-none placeholder:text-muted-foreground"
           onFocus={() => setIsFocused(true)}
           onBlur={() => setIsFocused(false)}
           {...props}
          />
          <div>
          { 
              !isVisible? <EyeIcon className="select-none" onClick={() => setIsVisible(!isVisible)}/> :
              <EyeClosedIcon className="select-none" onClick={() => setIsVisible(!isVisible)}/>
          }
          </div>
    </div>)
  );
})
PasswordInput.displayName = "PasswordInput"

export { Input, PasswordInput }
