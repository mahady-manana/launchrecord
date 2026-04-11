"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Step1ProductForm } from "./components/Step1ProductForm";
import { Step2Pricing } from "./components/Step2Pricing";
import { ValuePanel } from "./components/ValuePanel";

function CompleteProductForm() {
  const params = useSearchParams();
  const productUrl = params.get("productUrl");
  const [step, setStep] = useState<1 | 2>(1);
  const [productId, setProductId] = useState<string | null>(null);

  const handleProductComplete = (id: string) => {
    setProductId(id);
    setStep(2);
  };

  const handleBack = () => setStep(1);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {step === 1 && (
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left: Value Proposition */}
          <ValuePanel step={step} />

          {/* Right: Step 1 form */}
          <div className="flex items-center justify-center px-6 py-12 sm:px-12 bg-slate-50">
            <Step1ProductForm
              productUrl={productUrl}
              onComplete={handleProductComplete}
            />
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="flex items-center justify-center px-6 py-12 sm:px-12 bg-slate-50 min-h-screen">
          <Step2Pricing productId={productId} onBack={handleBack} />
        </div>
      )}
    </div>
  );
}

export default function CompleteProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteProductForm />
    </Suspense>
  );
}
