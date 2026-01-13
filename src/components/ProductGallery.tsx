import { useState, useEffect, useCallback } from "react";
import { Star, Play, Image as ImageIcon } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
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

interface MediaItem {
  id: number;
  type: "video" | "image";
  src: string;
  alt: string;
  thumbnail?: string;
}

const baseImages: MediaItem[] = [
  { id: 0, type: "video", src: tenisVideo, alt: "Max Runner - Vídeo", thumbnail: tenisMain },
  { id: 1, type: "image", src: tenisMain, alt: "Max Runner - Principal" },
  { id: 2, type: "image", src: tenis2, alt: "Max Runner - Vista Lateral" },
  { id: 3, type: "image", src: tenis3, alt: "Max Runner - Vista Traseira" },
  { id: 4, type: "image", src: tenis4, alt: "Max Runner - Detalhe" },
  { id: 5, type: "image", src: tenis5, alt: "Max Runner - Sola" },
  { id: 6, type: "image", src: tenis6, alt: "Max Runner - Vista Angular" },
  { id: 7, type: "image", src: tenis7, alt: "Max Runner - Vista Traseira" },
];

const ProductGallery = ({ selectedColor }: ProductGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });

  // Get selected color image and add to media array
  const selectedColorData = colors.find(c => c.id === selectedColor);
  const mediaItems: MediaItem[] = selectedColorData 
    ? [
        baseImages[0], // Video first
        { id: -1, type: "image", src: selectedColorData.image, alt: `Max Runner - ${selectedColorData.name}` },
        ...baseImages.slice(1)
      ]
    : baseImages;

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

  // Reset to first slide when color changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [selectedColor, emblaApi]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

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

      {/* Gallery with Thumbnails on Left */}
      <div className="flex gap-3">
        {/* Thumbnails Column - Left Side */}
        <div className="hidden md:flex flex-col gap-2 w-20 flex-shrink-0">
          {mediaItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollTo(index)}
              className={`
                relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200
                ${currentIndex === index 
                  ? "border-gray-900 shadow-md" 
                  : "border-gray-200 hover:border-gray-400"
                }
              `}
            >
              {item.type === "video" ? (
                <>
                  <img
                    src={item.thumbnail || tenisMain}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                </>
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>

        {/* Main Image/Video Display */}
        <div className="relative flex-1 aspect-square overflow-hidden rounded-xl bg-white border border-gray-100">
          <div ref={emblaRef} className="overflow-hidden h-full">
            <div className="flex h-full">
              {mediaItems.map((item) => (
                <div key={item.id} className="flex-[0_0_100%] min-w-0 h-full">
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          

          {/* Mobile Slide Indicators */}
          <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? "bg-gray-900 w-4"
                    : "bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Media Type Toggle - Mobile */}
          <button
            onClick={() => scrollTo(currentIndex === 0 ? 1 : 0)}
            className="md:hidden absolute bottom-3 right-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-gray-900 border border-gray-200 shadow-sm z-10"
          >
            {currentIndex === 0 ? (
              <>
                <ImageIcon className="h-4 w-4" />
                Fotos
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Vídeo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
