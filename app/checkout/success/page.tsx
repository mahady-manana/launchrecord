'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [placementCode, setPlacementCode] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const code = searchParams.get('placement');
    const dur = searchParams.get('duration');
    if (code) {
      setPlacementCode(code);
    }
    if (dur) {
      setDuration(dur);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="font-medium">Placement Reserved</p>
          <p className="text-sm text-muted-foreground mt-2">
            Your placement <span className="font-mono font-bold">{placementCode}</span> has been reserved for <span className="font-bold">{duration} days</span>.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Next Steps:</span><br />
              Our team will contact you within 24 hours to finalize the creative details for your placement.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            className="w-full" 
            onClick={() => router.push(`/dashboard/placement/${placementCode}`)}
          >
            Create Your Placement
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => router.push('/dashboard')}
          >
            View Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}