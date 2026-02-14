'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { PlacementForm } from '@/components/launchrecord/placement-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PlacementCard } from '@/components/launchrecord/placement-card';
import { FeaturedPlacementCard } from '@/components/launchrecord/featured-placement-card';

interface Placement {
  _id: string;
  title: string;
  tagline: string;
  logoUrl?: string;
  backgroundImage?: string;
  website: string;
  placementType: string;
  position?: string;
  startDate: string;
  endDate: string;
  price: number;
  status: string;
  codeName: string;
  createdAt: string;
}

interface PlacementSetupClientProps {
  initialPlacement: Placement;
  placementId: string;
}

export default function PlacementSetupClient({ initialPlacement, placementId }: PlacementSetupClientProps) {
  const router = useRouter();
  const { user, authStatus } = useUser();
  const [placement, setPlacement] = useState<Placement>(initialPlacement);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'loading') return;

    if (authStatus !== 'authenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
  }, [authStatus, router]);

  const handleUpdatePlacement = async (formData: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/placements/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: placement._id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update placement');
      }

      // Redirect to placements dashboard after successful update
      router.push('/dashboard/placements');
    } catch (err: any) {
      setError(err.message || 'Failed to update placement');
      console.error('Error updating placement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/placements');
  };

  // Update placement state when form data changes for preview
  const handlePlacementChange = (updatedData: Partial<Placement>) => {
    setPlacement(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading placement details...</p>
        </div>
      </div>
    );
  }

  if (authStatus !== 'authenticated') {
    return null; // Redirect handled by useEffect
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!placement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Placement Not Found</CardTitle>
            <CardDescription>The placement you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/placements')}>Back to Placements</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Set Up Your Placement</h1>
        <p className="text-muted-foreground">
          Customize your placement details for {placement.codeName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Placement Details</CardTitle>
              <CardDescription>Fill in the details for your placement</CardDescription>
            </CardHeader>
            <CardContent>
              <PlacementForm
                placement={placement}
                onSubmit={handleUpdatePlacement}
                onCancel={handleCancel}
                onChange={handlePlacementChange} // Pass the change handler to the form
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your placement will appear on the site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Featured Placement Preview */}
                {placement.placementType === 'featured' && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Featured Placement</h4>
                    <div className="bg-muted rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                      <div className="w-full max-w-md">
                        <FeaturedPlacementCard placements={[placement]} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sidebar Placement Preview */}
                {(placement.placementType === 'sidebar' || !placement.placementType) && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sidebar Placement</h4>
                    <div className="bg-muted rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                      <div className="w-full max-w-xs">
                        <PlacementCard placement={placement} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                This is how your {placement.placementType || 'placement'} will appear on the site
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}