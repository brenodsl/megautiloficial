import tamanhosImg from "@/assets/tamanhos.png";

const ProductDescription = () => {
  return (
    <section className="py-2">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Descrição do Produto</h3>
      
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
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

      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 mb-3">Tabela de Tamanhos:</h4>
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