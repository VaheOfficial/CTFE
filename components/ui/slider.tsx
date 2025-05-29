import * as React from "react";
import { cn } from "../../lib/utils";

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  defaultValue?: number[];
  value?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ 
    className, 
    defaultValue = [0], 
    value, 
    min = 0, 
    max = 100, 
    step = 1, 
    onValueChange,
    disabled = false,
    ...props 
  }, ref) => {
    const [localValue, setLocalValue] = React.useState(defaultValue);
    const actualValue = value !== undefined ? value : localValue;
    const trackRef = React.useRef<HTMLDivElement>(null);
    
    const handleChange = (newValue: number[]) => {
      if (!disabled) {
        setLocalValue(newValue);
        onValueChange?.(newValue);
      }
    };
    
    const calculateValueFromPosition = (position: number) => {
      if (!trackRef.current) return min;
      
      const trackRect = trackRef.current.getBoundingClientRect();
      const trackWidth = trackRect.width;
      const percentage = Math.max(0, Math.min(1, position / trackWidth));
      const rawValue = min + percentage * (max - min);
      const snappedValue = Math.round(rawValue / step) * step;
      
      return Math.max(min, Math.min(max, snappedValue));
    };
    
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!trackRef.current) return;
        
        const trackRect = trackRef.current.getBoundingClientRect();
        const relativeX = moveEvent.clientX - trackRect.left;
        const newValue = calculateValueFromPosition(relativeX);
        handleChange([newValue]);
      };
      
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      
      // Initial position
      handleMouseMove(e.nativeEvent);
      
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };
    
    // Calculate percentage for rendering
    const percentage = ((actualValue[0] - min) / (max - min)) * 100;
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full h-5 flex items-center", 
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <div
          ref={trackRef}
          className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden"
          onMouseDown={handleMouseDown}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={actualValue[0]}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (disabled) return;
            
            const currentValue = actualValue[0];
            let newValue = currentValue;
            
            switch (e.key) {
              case "ArrowRight":
              case "ArrowUp":
                newValue = Math.min(max, currentValue + step);
                break;
              case "ArrowLeft":
              case "ArrowDown":
                newValue = Math.max(min, currentValue - step);
                break;
              case "Home":
                newValue = min;
                break;
              case "End":
                newValue = max;
                break;
              default:
                return;
            }
            
            e.preventDefault();
            if (newValue !== currentValue) {
              handleChange([newValue]);
            }
          }}
        >
          <div 
            className="h-full bg-[#ff6b00]" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div 
          className={cn(
            "absolute w-4 h-4 rounded-full bg-white shadow-md transform -translate-y-1/2 -translate-x-1/2 border-2 border-[#ff6b00] transition-transform",
            disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
          )}
          style={{ 
            left: `${percentage}%`,
            top: "50%" 
          }}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider }; 