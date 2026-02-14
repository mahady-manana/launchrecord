'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, authStatus } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const placementCode = searchParams.get('placement');
  const duration = searchParams.get('duration') || '30';
  const userId = searchParams.get('userId');

  useEffect(() => {
    if (authStatus === 'loading') return;
    
    if (authStatus !== 'authenticated') {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }
    
    if (!placementCode) {
      setError('No placement selected');
      setLoading(false);
      return;
    }
    
    // In a real implementation, you would create a Stripe checkout session here
    // For now, we'll simulate the process
    simulateCheckout();
  }, [authStatus, placementCode, router]);

  // Calculate price based on duration (15 days = 70% of 30 days price)
  const calculatePriceBasedOnDuration = (days: number): number => {
    // Base price for 30 days is $299 (or $599 for featured)
    // For simplicity, assuming sidebar placement is $299 and featured is $599
    const basePrice = placementCode.startsWith('HERO') ? 599 : 299;
    
    if (days === 15) {
      return basePrice * 0.7; // 70% of base price for 15 days
    } else if (days === 30) {
      return basePrice; // Full price for 30 days
    } else {
      return basePrice; // Default to full price
    }
  };

  const simulateCheckout = async () => {
    try {
      // Call the API to create a Stripe checkout session
      const response = await fetch('/api/placements/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placementCode: placementCode,
          duration: parseInt(duration),
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        setError(data.message || 'Failed to initiate checkout');
      }
    } catch (err) {
      setError('Failed to initiate checkout');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            You're purchasing placement: <strong>{placementCode}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Placement:</span>
              <span>{placementCode}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{duration} days</span>
            </div>
            <div className="flex justify-between">
              <span>Placement Fee:</span>
              <span>${calculatePriceBasedOnDuration(parseInt(duration)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${calculatePriceBasedOnDuration(parseInt(duration)).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            You will be redirected to secure payment processing
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}