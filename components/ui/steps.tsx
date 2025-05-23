"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const StepsContext = React.createContext<{
  value: number
  onChange: (value: number) => void
}>({
  value: 1,
  onChange: () => {},
})

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  onChange?: (value: number) => void
  children?: React.ReactNode
}

const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ value, onChange, className, children, ...props }, ref) => {
    const handleChange = React.useCallback(
      (value: number) => {
        onChange?.(value)
      },
      [onChange],
    )

    return (
      <StepsContext.Provider value={{ value, onChange: handleChange }}>
        <div ref={ref} className={cn("flex items-center w-full", className)} {...props}>
          {children}
        </div>
      </StepsContext.Provider>
    )
  },
)
Steps.displayName = "Steps"

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  children?: React.ReactNode
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(({ value, className, children, ...props }, ref) => {
  const { value: currentValue } = React.useContext(StepsContext)
  const isActive = currentValue === value
  const isCompleted = currentValue > value

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 flex items-center gap-2",
        {
          "": isActive,
          "": isCompleted,
        },
        className,
      )}
      {...props}
    >
      <div
        className={cn("flex items-center justify-center rounded-full w-8 h-8 text-sm font-medium border", {
          "bg-primary text-primary-foreground border-primary": isActive,
          "bg-primary/20 text-primary border-primary/20": isCompleted,
          "bg-background border-border": !isActive && !isCompleted,
        })}
      >
        {isCompleted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          value
        )}
      </div>
      <span
        className={cn("text-sm font-medium", {
          "text-foreground": isActive,
          "text-muted-foreground": !isActive,
        })}
      >
        {children}
      </span>
      {value !== 3 && (
        <div
          className={cn("flex-1 h-px bg-border", {
            "bg-primary/50": isCompleted,
          })}
        />
      )}
    </div>
  )
})
Step.displayName = "Step"

export { Steps, Step }
