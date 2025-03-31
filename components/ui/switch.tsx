import * as React from "react";
import { cn } from "../../lib/utils";

export interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled = false, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!disabled && onCheckedChange) {
          onCheckedChange(!checked);
        }
      }
    };

    return (
      <div
        ref={ref}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        data-state={checked ? "checked" : "unchecked"}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-[#ff6b00] dark:bg-[#ff6b00]"
            : "bg-[#2a2a2a] dark:bg-[#2a2a2a]",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch }; 