import { useState } from "react";
import { Star, Play, Image as ImageIcon } from "lucide-react";
import tenisMain from "@/assets/tenis-main.webp";
import tenis2 from "@/assets/tenis-2.webp";
import tenis3 from "@/assets/tenis-3.webp";
import tenis4 from "@/assets/tenis-4.webp";
import tenis5 from "@/assets/tenis-5.webp";
import tenis7 from "@/assets/tenis-7.webp";
import tenisVideo from "@/assets/tenis-video.mp4";
import colorGradient from "@/assets/color-gradient.webp";
import colorPurple from "@/assets/color-purple.webp";
import colorOrange from "@/assets/color-orange.webp";
import colorMint from "@/assets/color-mint.webp";
import colorPink from "@/assets/color-pink.webp";

interface ProductGalleryProps {
  selectedColor: string;
}

const colorImages: Record<string, string> = {
  gradient: colorGradient,
  purple: colorPurple,
  orange: colorOrange,
  mint: colorMint,
  pink: colorPink,
  main: tenisMain,
};

const thumbnails = [
  { id: 1, src: tenis2, alt: "Max Runner - Vista Lateral" },
  { id: 2, src: tenis3, alt: "Max Runner - Vista Traseira" },
  { id: 3, src: tenis4, alt: "Max Runner - Detalhe" },
  { id: 4, src: tenis5, alt: "Max Runner - Sola" },
  { id: 5, src: tenis7, alt: "Max Runner - Vista Superior" },
];

const ProductGallery = ({ selectedColor }: ProductGalleryProps) => {
  const [selectedThumb, setSelectedThumb] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const mainImage = selectedThumb !== null 
    ? thumbnails[selectedThumb].src 
    : colorImages[selectedColor] || colorGradient;

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

      {/* Main Image/Video */}
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
          <img
            src={mainImage}
            alt="Max Runner - Tênis Premium"
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Badge */}
        <div className="absolute top-3 left-3 bg-destructive text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
          <span className="animate-pulse">⚡</span>
          ÚLTIMAS UNIDADES
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => {
            setShowVideo(!showVideo);
            if (!showVideo) setSelectedThumb(null);
          }}
          className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-white transition-colors shadow-sm"
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

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {thumbnails.map((thumb, index) => (
          <button
            key={thumb.id}
            onClick={() => {
              setSelectedThumb(index);
              setShowVideo(false);
            }}
            className={`relative flex-shrink-0 aspect-square w-14 rounded-lg overflow-hidden border-2 transition-all ${
              selectedThumb === index && !showVideo
                ? "border-foreground"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <img
              src={thumb.src}
              alt={thumb.alt}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
        
        {/* Video Thumbnail */}
        <button
          onClick={() => setShowVideo(true)}
          className={`relative flex-shrink-0 aspect-square w-14 rounded-lg overflow-hidden border-2 transition-all ${
            showVideo
              ? "border-foreground"
              : "border-border hover:border-muted-foreground"
          }`}
        >
          <video src={tenisVideo} className="h-full w-full object-cover" muted />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="h-5 w-5 text-white fill-white" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
