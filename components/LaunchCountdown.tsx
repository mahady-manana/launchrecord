"use client";

import { useEffect, useState } from "react";

interface LaunchCountdownProps {
  launchDate: Date | string;
  className?: string;
}

export function LaunchCountdown({
  launchDate,
  className = "p-3 bg-blue-50 border border-blue-100 rounded-lg w-fit",
}: LaunchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const calculateTimeLeft = () => {
      const targetDate =
        typeof launchDate === "string" ? new Date(launchDate) : launchDate;
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  if (!isClient || !timeLeft) {
    return null;
  }

  const formatTime = (value: number) => String(value).padStart(2, "0");

  return (
    <div className={`flex ${className}`}>
      <div>
        <p className="font-bold text-blue-700 pr-4">Launch in</p>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center">
          <span className="text-2xl font-black text-blue-700 leading-none">
            {formatTime(timeLeft.days)}
          </span>
          <span className="text-xs font-semibold text-blue-600 mt-1">DD</span>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-black text-blue-700 leading-none">
            {formatTime(timeLeft.hours)}
          </span>
          <span className="text-xs font-semibold text-blue-600 mt-1">HH</span>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-black text-blue-700 leading-none">
            {formatTime(timeLeft.minutes)}
          </span>
          <span className="text-xs font-semibold text-blue-600 mt-1">MM</span>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-black text-blue-700 leading-none">
            {formatTime(timeLeft.seconds)}
          </span>
          <span className="text-xs font-semibold text-blue-600 mt-1">SS</span>
        </div>
      </div>
    </div>
  );
}
