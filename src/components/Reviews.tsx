import { useState } from "react";
import { Star, CheckCircle, ThumbsUp } from "lucide-react";
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
    date: "02/01/2025",
    rating: 5,
    comment: "Tênis incrível! A placa de carbono realmente faz diferença na corrida. Super leve e confortável, uso para treinos e provas. Chegou rápido e bem embalado!",
    verified: true,
    helpful: 34,
    images: [reviewSabrina1, reviewSabrina2],
  },
  {
    id: 2,
    name: "Camila Souza",
    date: "30/12/2024",
    rating: 5,
    comment: "Comprei para meu marido e ele amou! O design é lindo e o conforto é impressionante. Ele usa para correr todos os dias e diz que nunca teve um tênis tão bom.",
    verified: true,
    helpful: 28,
    images: [reviewCamila1, reviewCamila2],
  },
  {
    id: 3,
    name: "Fernando Costa",
    date: "28/12/2024",
    rating: 5,
    comment: "Excelente custo-benefício! Placa de carbono por esse preço é muito difícil encontrar. O acabamento é de qualidade e o retorno de energia é muito bom.",
    verified: true,
    helpful: 22,
    images: [review1, review2],
  },
  {
    id: 4,
    name: "Ana Paula",
    date: "25/12/2024",
    rating: 5,
    comment: "Perfeito para academia! Muito estiloso e super confortável. Todo mundo pergunta onde comprei.",
    verified: true,
    helpful: 19,
    images: [review4],
  },
  {
    id: 5,
    name: "Ricardo Almeida",
    date: "22/12/2024",
    rating: 5,
    comment: "Melhor tênis de corrida que já tive! A placa de carbono dá uma propulsão incrível. Uso para maratonas e meias maratonas. Superou todas as minhas expectativas!",
    verified: true,
    helpful: 45,
    images: [],
  },
  {
    id: 6,
    name: "Juliana Martins",
    date: "20/12/2024",
    rating: 5,
    comment: "Tênis muito bonito e confortável. Comprei na cor rosa e ficou lindo! A entrega foi super rápida e veio bem embalado. Recomendo muito!",
    verified: true,
    helpful: 31,
    images: [],
  },
  {
    id: 7,
    name: "Marcos Silva",
    date: "18/12/2024",
    rating: 4,
    comment: "Ótimo tênis! O único ponto é que poderia ter mais opções de cores. Mas no geral, o conforto e a qualidade são excelentes. Vale muito a pena pelo preço.",
    verified: true,
    helpful: 18,
    images: [],
  },
  {
    id: 8,
    name: "Patricia Oliveira",
    date: "15/12/2024",
    rating: 5,
    comment: "Comprei para minha filha que é atleta e ela adorou! O tênis é muito leve e o retorno de energia é impressionante. Ela já quer comprar outro de reserva!",
    verified: true,
    helpful: 27,
    images: [],
  },
  {
    id: 9,
    name: "Bruno Santos",
    date: "12/12/2024",
    rating: 5,
    comment: "Excelente! Uso para treinos diários e o conforto é surpreendente. O amortecimento é perfeito e não sinto mais dores nos joelhos após as corridas.",
    verified: true,
    helpful: 36,
    images: [],
  },
  {
    id: 10,
    name: "Carla Fernandes",
    date: "10/12/2024",
    rating: 5,
    comment: "Já estou no meu segundo par! O primeiro durou mais de um ano com uso intenso. A qualidade é incomparável e o preço é justo. Super recomendo!",
    verified: true,
    helpful: 42,
    images: [],
  },
];

const ratingDistribution = [
  { stars: 5, count: 492, percentage: 85 },
  { stars: 4, count: 58, percentage: 10 },
  { stars: 3, count: 17, percentage: 3 },
  { stars: 2, count: 6, percentage: 1 },
  { stars: 1, count: 5, percentage: 1 },
];

const Reviews = () => {
  const averageRating = 4.9;
  const totalReviews = 578;
  const [showAll, setShowAll] = useState(false);
  
  const visibleReviews = showAll ? reviews : reviews.slice(0, 4);

  return (
    <section id="avaliacoes" className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-bold text-foreground">
        Avaliações
      </h2>

      {/* Rating Summary Card */}
      <div className="bg-white rounded-lg border border-border p-4">
        <div className="flex items-start gap-6">
          {/* Average Score */}
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">{averageRating}</div>
            <div className="flex justify-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{totalReviews} avaliações</div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-1.5">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 text-sm">
                <span className="w-16 text-muted-foreground">{item.stars} estrelas</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-muted-foreground text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg border border-border p-4 space-y-3"
          >
            {/* Date */}
            <div className="text-sm text-muted-foreground">{review.date}</div>

            {/* Rating Stars */}
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "fill-warning text-warning"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Foto do cliente ${review.name}`}
                    className="h-20 w-20 object-cover rounded-lg border border-border"
                  />
                ))}
              </div>
            )}

            {/* Author */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{review.name}</span>
                {review.verified && (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
              </div>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Útil ({review.helpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ver Mais Button */}
      {!showAll && reviews.length > 4 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-center text-sm font-medium text-foreground bg-white border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          Ver mais avaliações ({reviews.length - 4} restantes)
        </button>
      )}

      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-3 text-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver menos
        </button>
      )}
    </section>
  );
};

export default Reviews;
