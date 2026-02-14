'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { PlacementForm } from '@/components/launchrecord/placement-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function PlacementSetupPage() {
  const router = useRouter();
  const params = useParams();
  const { user, authStatus } = useUser();
  const [placement, setPlacement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === 'loading') return;
    
    if (authStatus !== 'authenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    fetchPlacement();
  }, [authStatus, router, params.id]);

  const fetchPlacement = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/placements/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch placement');
      }
      
      setPlacement(data.placement);
    } catch (err: any) {
      setError(err.message || 'Failed to load placement');
      console.error('Error fetching placement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlacement = async (formData: any) => {
    try {
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
      
      // Redirect to dashboard after successful update
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error updating placement:', err);
    }
  };

  if (authStatus === 'loading' || loading) {
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
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
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

      <PlacementForm 
        placement={placement} 
        onSubmit={handleUpdatePlacement} 
        onCancel={() => router.push('/dashboard')} 
      />
    </div>
  );
}