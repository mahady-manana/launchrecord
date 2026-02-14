'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Placement {
  _id: string;
  title: string;
  tagline: string;
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

export default function PlacementsPage() {
  const router = useRouter();
  const { user, authStatus } = useUser();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'loading') return;
    
    if (authStatus !== 'authenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    fetchPlacements();
  }, [authStatus, router]);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/placements/user');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch placements');
      }
      
      setPlacements(data.placements);
    } catch (err: any) {
      setError(err.message || 'Failed to load placements');
      console.error('Error fetching placements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlacement = (id: string) => {
    router.push(`/dashboard/placement/${id}`);
  };

  if (authStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading placements...</p>
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Placements</h1>
        <p className="text-muted-foreground">
          Manage your purchased placements and customize their appearance
        </p>
      </div>

      {placements.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No placements yet</CardTitle>
            <CardDescription>
              You haven't purchased any placements yet. Start promoting your product today!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}>
              Browse Placement Options
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {placements.map((placement) => (
            <Card key={placement._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{placement.title}</CardTitle>
                  <Badge 
                    variant={
                      placement.status === 'active' ? 'default' :
                      placement.status === 'inactive' ? 'secondary' :
                      'destructive'
                    }
                  >
                    {placement.status}
                  </Badge>
                </div>
                <CardDescription>{placement.tagline}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Type:</span>
                    <span className="font-medium">{placement.placementType} {placement.position}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Code:</span>
                    <span className="font-mono">{placement.codeName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Period:</span>
                    <span className="font-medium">
                      {new Date(placement.startDate).toLocaleDateString()} - {new Date(placement.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price:</span>
                    <span className="font-medium">${placement.price}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleEditPlacement(placement._id)}
                >
                  {placement.status === 'inactive' ? 'Set Up' : 'Edit'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}