import { useState } from "react";
import tenisMain from "@/assets/tenis-main.webp";
import tenis2 from "@/assets/tenis-2.webp";
import tenis3 from "@/assets/tenis-3.webp";
import tenis4 from "@/assets/tenis-4.webp";
import tenis5 from "@/assets/tenis-5.webp";
import tenis7 from "@/assets/tenis-7.webp";
import tenisVideo from "@/assets/tenis-video.mp4";

const images = [
  { id: 1, src: tenisMain, alt: "Max Runner - Vista Principal" },
  { id: 2, src: tenis2, alt: "Max Runner - Vista Lateral" },
  { id: 3, src: tenis3, alt: "Max Runner - Vista Traseira" },
  { id: 4, src: tenis4, alt: "Max Runner - Detalhe" },
  { id: 5, src: tenis5, alt: "Max Runner - Sola" },
  { id: 6, src: tenis7, alt: "Max Runner - Vista Superior" },
];

const ProductGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div id="produto" className="space-y-4">
      {/* Main Image/Video */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-card border border-border shadow-sm">
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
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}
        
        {/* Video Toggle Badge */}
        <button
          onClick={() => setShowVideo(!showVideo)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-foreground border border-border hover:bg-card transition-colors shadow-sm"
        >
          {showVideo ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ver Fotos
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver Vídeo
            </>
          )}
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => {
              setSelectedImage(index);
              setShowVideo(false);
            }}
            className={`relative flex-shrink-0 aspect-square w-16 sm:w-20 rounded-lg overflow-hidden border-2 transition-all shadow-sm ${
              selectedImage === index && !showVideo
                ? "border-primary shadow-md"
                : "border-border hover:border-primary/50"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
        
        {/* Video Thumbnail */}
        <button
          onClick={() => setShowVideo(true)}
          className={`relative flex-shrink-0 aspect-square w-16 sm:w-20 rounded-lg overflow-hidden border-2 transition-all shadow-sm ${
            showVideo
              ? "border-primary shadow-md"
              : "border-border hover:border-primary/50"
          }`}
        >
          <video src={tenisVideo} className="h-full w-full object-cover" muted />
          <div className="absolute inset-0 flex items-center justify-center bg-card/40">
            <svg className="h-6 w-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
