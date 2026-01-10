import { ChevronRight } from "lucide-react";

const Breadcrumb = () => {
  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-2">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-hide">
          <a href="#" className="hover:text-foreground transition-colors">Início</a>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <a href="#" className="hover:text-foreground transition-colors">Calçados</a>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <a href="#" className="hover:text-foreground transition-colors">Tênis de Corrida</a>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-foreground font-medium">Carbon 3.0</span>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
