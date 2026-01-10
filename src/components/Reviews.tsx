import { Star, CheckCircle, ThumbsUp } from "lucide-react";
import review1 from "@/assets/review-1.webp";
import review2 from "@/assets/review-2.webp";
import review3 from "@/assets/review-3.webp";
import review4 from "@/assets/review-4.webp";
import reviewCamila1 from "@/assets/review-camila-1.webp";
import reviewCamila2 from "@/assets/review-camila-2.webp";
import reviewSabrina1 from "@/assets/review-sabrina-1.webp";

const reviews = [
  {
    id: 1,
    name: "Camila R.",
    location: "São Paulo, SP",
    rating: 5,
    date: "há 3 dias",
    comment: "Tênis muito confortável! Uso para correr e o amortecimento é incrível. Chegou rápido e bem embalado. Super recomendo!",
    verified: true,
    helpful: 47,
    images: [reviewCamila1, reviewCamila2],
  },
  {
    id: 2,
    name: "Sabrina M.",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    date: "há 5 dias",
    comment: "Amei as cores! Combina com tudo. Super leve e confortável para o dia a dia. Recomendo demais!",
    verified: true,
    helpful: 32,
    images: [reviewSabrina1],
  },
  {
    id: 3,
    name: "Carlos A.",
    location: "Belo Horizonte, MG",
    rating: 5,
    date: "há 1 semana",
    comment: "Produto de qualidade excelente. Não esperava tanto por esse preço. Já comprei o segundo par!",
    verified: true,
    helpful: 28,
    images: [review1, review2],
  },
  {
    id: 4,
    name: "Fernanda L.",
    location: "Curitiba, PR",
    rating: 5,
    date: "há 1 semana",
    comment: "Perfeito para academia! Muito estiloso e super confortável. Todo mundo pergunta onde comprei.",
    verified: true,
    helpful: 19,
    images: [review3, review4],
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 85 },
  { stars: 4, percentage: 10 },
  { stars: 3, percentage: 3 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
];

const Reviews = () => {
  const averageRating = 4.9;
  const totalReviews = 578;

  return (
    <section id="avaliacoes" className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          O que nossos clientes dizem
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5 fill-warning text-warning"
              />
            ))}
          </div>
          <span className="font-bold text-foreground">{averageRating}</span>
          <span className="text-muted-foreground">
            ({totalReviews} avaliações)
          </span>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Distribuição das avaliações</h3>
        <div className="space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium text-foreground">{item.stars}</span>
                <Star className="h-4 w-4 fill-warning text-warning" />
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-xl bg-card border border-border shadow-sm">
          <p className="text-2xl font-bold text-primary">98%</p>
          <p className="text-xs text-muted-foreground">Recomendam</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-card border border-border shadow-sm">
          <p className="text-2xl font-bold text-primary">+2.5K</p>
          <p className="text-xs text-muted-foreground">Vendidos</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-card border border-border shadow-sm">
          <p className="text-2xl font-bold text-primary">4.9</p>
          <p className="text-xs text-muted-foreground">Nota Média</p>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-xl bg-card border border-border shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {review.name}
                    </span>
                    {review.verified && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {review.location} • {review.date}
                  </p>
                </div>
              </div>
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
            </div>

            <p className="text-sm text-muted-foreground">{review.comment}</p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Foto do cliente ${review.name}`}
                    className="h-24 w-24 object-cover rounded-lg flex-shrink-0 border border-border"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ThumbsUp className="h-3 w-3" />
              <span>{review.helpful} pessoas acharam útil</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
