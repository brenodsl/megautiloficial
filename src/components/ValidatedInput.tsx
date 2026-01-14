import { forwardRef } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isValid?: boolean;
  icon?: React.ReactNode;
}

const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ isValid, icon, className, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(
            "h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all",
            icon && "pl-10",
            isValid && "pr-10 border-[#28af60]/50 bg-green-50/30",
            className
          )}
          {...props}
        />
        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 rounded-full bg-[#28af60] flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          </div>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";

export default ValidatedInput;
