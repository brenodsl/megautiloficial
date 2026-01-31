import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Play } from "lucide-react";
import videoCameraGallery from "@/assets/video-camera-gallery.mp4";
import camera2 from "@/assets/camera-2.jpg";
import camera3 from "@/assets/camera-3.jpg";
import camera4 from "@/assets/camera-4.jpg";
import camera5 from "@/assets/camera-5.jpg";
import camera6 from "@/assets/camera-6.jpg";
import camera7 from "@/assets/camera-7.jpg";
import camera8 from "@/assets/camera-8.jpg";
import camera9 from "@/assets/camera-9.jpg";

interface MediaItem {
  id: number;
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
}

const mediaItems: MediaItem[] = [
  { id: 1, type: "video", src: videoCameraGallery, alt: "Vídeo demonstração da Câmera Wi-Fi", poster: camera2 },
  { id: 2, type: "image", src: camera2, alt: "Kit 3 Câmeras Wi-Fi - Detalhe" },
  { id: 3, type: "image", src: camera3, alt: "Kit 3 Câmeras Wi-Fi - Instalação" },
  { id: 4, type: "image", src: camera4, alt: "Kit 3 Câmeras Wi-Fi - App" },
  { id: 5, type: "image", src: camera5, alt: "Kit 3 Câmeras Wi-Fi - Visão Noturna" },
  { id: 6, type: "image", src: camera6, alt: "Kit 3 Câmeras Wi-Fi - Especificações" },
  { id: 7, type: "image", src: camera7, alt: "Kit 3 Câmeras Wi-Fi - Recursos" },
  { id: 8, type: "image", src: camera8, alt: "Kit 3 Câmeras Wi-Fi - Conexão" },
  { id: 9, type: "image", src: camera9, alt: "Kit 3 Câmeras Wi-Fi - Vista Completa" },
];

const ProductGallery = () => {
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

  return (
    <div id="produto" className="space-y-3">
      {/* Main Image Display */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
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
                    className="h-full w-full object-contain bg-gradient-to-b from-gray-50 to-white"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-contain bg-gradient-to-b from-gray-50 to-white"
                    loading={item.id === 1 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={item.id === 1 ? "high" : "auto"}
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
                  src={item.poster || camera2}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
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
