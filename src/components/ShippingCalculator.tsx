import { useState } from "react";
import { Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ShippingCalculator = () => {
  const [cep, setCep] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    if (cep.length < 8) return;
    
    setLoading(true);
    // Simula cálculo de frete
    setTimeout(() => {
      setCalculated(true);
      setLoading(false);
    }, 800);
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Truck className="h-4 w-4" />
        <span>Calcular Frete</span>
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Digite seu CEP"
          value={cep}
          onChange={(e) => {
            setCep(formatCep(e.target.value));
            setCalculated(false);
          }}
          maxLength={9}
          className="flex-1 bg-white"
        />
        <Button
          onClick={handleCalculate}
          disabled={cep.length < 9 || loading}
          className="bg-black hover:bg-black/90 text-white px-4"
        >
          {loading ? "..." : "Calcular"}
        </Button>
      </div>

      {calculated && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-3 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-success font-medium text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Entrega disponível!</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Envio Padrão</span>
              <span className="font-bold text-success">GRÁTIS</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Prazo estimado: 7-12 dias úteis
            </p>
          </div>
        </div>
      )}

      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
      >
        Não sei meu CEP
      </a>
    </div>
  );
};

export default ShippingCalculator;
