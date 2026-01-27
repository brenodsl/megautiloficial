import { Check, FileText, Package, Truck } from "lucide-react";

interface PaymentProgressBarProps {
  currentStep: 1 | 2 | 3 | 4;
}

const steps = [
  { id: 1, label: "AGUARDANDO", icon: FileText },
  { id: 2, label: "CONFIRMADO", icon: Check },
  { id: 3, label: "SEPARAÇÃO", icon: Package },
  { id: 4, label: "ENVIADO", icon: Truck },
];

const PaymentProgressBar = ({ currentStep }: PaymentProgressBarProps) => {
  return (
    <div className="bg-[#f5f5f5] py-6 px-4">
      <div className="max-w-lg mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-between relative mb-6">
          {/* Progress Line Background */}
          <div className="absolute top-6 left-[12%] right-[12%] h-0.5 bg-gray-300 -z-0" />
          {/* Progress Line Active */}
          <div 
            className="absolute top-6 left-[12%] h-0.5 bg-[#28af60] transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / 3) * 76}%` }}
          />
          
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center z-10">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#28af60] text-white"
                      : isCurrent
                      ? "bg-[#28af60] text-white ring-4 ring-[#28af60]/10 animate-[pulse_8s_ease-in-out_infinite]"
                      : "bg-white text-gray-400 border border-gray-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-[10px] mt-2 font-semibold tracking-wide ${
                    isCompleted || isCurrent ? "text-[#28af60]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Express Shipping Banner */}
        <div className="bg-[#e8f5e9] rounded-lg p-4 flex items-start gap-3">
          <div className="bg-[#28af60] rounded-full p-2 flex-shrink-0">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[#28af60] font-bold text-sm">ENVIO EXPRESSO HOJE!</p>
            <p className="text-[#28af60]/80 text-xs">
              Pagamentos confirmados até às 15h são enviados no mesmo dia!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProgressBar;
