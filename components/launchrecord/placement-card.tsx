import Link from "next/link";
import { Launch } from "@/types";
import { Placement } from "@/types/placement";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface PlacementCardProps {
  launch?: Launch;
  placement?: Placement;
}

export function PlacementCard({ launch, placement }: PlacementCardProps) {
  // If we have a placement, use that; otherwise use the launch
  if (placement) {
    return (
      <a 
        href={placement.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="relative h-full overflow-hidden rounded-xl border-0 bg-transparent shadow-none">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 70%, transparent 100%), url(${placement.backgroundImage || placement.logoUrl || '/placeholder-launch-bg.jpg'})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          
          {/* Content overlay */}
          <div className="relative z-10 flex h-full flex-col justify-end p-4 text-white">
            <div className="mb-4">
              {/* Logo */}
              <div className="mb-2 flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 border-white bg-white/20 backdrop-blur-sm">
                  {placement.logoUrl ? (
                    <img
                      src={placement.logoUrl}
                      alt={`${placement.title} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                      {placement.title.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{placement.title}</h3>
                  <p className="line-clamp-2 text-sm text-white/90">{placement.tagline}</p>
                </div>
              </div>
              
              {/* Badge */}
              <div className="mt-2">
                <Badge 
                  variant="default" 
                  className="text-xs text-white"
                  style={{ backgroundColor: placement.color || '#2563eb' }} // Default to primary blue
                >
                  Sponsored
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </a>
    );
  }

  // Fallback to launch if no placement
  if (!launch) {
    return (
      <Card className="border-dashed rounded-xl h-24 flex items-center justify-center bg-muted">
        <div className="text-center">
          <h3 className="text-sm text-muted-foreground">Available Slot</h3>
        </div>
      </Card>
    );
  }

  const shortText = launch.tagline || launch.description;

  return (
    <Link href={launch.website} target="_blank" rel="noreferrer" className="block">
      <Card className="relative h-full overflow-hidden rounded-xl border-0 bg-transparent shadow-none">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 70%, transparent 100%), url(${launch.logoUrl || '/placeholder-launch-bg.jpg'})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex h-full flex-col justify-end p-4 text-white">
          <div className="mb-4">
            {/* Logo */}
            <div className="mb-2 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 border-white bg-white/20 backdrop-blur-sm">
                {launch.logoUrl ? (
                  <img
                    src={launch.logoUrl}
                    alt={`${launch.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                    {launch.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">{launch.name}</h3>
                <p className="line-clamp-2 text-sm text-white/90">{shortText}</p>
              </div>
            </div>
            
            {/* Categories and author badge */}
            <div className="mt-2 flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {Array.isArray(launch.category) ? (
                  launch.category.slice(0, 2).map((cat, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/20 text-xs text-white hover:bg-white/30">
                      {cat}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="bg-white/20 text-xs text-white hover:bg-white/30">
                    {launch.category}
                  </Badge>
                )}
              </div>
              <Badge variant="default" className="bg-primary/90 text-xs text-white">
                {launch.name || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
