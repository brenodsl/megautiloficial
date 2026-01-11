import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import reviewSabrina1 from "@/assets/review-sabrina-1.webp";
import reviewSabrina2 from "@/assets/review-sabrina-2.webp";
import reviewCamila1 from "@/assets/review-camila-1.webp";
import reviewCamila2 from "@/assets/review-camila-2.webp";
import review1 from "@/assets/review-1.webp";

const reviews = [
  {
    id: 1,
    name: "Sabrina V.",
    rating: 5,
    comment: "Tênis incrível! A placa de carbono realmente faz diferença na corrida. Super leve e confortável.",
    image: reviewSabrina1,
  },
  {
    id: 2,
    name: "Fernando M.",
    rating: 5,
    comment: "Excelente qualidade! O amortecimento é perfeito para corridas longas. Recomendo muito!",
    image: reviewCamila1,
  },
  {
    id: 3,
    name: "Carla S.",
    rating: 5,
    comment: "Melhor tênis de corrida que já tive. Muito leve e o design é lindo. Chegou rápido!",
    image: reviewSabrina2,
  },
  {
    id: 4,
    name: "Ricardo P.",
    rating: 5,
    comment: "Superou minhas expectativas! Qualidade premium por um preço justo. Vale cada centavo.",
    image: reviewCamila2,
  },
  {
    id: 5,
    name: "Ana L.",
    rating: 5,
    comment: "Perfeito para treinos intensos. A placa de carbono dá um impulso extra. Amei!",
    image: review1,
  },
];

const CheckoutReviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="flex-shrink-0 w-40 bg-gray-50 rounded-xl overflow-hidden"
          >
            {/* Image */}
            <div className="aspect-square">
              <img
                src={review.image}
                alt={`Foto de ${review.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            
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
    </div>
  );
};

export default CheckoutReviews;
