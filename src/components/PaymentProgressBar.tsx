import { Check, CreditCard, Package, Truck } from "lucide-react";

interface PaymentProgressBarProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: "Confirmação", icon: CreditCard },
  { id: 2, label: "Separação", icon: Package },
  { id: 3, label: "Envio", icon: Truck },
];

const PaymentProgressBar = ({ currentStep }: PaymentProgressBarProps) => {
  return (
    <div className="bg-white border-b border-gray-100 py-4 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
          <div 
            className="absolute top-5 left-0 h-0.5 bg-[#28af60] transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
          
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#28af60] text-white"
                      : isCurrent
                      ? "bg-[#28af60] text-white ring-4 ring-[#28af60]/20 animate-pulse"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium ${
                    isCompleted || isCurrent ? "text-[#28af60]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentProgressBar;
