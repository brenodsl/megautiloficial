import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import review1 from "@/assets/review-1.webp";
import review2 from "@/assets/review-2.webp";
import review4 from "@/assets/review-4.webp";
import reviewCamila1 from "@/assets/review-camila-1.webp";
import reviewCamila2 from "@/assets/review-camila-2.webp";
import reviewSabrina1 from "@/assets/review-sabrina-1.webp";
import reviewSabrina2 from "@/assets/review-sabrina-2.webp";

const reviews = [
  {
    id: 1,
    name: "Sabrina Viana",
    date: "08/01/2026",
    rating: 5,
    comment: "Tênis incrível! A placa de carbono realmente faz diferença na corrida. Super leve e confortável, uso para treinos e provas. Chegou rápido e bem embalado!",
    helpful: 34,
    images: [reviewSabrina1, reviewSabrina2],
  },
  {
    id: 2,
    name: "Camila Souza",
    date: "06/01/2026",
    rating: 5,
    comment: "Comprei para meu marido e ele amou! O design é lindo e o conforto é impressionante. Ele usa para correr todos os dias e diz que nunca teve um tênis tão bom.",
    helpful: 28,
    images: [reviewCamila1, reviewCamila2],
  },
  {
    id: 3,
    name: "Fernando Costa",
    date: "04/01/2026",
    rating: 5,
    comment: "Excelente custo-benefício! Placa de carbono por esse preço é muito difícil encontrar. O acabamento é de qualidade e o retorno de energia é muito bom.",
    helpful: 22,
    images: [review1, review2],
  },
  {
    id: 4,
    name: "Ana Paula",
    date: "02/01/2026",
    rating: 5,
    comment: "Perfeito para academia! Muito estiloso e super confortável. Todo mundo pergunta onde comprei.",
    helpful: 19,
    images: [review4],
  },
  {
    id: 5,
    name: "Ricardo Almeida",
    date: "30/12/2025",
    rating: 5,
    comment: "Melhor tênis de corrida que já tive! A placa de carbono dá uma propulsão incrível. Uso para maratonas e meias maratonas. Superou todas as minhas expectativas!",
    helpful: 45,
    images: [],
  },
  {
    id: 6,
    name: "Juliana Martins",
    date: "28/12/2025",
    rating: 5,
    comment: "Tênis muito bonito e confortável. Comprei na cor rosa e ficou lindo! A entrega foi super rápida e veio bem embalado. Recomendo muito!",
    helpful: 31,
    images: [],
  },
  {
    id: 7,
    name: "Marcos Silva",
    date: "25/12/2025",
    rating: 4,
    comment: "Ótimo tênis! O único ponto é que poderia ter mais opções de cores. Mas no geral, o conforto e a qualidade são excelentes. Vale muito a pena pelo preço.",
    helpful: 18,
    images: [],
  },
  {
    id: 8,
    name: "Patricia Oliveira",
    date: "22/12/2025",
    rating: 5,
    comment: "Comprei para minha filha que é atleta e ela adorou! O tênis é muito leve e o retorno de energia é impressionante. Ela já quer comprar outro de reserva!",
    helpful: 27,
    images: [],
  },
];

const ratingDistribution = [
  { stars: 5, count: 156 },
  { stars: 4, count: 32 },
  { stars: 3, count: 8 },
  { stars: 2, count: 2 },
  { stars: 1, count: 2 },
];

const Reviews = () => {
  const averageRating = 4.9;
  const totalReviews = 327;
  const [showAll, setShowAll] = useState(false);
  
  const visibleReviews = showAll ? reviews : reviews.slice(0, 4);
  const totalCount = ratingDistribution.reduce((sum, r) => sum + r.count, 0);

  return (
    <section id="avaliacoes" className="space-y-6">
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-900">
        Opiniões do produto
      </h2>

      {/* Rating Summary */}
      <div className="text-center pb-4">
        {/* 5 Stars */}
        <div className="flex justify-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        
        {/* Average Score */}
        <div className="text-4xl font-bold text-gray-900 mb-1">{averageRating}</div>
        <div className="text-sm text-gray-500 mb-6">{totalReviews} avaliações</div>

        {/* Rating Distribution Bars */}
        <div className="space-y-2 max-w-sm mx-auto">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3 text-sm">
              <span className="w-16 text-left text-gray-600">{item.stars}<br/>estrelas</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${(item.count / totalCount) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-gray-500">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Review Cards */}
      <div className="space-y-6">
        {visibleReviews.map((review) => (
          <div key={review.id} className="space-y-3">
            {/* Rating Stars and Date */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>

            {/* Comment */}
            <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Foto do cliente ${review.name}`}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Author and Helpful */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{review.name}</span>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span>Útil ({review.helpful})</span>
              </button>
            </div>

            {/* Separator between reviews */}
            <div className="border-t border-gray-100 pt-2" />
          </div>
        ))}
      </div>

      {/* Ver Mais Button */}
      {!showAll && reviews.length > 4 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Ver mais avaliações ({reviews.length - 4} restantes)
        </button>
      )}

      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-3 text-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          Ver menos
        </button>
      )}
    </section>
  );
};

export default Reviews;