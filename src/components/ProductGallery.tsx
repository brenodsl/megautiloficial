import { useState, useEffect, useCallback, useRef } from "react";
import { Play } from "lucide-react";
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
  { id: 2, type: "image", src: tenis2, alt: "Max Runner - Vista Lateral" },
  { id: 3, type: "image", src: tenis3, alt: "Max Runner - Vista Traseira" },
  { id: 4, type: "image", src: tenis4, alt: "Max Runner - Detalhe" },
  { id: 5, type: "image", src: tenis5, alt: "Max Runner - Sola" },
  { id: 6, type: "image", src: tenis6, alt: "Max Runner - Vista Angular" },
  { id: 7, type: "image", src: tenis7, alt: "Max Runner - Vista Traseira" },
];

const ProductGallery = ({ selectedColor }: ProductGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevColorRef = useRef(selectedColor);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });

  const selectedColorData = colors.find(c => c.id === selectedColor);
  const mediaItems: MediaItem[] = selectedColorData 
    ? [
        baseImages[0],
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

  useEffect(() => {
    if (emblaApi && selectedColor !== prevColorRef.current) {
      prevColorRef.current = selectedColor;
      emblaApi.scrollTo(1);
    }
  }, [selectedColor, emblaApi]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <div id="produto" className="space-y-3">
      {/* Main Image/Video Display with Discount Badge */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
        {/* Discount Badge */}
        <div className="absolute top-4 left-4 z-10 bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
          -64%
        </div>

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
                    preload="metadata"
                    className="h-full w-full object-contain bg-gradient-to-b from-gray-50 to-white"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-contain bg-gradient-to-b from-gray-50 to-white"
                    loading={item.id === -1 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={item.id === -1 ? "high" : "auto"}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnails Row - Bottom */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 px-1">
        {mediaItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => scrollTo(index)}
            className={`
              relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200
              ${currentIndex === index 
                ? "border-primary ring-2 ring-primary/20" 
                : "border-transparent hover:border-primary/30"
              }
            `}
          >
            {item.type === "video" ? (
              <>
                <img
                  src={item.thumbnail || tenisMain}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white fill-white" />
                </div>
              </>
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
