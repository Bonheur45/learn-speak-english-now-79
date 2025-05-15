import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";

interface ImageCarouselProps {
  images: string[];
  interval?: number;
  altText?: string;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  interval = 3000, 
  altText = "Image carousel",
  className = "" 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  // For simple fade transition, use this approach
  if (images.length <= 2) {
    return (
      <div className={cn("relative overflow-hidden", className)} 
           style={{ minHeight: "200px" }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${altText} ${index + 1}`}
            className={cn(
              "w-full h-full transition-all duration-1000 absolute inset-0 object-cover",
              // Keep rounded corners on medium and larger screens, full width on mobile
              "px-0 md:px-4 md:rounded-lg",
              index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          />
        ))}
      </div>
    );
  }

  // For more than 2 images, use the Carousel component from shadcn/ui
  return (
    <Carousel className={cn("w-full overflow-hidden", className)}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-0 sm:p-1">
              <img 
                src={image} 
                alt={`${altText} ${index + 1}`} 
                className="w-full h-auto object-cover md:rounded-lg"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex left-2 lg:-left-12" />
      <CarouselNext className="hidden md:flex right-2 lg:-right-12" />
    </Carousel>
  );
};

export default ImageCarousel;
