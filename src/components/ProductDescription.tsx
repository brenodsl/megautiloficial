import { Package, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductDescription = () => {
  return (
    <section className="space-y-4">
      {/* Description Accordion */}
      <Accordion type="single" collapsible defaultValue="description" className="w-full">
        <AccordionItem value="description" className="border rounded-xl px-4">
          <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              Descrição do Produto
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                O <strong className="text-foreground">Tênis de Corrida Carbon 3.0</strong> é a escolha perfeita para corredores que buscam performance máxima. Com tecnologia avançada de <strong className="text-foreground">placa de carbono</strong>, oferece retorno de energia excepcional e propulsão otimizada.
              </p>
              
              <p>
                O <strong className="text-foreground">amortecimento premium</strong> garante absorção de impactos com clareza excepcional, ideal para treinos intensos. O sistema de <strong className="text-foreground">malha respirável</strong> mantém seus pés frescos durante toda a corrida.
              </p>
              
              <p>
                Com <strong className="text-foreground">design ergonômico</strong> e material antiderrapante, o tênis é resistente e perfeito para uso interno e externo. A <strong className="text-foreground">tecnologia ultra leve</strong> permite maior agilidade e conforto.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Kit Contents Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="kit" className="border rounded-xl px-4">
          <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              Conteúdo do Kit
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <ul className="space-y-2.5">
              {[
                "1x Tênis Carbon 3.0 (par)",
                "1x Palmilha extra de conforto",
                "1x Saco organizador",
                "1x Cadarço reserva",
                "1x Manual de cuidados",
                "Garantia de 12 meses",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Technical Specs Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="specs" className="border rounded-xl px-4">
          <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              Especificações Técnicas
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Material", value: "Malha respirável + Carbono" },
                { label: "Peso", value: "220g (por pé)" },
                { label: "Solado", value: "Borracha antiderrapante" },
                { label: "Amortecimento", value: "Espuma de alta densidade" },
                { label: "Tamanhos", value: "33 ao 45" },
                { label: "Garantia", value: "12 meses" },
              ].map((spec, index) => (
                <div key={index} className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{spec.label}</p>
                  <p className="text-sm font-medium text-foreground">{spec.value}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default ProductDescription;
