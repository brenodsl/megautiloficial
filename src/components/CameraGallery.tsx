import { useState, useCallback, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import cameraMain from "@/assets/camera-main.webp";
import cameraFeatures from "@/assets/camera-features.jpg";
import cameraControl from "@/assets/camera-control.jpg";
import cameraPanoramic from "@/assets/camera-panoramic.webp";

interface MediaItem {
  id: number;
  type: "image";
  src: string;
  alt: string;
}

const mediaItems: MediaItem[] = [
  { id: 1, type: "image", src: cameraMain, alt: "Câmera P11 - Vista Principal" },
  { id: 2, type: "image", src: cameraFeatures, alt: "Câmera P11 - Características" },
  { id: 3, type: "image", src: cameraControl, alt: "Câmera P11 - Controle por Celular" },
  { id: 4, type: "image", src: cameraPanoramic, alt: "Câmera P11 - Panorâmica" },
];

const CameraGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="space-y-3">
      {/* Rating and Bestseller Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
          MAIS VENDIDO
        </span>
        <span className="text-xs text-blue-600">
          1º em Câmeras de Segurança IP
        </span>
      </div>

      <a
        href="#avaliacoes"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span className="font-semibold text-blue-600">4.8</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 fill-blue-500 text-blue-500" />
          ))}
        </div>
        <span className="text-blue-600 underline">(80 avaliações)</span>
      </a>

      {/* Gallery Layout */}
      <div className="flex flex-row gap-2 sm:gap-3">
        {/* Thumbnails Column - Left Side */}
        <div className="flex flex-col gap-1.5 sm:gap-2 w-14 sm:w-20 flex-shrink-0 max-h-[300px] sm:max-h-[500px] overflow-y-auto scrollbar-hide">
          {mediaItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollTo(index)}
              className={`
                relative aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0
                ${currentIndex === index 
                  ? "border-blue-500 shadow-md" 
                  : "border-gray-200 hover:border-gray-400"
                }
              `}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>

        {/* Main Image Display */}
        <div className="relative flex-1 aspect-square overflow-hidden rounded-xl bg-white border border-gray-100">
          {/* Favorite Button */}
          <button className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Navigation Arrows */}
          <button 
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <div ref={emblaRef} className="overflow-hidden h-full">
            <div className="flex h-full">
              {mediaItems.map((item) => (
                <div key={item.id} className="flex-[0_0_100%] min-w-0 h-full">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-contain bg-white"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Counter */}
      <div className="text-center text-sm text-gray-500">
        {currentIndex + 1} / {mediaItems.length}
      </div>
    </div>
  );
};

export default CameraGallery;
