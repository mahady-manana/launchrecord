import { Placement } from "@/types/placement";
import { useEffect, useState } from "react";

interface FeaturedPlacementCardProps {
  placements: Placement[];
}

export function FeaturedPlacementCard({
  placements = []
}: FeaturedPlacementCardProps) {
  // Use only placements for the slider
  const allItems = [...placements];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (allItems.length <= 1) return; // Don't auto-rotate if there's only one item

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allItems.length]);

  // If no items, show a message
  if (allItems.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden h-[300px] flex items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-muted-foreground">No featured placements available</p>
          <p className="text-sm text-muted-foreground mt-1">Advertise your product to appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* All slides container */}
      <div className="relative h-full min-h-[300px] overflow-hidden">
        {allItems.map((item, index) => {
          const isCurrent = index === currentIndex;

          return (
            <a
              key={item._id}
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`block absolute inset-0 transition-opacity duration-500 ${isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="relative h-full min-h-[300px]">
                <img
                  src={item.backgroundImage || item.logoUrl || '/placeholder-hero-bg.jpg'}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="relative z-10 p-6 text-white flex flex-col justify-end h-full">
                  <div className="h-12 w-12 rounded-lg overflow-hidden border-2 border-white mb-3">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={`${item.title} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-white/20 text-white font-bold">
                        {item.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-white/90 mt-1">{item.tagline}</p>
                  <p className="text-sm text-white/70 mt-2 truncate">{item.website}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      
      {/* Slider indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {allItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
