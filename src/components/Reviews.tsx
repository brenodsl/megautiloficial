import { useState, useMemo, useEffect } from "react";
import { Star, ThumbsUp, X, Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ReviewForm from "@/components/ReviewForm";
import { supabase } from "@/integrations/supabase/client";
import review1 from "@/assets/review-1.webp";
import review2 from "@/assets/review-2.webp";
import review4 from "@/assets/review-4.webp";
import reviewCamila1 from "@/assets/review-camila-1.webp";
import reviewCamila2 from "@/assets/review-camila-2.webp";
import reviewSabrina1 from "@/assets/review-sabrina-1.webp";
import reviewSabrina2 from "@/assets/review-sabrina-2.webp";
import avaliacao01Video from "@/assets/avaliacao01-video.mp4";
import avaliacao01Img from "@/assets/avaliacao01-img.png";
import avaliacao02Img1 from "@/assets/avaliacao02-img1.webp";
import avaliacao02Img2 from "@/assets/avaliacao02-img2.webp";
import avaliacao03Video from "@/assets/avaliacao03-video.mp4";
import avaliacao03Img from "@/assets/avaliacao03-img.webp";
import avaliacao04Img1 from "@/assets/avaliacao04-img1.webp";
import avaliacao04Img2 from "@/assets/avaliacao04-img2.webp";
import avaliacao05Video from "@/assets/avaliacao05-video.mp4";
import avaliacao05Img from "@/assets/avaliacao05-img.webp";

// Helper to generate dynamic dates based on offset from today
const getDynamicDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('pt-BR');
};

interface ReviewMedia {
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
}

interface Review {
  id: number;
  name: string;
  daysAgo: number;
  rating: number;
  comment: string;
  helpful: number;
  media: ReviewMedia[];
}

