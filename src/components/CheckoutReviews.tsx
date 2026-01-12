import { Star, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import reviewSabrina1 from "@/assets/review-sabrina-1.webp";
import reviewSabrina2 from "@/assets/review-sabrina-2.webp";
import reviewCamila1 from "@/assets/review-camila-1.webp";
import reviewCamila2 from "@/assets/review-camila-2.webp";
import review1 from "@/assets/review-1.webp";
import avaliacao01Video from "@/assets/avaliacao01-video.mp4";
import avaliacao01Img from "@/assets/avaliacao01-img.png";
import avaliacao02Img1 from "@/assets/avaliacao02-img1.webp";
import avaliacao03Video from "@/assets/avaliacao03-video.mp4";
import avaliacao03Img from "@/assets/avaliacao03-img.webp";
import avaliacao04Img1 from "@/assets/avaliacao04-img1.webp";
import avaliacao05Video from "@/assets/avaliacao05-video.mp4";
import avaliacao05Img from "@/assets/avaliacao05-img.webp";

interface ReviewMedia {
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  media: ReviewMedia;
}

const reviewsData: Review[] = [
  {
    id: 1,
    name: "Mariana L.",
    rating: 5,
    comment: "Um custo x benefício maravilhoso! Já usei para correr e está mais que aprovado!!",
    media: { type: 'video', src: avaliacao01Video, thumbnail: avaliacao01Img },
  },
  {
    id: 2,
    name: "Bruno R.",
    rating: 5,
    comment: "Tênis leve, material resistente, respirável, bom acabamento. Chegou no primeiro dia do prazo!",
    media: { type: 'image', src: avaliacao02Img1 },
  },
  {
    id: 3,
    name: "Juliana M.",
    rating: 5,
    comment: "Surpreendeu minhas expectativas, chegou rápido, numeração bate, é leve e confortável!",
    media: { type: 'video', src: avaliacao03Video, thumbnail: avaliacao03Img },
  },
  {
    id: 4,
    name: "Carlos E.",
    rating: 5,
    comment: "Chegou rapidão, dentro do prazo. Material de alta qualidade. Podem comprar sem medo!!",
    media: { type: 'image', src: avaliacao04Img1 },
  },
  {
    id: 5,
    name: "Rafael S.",
    rating: 5,
    comment: "Excepcional! Melhor do que pagar R$1000 em marca famosa. Tênis leve, confortável e com placa!",
    media: { type: 'video', src: avaliacao05Video, thumbnail: avaliacao05Img },
  },
  {
    id: 6,
    name: "Sabrina V.",
    rating: 5,
    comment: "Tênis incrível! A placa de carbono realmente faz diferença na corrida. Super leve e confortável.",
    media: { type: 'image', src: reviewSabrina1 },
  },
  {
    id: 7,
    name: "Fernando M.",
    rating: 5,
    comment: "Excelente qualidade! O amortecimento é perfeito para corridas longas. Recomendo muito!",
    media: { type: 'image', src: reviewCamila1 },
  },
  {
    id: 8,
    name: "Carla S.",
    rating: 5,
    comment: "Melhor tênis de corrida que já tive. Muito leve e o design é lindo. Chegou rápido!",
    media: { type: 'image', src: reviewSabrina2 },
  },
  {
    id: 9,
    name: "Ricardo P.",
    rating: 5,
    comment: "Superou minhas expectativas! Qualidade premium por um preço justo. Vale cada centavo.",
    media: { type: 'image', src: reviewCamila2 },
  },
  {
    id: 10,
    name: "Ana L.",
    rating: 5,
    comment: "Perfeito para treinos intensos. A placa de carbono dá um impulso extra. Amei!",
    media: { type: 'image', src: review1 },
  },
];

const CheckoutReviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<ReviewMedia | null>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 180;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-xl font-bold text-gray-900">4.9</span>
          <span className="text-sm text-gray-500">(327 avaliações)</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-1 rounded-full transition-colors ${
              canScrollLeft 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-1 rounded-full transition-colors ${
              canScrollRight 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Review Cards - Horizontal Scroll */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide scroll-smooth"
      >
        {reviewsData.map((review) => (
          <div 
            key={review.id} 
            className="flex-shrink-0 w-40 bg-gray-50 rounded-xl overflow-hidden"
          >
            {/* Image/Video Thumbnail */}
            <button
              onClick={() => setSelectedMedia(review.media)}
              className="relative aspect-square w-full group cursor-pointer"
            >
              <img
                src={review.media.type === 'video' ? review.media.thumbnail : review.media.src}
                alt={`Foto de ${review.name}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {review.media.type === 'video' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              )}
            </button>
            
            {/* Stars */}
            <div className="p-2">
              <div className="flex mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              
              {/* Comment */}
              <p className="text-xs text-gray-600 line-clamp-3 mb-1">
                "{review.comment}"
              </p>
              
              {/* Author */}
              <p className="text-xs text-gray-400">{review.name}</p>
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default CheckoutReviews;
