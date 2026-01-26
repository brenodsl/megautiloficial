import { useState, useMemo, useEffect } from "react";
import { Star, ThumbsUp, X, MapPin, CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ReviewForm from "@/components/ReviewForm";
import { supabase } from "@/integrations/supabase/client";
import reviewCamera1 from "@/assets/review-camera-1.webp";
import reviewCamera2 from "@/assets/review-camera-2.webp";
import reviewCamera3 from "@/assets/review-camera-3.webp";
import reviewCamera4 from "@/assets/review-camera-4.webp";

const getDynamicDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('pt-BR');
};

interface ReviewMedia {
  type: 'image';
  src: string;
}

interface Review {
  id: number;
  name: string;
  location: string;
  daysAgo: number;
  rating: number;
  comment: string;
  helpful: number;
  media: ReviewMedia[];
}

const reviewsData: Review[] = [
  {
    id: 1,
    name: "Maria S.",
    location: "São Paulo, SP",
    daysAgo: 1,
    rating: 5,
    comment: "Entrega rápida, produto excelente! As 3 câmeras chegaram bem embaladas e funcionam perfeitamente. A qualidade da imagem é incrível!",
    helpful: 127,
    media: [{ type: 'image', src: reviewCamera1 }],
  },
  {
    id: 2,
    name: "Carlos M.",
    location: "Rio de Janeiro, RJ",
    daysAgo: 2,
    rating: 5,
    comment: "Qualidade impressionante! Instalei em casa e a imagem é muito nítida, mesmo à noite. Super recomendo!",
    helpful: 98,
    media: [{ type: 'image', src: reviewCamera2 }],
  },
  {
    id: 3,
    name: "Ana Paula S.",
    location: "Belo Horizonte, MG",
    daysAgo: 3,
    rating: 5,
    comment: "Super recomendo! O app funciona muito bem e consigo ver tudo pelo celular de qualquer lugar.",
    helpful: 76,
    media: [{ type: 'image', src: reviewCamera3 }],
  },
  {
    id: 4,
    name: "Roberto F.",
    location: "Curitiba, PR",
    daysAgo: 4,
    rating: 5,
    comment: "Chegou antes do prazo! Produto bem embalado e de ótima qualidade. As 3 câmeras funcionam perfeitamente.",
    helpful: 64,
    media: [{ type: 'image', src: reviewCamera4 }],
  },
];

interface UserReview {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const Reviews = () => {
  const averageRating = 4.5;
  const totalReviews = 127;
  const [showAll, setShowAll] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<ReviewMedia | null>(null);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  
  useEffect(() => {
    const fetchUserReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data) {
        setUserReviews(data);
      }
    };
    
    fetchUserReviews();
  }, []);
  
  const reviews = useMemo(() => 
    reviewsData.map(review => ({
      ...review,
      date: getDynamicDate(review.daysAgo),
    })), 
  []);
  
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section id="avaliacoes" className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          Avaliações de Clientes
        </h2>
        <div className="flex items-center gap-1.5">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-foreground">{averageRating}</span>
          <span className="text-sm text-muted-foreground">({totalReviews})</span>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <div key={review.id} className="bg-white border border-border rounded-xl p-4 space-y-3">
            {/* User Info Row */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {review.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground text-sm">{review.name}</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{review.location}</span>
                </div>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

            {/* Review Media */}
            {review.media && review.media.length > 0 && (
              <div className="flex gap-2">
                {review.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMedia(media)}
                    className="relative h-20 w-20 rounded-lg overflow-hidden group cursor-pointer border border-border"
                  >
                    <img
                      src={media.src}
                      alt={`Mídia do cliente ${review.name}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Helpful */}
            <div className="flex items-center text-xs text-muted-foreground pt-1">
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              <span>{review.helpful} pessoas acharam isso útil</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ver Mais Button */}
      {!showAll && reviews.length > 3 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-center text-sm font-medium text-primary bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
        >
          Ver mais avaliações
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

      {/* User Submitted Reviews */}
      {userReviews.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground">Avaliações recentes</h3>
          {userReviews.map((review) => (
            <div key={review.id} className="bg-secondary/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
              <p className="text-xs text-foreground font-medium">— {review.customer_name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      <div className="pt-6 border-t border-border">
        <ReviewForm onReviewSubmitted={() => {
          supabase
            .from("reviews")
            .select("*")
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(10)
            .then(({ data }) => {
              if (data) setUserReviews(data);
            });
        }} />
      </div>

      {/* Media Modal */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black border-none">
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={selectedMedia?.src}
            alt="Avaliação do cliente"
            className="w-full max-h-[80vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Reviews;
