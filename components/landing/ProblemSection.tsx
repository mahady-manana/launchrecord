"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

interface Problem {
  stat: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const problems: Problem[] = [
  {
    stat: "85% of startups have positioning debt",
    title: "You sound kike everyone else",
    description:
      "No clear positioning. You’re solving the same problems the same way as everyone else.",
    icon: <AlertTriangle className="h-6 w-6" />,
  },
  {
    stat: "65% of visitors leave from unclear messaging",
    title: "Visitors don’t get it",
    description: "Unclear messaging. Confusion kills conversions instantly",
    icon: <TrendingDown className="h-6 w-6" />,
  },
  {
    stat: "94.2% of startups are invisible to AI",
    title: "AI can’t see you",
    description:
      "No visibility. You don’t exist in the fastest-growing discovery channel.",
    icon: <XCircle className="h-6 w-6" />,
  },
];

const imagesCar = [
  "/images/report-1.png",
  "/images/report-2.png",
  "/images/report-3.png",
];

export function ProblemSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );
  return (
    <section
      className="py-12 bg-gradient-to-b from-white via-amber-100 via-orange-100 to-blue-100"
      id="problems"
    >
      <div className="px-4 py-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="space-y-4 mb-16 max-w-4xl">
          <h2 className="text-2xl md:text-3xl tracking-tighter inline font-medium">
            The silent killers of most startups.
          </h2>
          <p className="inline text-2xl md:text-3xl tracking-tighter pl-2 font-medium text-slate-600">
            Most SaaS don’t fail because of the product — they fail because no
            one understands them.
          </p>
        </div>
        <div className="md:flex gap-8 md:space-y-0 space-y-8">
          <div className="space-y-4 bg-white max-w-md p-8 border rounded-md shadow-xl">
            {problems.map((problem, index) => (
              <div key={index} className="relative p-2">
                {/* Stat - Small, colored, supporting evidence */}
                {/* <p className="text-sm font-semibold">{problem.stat}</p> */}

                {/* Title - Large, clear, direct problem statement */}
                <div className="flex items-end gap-4 pb-2 text-primary">
                  <div className="">{problem.icon}</div>
                  <h3 className="text-md  font-medium tracking-tight leading-tight">
                    {problem.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="leading-relaxed">{problem.description}</p>
              </div>
            ))}
            <div className="flex">
              <Link
                href="/sio-audit"
                className="flex items-center rounded-md text-lg gap-4 bg-primary text-white h-10 w-full justify-center px-6"
              >
                <span>Run free audit</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
          <div className="p-8 flex flex-1 items-center bg-white border rounded-md shadow-xl">
            <div>
              <Carousel
                className="w-full"
                opts={{
                  active: true,
                }}
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {imagesCar.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <img src={src} alt="" className="rounded-lg shadow" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
