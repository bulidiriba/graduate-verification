"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

const StepsContext = React.createContext<{
  activeStep: number
  setActiveStep?: (step: number) => void
}>({
  activeStep: 1,
})

interface StepsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  activeStep: number
  setActiveStep?: (step: number) => void
  children?: React.ReactNode
}

const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ activeStep, setActiveStep, className, children, ...props }, ref) => {
    return (
      <StepsContext.Provider value={{ activeStep, setActiveStep }}>
        <div ref={ref} className={cn("flex w-full", className)} {...props}>
          {children}
        </div>
      </StepsContext.Provider>
    )
  },
)
Steps.displayName = "Steps"

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  label: string
  description?: string
  clickable?: boolean
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ step, label, description, clickable = false, className, ...props }, ref) => {
    const { activeStep, setActiveStep } = React.useContext(StepsContext)
    const isActive = activeStep === step
    const isCompleted = activeStep > step
    const isLast = React.useMemo(() => {
      const parent = props.children as React.ReactElement[]
      return !parent || !Array.isArray(parent) || parent.length === 0
    }, [props.children])

    const handleClick = () => {
      if (clickable && setActiveStep && (isCompleted || step === activeStep - 1)) {
        setActiveStep(step)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-1 items-center",
          clickable && (isCompleted || step === activeStep - 1) && "cursor-pointer",
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2 text-center font-medium",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-gray-300 bg-white text-gray-500",
            )}
          >
            {isCompleted ? <CheckIcon className="h-5 w-5" /> : step}
          </div>
          <div className="mt-2 text-center">
            <div className={cn("text-sm font-medium", isActive || isCompleted ? "text-gray-900" : "text-gray-500")}>
              {label}
            </div>
            {description && <div className="mt-1 text-xs text-gray-500">{description}</div>}
          </div>
        </div>
        {!isLast && <div className={cn("flex-1 border-t-2", isCompleted ? "border-primary" : "border-gray-200")} />}
      </div>
    )
  },
)
Step.displayName = "Step"

export { Steps, Step }
