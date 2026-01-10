import { CheckCircle } from "lucide-react";
import tamanhosImg from "@/assets/tamanhos.png";

const features = [
  "Placa de carbono para máximo retorno de energia",
  "Malha respirável ultra leve",
  "Entressola em espuma de alta densidade",
  "Solado de borracha antiderrapante",
  "Design ergonômico para corridas longas",
  "Peso aproximado: 220g (tam. 40)",
];

const ProductDescription = () => {
  return (
    <section className="py-4">
      <h3 className="text-lg font-bold text-foreground mb-4">Descrição do Produto</h3>
      
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          O Tênis de Corrida Carbon 3.0 é a escolha perfeita para corredores que buscam performance máxima. 
          Equipado com placa de carbono de última geração, oferece retorno de energia excepcional e propulsão 
          otimizada a cada passada.
        </p>
        
        <p>
          Design aerodinâmico com malha respirável de alta tecnologia que mantém seus pés frescos e secos 
          durante toda a corrida. O sistema de amortecimento em espuma de alta densidade absorve impactos 
          e proporciona conforto duradouro.
        </p>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-foreground mb-3">Características:</h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-foreground mb-3">Tabela de Tamanhos:</h4>
        <img 
          src={tamanhosImg} 
          alt="Tabela de tamanhos do tênis" 
          className="w-full rounded-lg"
        />
      </div>
    </section>
  );
};

export default ProductDescription;
