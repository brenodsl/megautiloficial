import { Star } from "lucide-react";
import reviewSabrina1 from "@/assets/review-sabrina-1.webp";
import reviewCamila1 from "@/assets/review-camila-1.webp";

const reviews = [
  {
    id: 1,
    name: "Sabrina V.",
    rating: 5,
    comment: "Tênis incrível! A placa de carbono realmente faz diferença na corrida. Supe...",
    image: reviewSabrina1,
  },
  {
    id: 2,
    name: "Fernan...",
    rating: 5,
    comment: "Exce carbo...",
    image: reviewCamila1,
  },
];

const CheckoutReviews = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-xl font-bold text-gray-900">4.9</span>
          <span className="text-sm text-gray-500">(327 avaliações)</span>
        </div>
        <span className="text-xs text-gray-400 uppercase tracking-wider">AVALIAÇÕES REAIS</span>
      </div>

      {/* Review Cards - Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden"
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
