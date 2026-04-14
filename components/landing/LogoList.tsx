import { appLogo } from "@/lib/logo";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

export function LogoList() {
  const [logos, setLogos] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);

  const fetchs = useCallback(async () => {
    const data = await fetch("/api/get-logos");
    const res = await data.json();
    if (res?.data?.logos) {
      const seen = new Set<string>();
      const unique = res.data.logos.filter(
        (l: any) => !seen.has(l.url) && seen.add(l.url),
      );
      setLogos(unique);
    }
    if (res?.data?.count) {
      setCount(res.data.count);
    }
  }, []);

  useEffect(() => {
    fetchs();
  }, [fetchs]);
  return (
    <div className="pt-0 flex flex-col justify-center w-full">
      <div className="md:max-w-7xl max-w-[320px] mx-auto flex gap-0 p-4 overflow-x-auto md:overflow-x-hidden">
        {logos.map((logo, idx) => (
          <ImageComp key={idx} url={logo.url} logoUrl={logo.product?.logo} />
        ))}
        <div className="hidden md:block z-999">
          <div className="bg-slate-50 px-2 text-slate-700 flex items-center justify-center h-8 rounded-full border overflow-hidden">
            <p className="text-xs font-bold">+{count} Audits last week</p>
          </div>
        </div>
      </div>
      <div className="block md:hidden pt-4">
        <div className="bg-slate-800 px-2 text-white flex items-center justify-center h-8 rounded-full border overflow-hidden">
          <p className="text-xs font-bold">+{count} Audits last week</p>
        </div>
      </div>
    </div>
  );
}

const ImageComp = ({ url, logoUrl }: { url: string; logoUrl?: string }) => {
  const [logo, setLogo] = useState(url);

  if (!logo && !logoUrl) {
    return null;
  }
  return (
    <div className="w-10 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border overflow-hidden">
        <img
          src={
            logoUrl ||
            appLogo({
              website: logo,
            })
          }
          height={30}
          width={30}
          className={clsx("object-cover h-8 w-8")}
          onError={() => setLogo("")}
        />
      </div>
    </div>
  );
};
