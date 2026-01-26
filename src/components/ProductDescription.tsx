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
                O <strong className="text-foreground">Kit 3 Câmeras Wi-Fi Full HD com Lente Dupla</strong> é a solução completa para a segurança da sua casa ou empresa. Com tecnologia avançada de <strong className="text-foreground">lente dupla (3,6mm + 6mm)</strong>, oferece imagens de alta qualidade tanto de perto quanto de longe.
              </p>
              
              <p>
                A <strong className="text-foreground">visão noturna colorida</strong> garante monitoramento 24 horas com clareza excepcional, mesmo em ambientes com pouca luz. O sistema de <strong className="text-foreground">rastreamento humano inteligente</strong> detecta e segue automaticamente pessoas em movimento, enviando alertas em tempo real para seu celular.
              </p>
              
              <p>
                Com <strong className="text-foreground">proteção IP66</strong>, as câmeras são resistentes à água e poeira, perfeitas para uso interno e externo. O <strong className="text-foreground">áudio bidirecional</strong> permite que você ouça e fale através do app, ideal para comunicação com familiares ou para alertar intrusos.
              </p>

              <p>
                Configure facilmente através do app <strong className="text-foreground">iCSee</strong>, disponível para iOS e Android. Armazene suas gravações em cartão SD (até 128GB) ou utilize o armazenamento em nuvem.
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
                "3x Câmeras Wi-Fi Full HD 1080P",
                "3x Suportes de parede com parafusos",
                "3x Cabos USB de alimentação (2m)",
                "3x Fontes de energia 5V/2A",
                "1x Manual de instalação em português",
                "1x Adesivo de aviso de vigilância",
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
                { label: "Resolução", value: "Full HD 1080P" },
                { label: "Lentes", value: "Dupla 3,6mm + 6mm" },
                { label: "Visão Noturna", value: "Colorida até 15m" },
                { label: "Proteção", value: "IP66 (água/poeira)" },
                { label: "Áudio", value: "Bidirecional" },
                { label: "Armazenamento", value: "SD até 128GB / Nuvem" },
                { label: "Conectividade", value: "Wi-Fi 2.4GHz" },
                { label: "App", value: "iCSee (iOS/Android)" },
                { label: "Alimentação", value: "5V/2A DC" },
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
