import { useState, useEffect, useCallback } from "react";
import { Star, Play, Image as ImageIcon } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import tenisMain from "@/assets/tenis-main.webp";
import tenis2 from "@/assets/tenis-2.webp";
import tenis3 from "@/assets/tenis-3.webp";
import tenis4 from "@/assets/tenis-4.webp";
import tenis5 from "@/assets/tenis-5.webp";
import tenis6 from "@/assets/tenis-6.webp";
import tenis7 from "@/assets/tenis-7.webp";
import tenisVideo from "@/assets/tenis-video.mp4";
import { colors } from "@/components/ColorSelector";

interface ProductGalleryProps {
  selectedColor: string;
}

const baseImages = [
  { id: 1, src: tenisMain, alt: "Max Runner - Principal" },
  { id: 2, src: tenis2, alt: "Max Runner - Vista Lateral" },
  { id: 3, src: tenis3, alt: "Max Runner - Vista Traseira" },
  { id: 4, src: tenis4, alt: "Max Runner - Detalhe" },
  { id: 5, src: tenis5, alt: "Max Runner - Sola" },
  { id: 6, src: tenis6, alt: "Max Runner - Vista Angular" },
  { id: 7, src: tenis7, alt: "Max Runner - Vista Traseira" },
];

const ProductGallery = ({ selectedColor }: ProductGalleryProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  // Get selected color image and prepend to carousel
  const selectedColorData = colors.find(c => c.id === selectedColor);
  const images = selectedColorData 
    ? [{ id: 0, src: selectedColorData.image, alt: `Max Runner - ${selectedColorData.name}` }, ...baseImages]
    : baseImages;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Reset to first slide when color changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [selectedColor, emblaApi]);

  return (
    <div id="produto" className="space-y-3">
      {/* Rating Link */}
      <a
        href="#avaliacoes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-1 bg-foreground text-white px-2 py-1 rounded font-bold text-xs">
          <span>4.9</span>
          <Star className="h-3 w-3 fill-white" />
        </div>
        <span className="underline">(578 avaliações)</span>
      </a>

      {/* Main Image/Video Carousel */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white border border-border">
        {showVideo ? (
          <video
            src={tenisVideo}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div ref={emblaRef} className="overflow-hidden h-full">
            <div className="flex h-full">
              {images.map((image) => (
                <div key={image.id} className="flex-[0_0_100%] min-w-0 h-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Badge */}
        <div className="absolute top-3 left-3 bg-destructive text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 z-10">
          <span className="animate-pulse">⚡</span>
          ÚLTIMAS UNIDADES
        </div>

        {/* Slide Indicators */}
        {!showVideo && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index
                    ? "bg-foreground w-4"
                    : "bg-foreground/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setShowVideo(!showVideo)}
          className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-white transition-colors shadow-sm z-10"
        >
          {showVideo ? (
            <>
              <ImageIcon className="h-4 w-4" />
              Ver Fotos
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Ver Vídeo
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
