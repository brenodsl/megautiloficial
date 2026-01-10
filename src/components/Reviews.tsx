import { Star, CheckCircle, ThumbsUp } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Marcelo S.",
    location: "São Paulo, SP",
    rating: 5,
    date: "há 3 dias",
    comment: "Tênis muito confortável! Uso para correr e o amortecimento é incrível. Chegou rápido e bem embalado.",
    verified: true,
    helpful: 47,
  },
  {
    id: 2,
    name: "Juliana M.",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    date: "há 5 dias",
    comment: "Amei as cores! Combina com tudo. Super leve e confortável para o dia a dia. Recomendo demais!",
    verified: true,
    helpful: 32,
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
  },
];

const Reviews = () => {
  const averageRating = 4.9;
  const totalReviews = 2847;

  return (
    <section className="space-y-6">
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
            ({totalReviews.toLocaleString()} avaliações)
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-xl gradient-card border border-border">
          <p className="text-2xl font-bold text-gradient">98%</p>
          <p className="text-xs text-muted-foreground">Recomendam</p>
        </div>
        <div className="text-center p-4 rounded-xl gradient-card border border-border">
          <p className="text-2xl font-bold text-gradient">+2.5K</p>
          <p className="text-xs text-muted-foreground">Vendidos</p>
        </div>
        <div className="text-center p-4 rounded-xl gradient-card border border-border">
          <p className="text-2xl font-bold text-gradient">4.9</p>
          <p className="text-xs text-muted-foreground">Nota Média</p>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-xl gradient-card border border-border space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
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
