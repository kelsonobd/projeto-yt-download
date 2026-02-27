import * as React from "react";
import { cn } from "@/lib/utils";

interface InputWithIconProps extends React.ComponentProps<"input"> {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
  onIconClick?: () => void;  
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, type, icon, iconPosition = "left", onIconClick, ...props }, ref) => {
    const paddingClass = iconPosition === "left" ? "pl-10" : "pr-10";
    const iconPositionClass = iconPosition === "left" ? "left-3" : "right-3";
    
    return (
      <div className="relative w-full">
        <div 
          className={`absolute ${iconPositionClass} top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors`}
          onClick={onIconClick}
        >
          {icon}
        </div>
        <input
          type={type}
          className={cn(
            `flex h-9 w-full rounded-md border border-input bg-transparent ${paddingClass} pr-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };