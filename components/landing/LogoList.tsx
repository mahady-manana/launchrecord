import { appLogo } from "@/lib/logo";
import clsx from "clsx";
import { ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const fallbackUrls = [
  "https://digitalbrainstech.com/",
  "https://pdf-redaction.com/",
  "https://startupmaya.com/",
  "https://www.webtoolkit.tech/",
  "https://gogeoplayer.com/",
  "https://www.phpcrudgenerator.com/",
  "https://www.rentiz.app/",
  "https://coregptapps.com/",
  "https://lingrix.com/",
  "https://sensepm.com/",
  "https://natrajx.in/",
  "https://www.launchrecord.com/",
  "https://retold.me/",
  "https://senti.solutions/",
  "https://www.statnexa.com/",
  "https://presenter3d.com/",
];

export function LogoList() {
  const [logos, setLogos] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);

  const fetchLogos = useCallback(async () => {
    try {
      const response = await fetch("/api/get-promo");
      const res = await response.json();
      if (res?.data?.logos) {
        const seen = new Set<string>();
        const unique = res.data.logos.filter(
          (logo: { url: string }) => !seen.has(logo.url) && seen.add(logo.url),
        );
        setLogos(unique);
      }
      if (res?.data?.count) {
        setCount(res.data.count);
      }
    } catch (error) {
      // Fallback to static URLs if API fails
      setLogos(fallbackUrls);
    }
  }, []);

  useEffect(() => {
    fetchLogos();
  }, [fetchLogos]);

  return (
    <section className="py-12 space-y-6 w-full">
      {/* Trust Header */}
      <div className="flex items-center justify-center gap-2">
        <ShieldCheck className="h-5 w-5 text-slate-400" />
        <p className="text-lg font-semibold text-slate-700">
          Trusted by <span className="text-purple-600">{220}+</span> startup
          founders
        </p>
      </div>

      {/* Logo Grid */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6">
          {fallbackUrls.map((url, idx) => (
            <LogoItem key={`${url}-${idx}`} url={url} />
          ))}
        </div>
      </div>
    </section>
  );
}

const LogoItem = ({ url }: { url: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <img
        src={appLogo({ website: url })}
        alt={`${url} logo`}
        height={32}
        className={clsx(
          "h-8 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200",
        )}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
};