const reviewsData: Review[] = [
  {
    id: 1,
    name: "Mariana L.",
    daysAgo: 1,
    rating: 5,
    comment: "Um custo x benefício maravilhoso! Já usei para correr e está mais que aprovado!!",
    helpful: 52,
    media: [
      { type: 'video', src: avaliacao01Video, thumbnail: avaliacao01Img },
      { type: 'image', src: avaliacao01Img },
    ],
  },
  {
    id: 2,
    name: "Bruno R.",
    daysAgo: 2,
    rating: 5,
    comment: "Tênis leve, material resistente, respirável, bom acabamento, macio, te impulsiona pra frente, excelente tênis! Recomendo. Chegou no primeiro dia do prazo de entrega.",
    helpful: 47,
    media: [
      { type: 'image', src: avaliacao02Img1 },
      { type: 'image', src: avaliacao02Img2 },
    ],
  },
  {
    id: 3,
    name: "Juliana M.",
    daysAgo: 3,
    rating: 5,
    comment: "Surpreendeu as minhas expectativas, chegou rápido a numeração bate, é leve, confortável, adorei.",
    helpful: 38,
    media: [
      { type: 'video', src: avaliacao03Video, thumbnail: avaliacao03Img },
      { type: 'image', src: avaliacao03Img },
    ],
  },
  {
    id: 4,
    name: "Carlos E.",
    daysAgo: 4,
    rating: 5,
    comment: "Chegou bem rapidão, dentro do prazo. Pedi um numero maior. Calço 40 e pedi 41. Ficou perfeito!! Material de alta qualidade. Podem comprar sem medo!!",
    helpful: 41,
    media: [
      { type: 'image', src: avaliacao04Img1 },
      { type: 'image', src: avaliacao04Img2 },
    ],
  },
  {
    id: 5,
    name: "Rafael S.",
    daysAgo: 5,
    rating: 5,
    comment: "Excepcional, muito bom mesmo, melhor do que pagar 1000 reais em um tênis de marca famosa no Brasil, tênis leve, confortável, respirável, com placa, sem palavras pra descrever o quanto esse tênis vale a pena.",
    helpful: 63,
    media: [
      { type: 'video', src: avaliacao05Video, thumbnail: avaliacao05Img },
      { type: 'image', src: avaliacao05Img },
    ],
  },
  {
    id: 6,
    name: "Sabrina Viana",
    daysAgo: 6,
    rating: 5,
    comment: "Tênis incrível! A placa de carbono realmente faz diferença na corrida. Super leve e confortável, uso para treinos e provas. Chegou rápido e bem embalado!",
    helpful: 34,
    media: [
      { type: 'image', src: reviewSabrina1 },
      { type: 'image', src: reviewSabrina2 },
    ],
  },
  {
    id: 7,
    name: "Camila Souza",
    daysAgo: 8,
    rating: 5,
    comment: "Comprei para meu marido e ele amou! O design é lindo e o conforto é impressionante. Ele usa para correr todos os dias e diz que nunca teve um tênis tão bom.",
    helpful: 28,
    media: [
      { type: 'image', src: reviewCamila1 },
      { type: 'image', src: reviewCamila2 },
    ],
  },
  {
    id: 8,
    name: "Fernando Costa",
    daysAgo: 10,
    rating: 5,
    comment: "Excelente custo-benefício! Placa de carbono por esse preço é muito difícil encontrar. O acabamento é de qualidade e o retorno de energia é muito bom.",
    helpful: 22,
    media: [
      { type: 'image', src: review1 },
      { type: 'image', src: review2 },
    ],
  },
  {
    id: 9,
    name: "Ana Paula",
    daysAgo: 12,
    rating: 5,
    comment: "Perfeito para academia! Muito estiloso e super confortável. Todo mundo pergunta onde comprei.",
    helpful: 19,
    media: [
      { type: 'image', src: review4 },
    ],
  },
  {
    id: 10,
    name: "Ricardo Almeida",
    daysAgo: 14,
    rating: 5,
    comment: "Melhor tênis de corrida que já tive! A placa de carbono dá uma propulsão incrível. Uso para maratonas e meias maratonas. Superou todas as minhas expectativas!",
    helpful: 45,
    media: [],
  },
  {
    id: 11,
    name: "Juliana Martins",
    daysAgo: 16,
    rating: 5,
    comment: "Tênis muito bonito e confortável. Comprei na cor rosa e ficou lindo! A entrega foi super rápida e veio bem embalado. Recomendo muito!",
    helpful: 31,
    media: [],
  },
  {
    id: 12,
    name: "Marcos Silva",
    daysAgo: 18,
    rating: 4,
    comment: "Ótimo tênis! O único ponto é que poderia ter mais opções de cores. Mas no geral, o conforto e a qualidade são excelentes. Vale muito a pena pelo preço.",
    helpful: 18,
    media: [],
  },
  {
    id: 13,
    name: "Patricia Oliveira",
    daysAgo: 20,
    rating: 5,
    comment: "Comprei para minha filha que é atleta e ela adorou! O tênis é muito leve e o retorno de energia é impressionante. Ela já quer comprar outro de reserva!",
    helpful: 27,
    media: [],
  },
];

const ratingDistribution = [
  { stars: 5, count: 156 },
  { stars: 4, count: 32 },
  { stars: 3, count: 8 },
  { stars: 2, count: 2 },
  { stars: 1, count: 2 },
];

interface UserReview {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const Reviews = () => {
  const averageRating = 4.9;
  const totalReviews = 327;
  const [showAll, setShowAll] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<ReviewMedia | null>(null);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  
  // Fetch approved user reviews
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
  
  // Generate reviews with dynamic dates
  const reviews = useMemo(() => 
    reviewsData.map(review => ({
      ...review,
      date: getDynamicDate(review.daysAgo),
    })), 
  []);
  
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

            {/* Review Media (Images and Videos) */}
            {review.media && review.media.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {review.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMedia(media)}
                    className="relative h-20 w-20 rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={media.type === 'video' ? media.thumbnail : media.src}
                      alt={`Mídia do cliente ${review.name}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {media.type === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    )}
                  </button>
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

      {/* User Submitted Reviews */}
      {userReviews.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Avaliações de clientes</h3>
          {userReviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
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
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
              <p className="text-xs text-gray-500">— {review.customer_name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      <div className="pt-6">
        <ReviewForm onReviewSubmitted={() => {
          // Refetch reviews after submission
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
          {selectedMedia?.type === 'video' ? (
            <video
              src={selectedMedia.src}
              controls
              autoPlay
              className="w-full max-h-[80vh] object-contain"
            />
          ) : (
            <img
              src={selectedMedia?.src}
              alt="Avaliação do cliente"
              className="w-full max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Reviews;
