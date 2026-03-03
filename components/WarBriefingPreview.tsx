"use client";

import { Button } from "@/components/ui/button";
import {
  getOverallScore,
  getProductStatus,
  getStatusLabel,
  type ProductStatus,
} from "@/lib/product-status";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

interface WarBriefingPreviewProps {
  saasName?: string;
  rank?: number;
  rankDrop?: number;
  timestamp?: string;
  refId?: string;
}

interface MetricData {
  name: string;
  score: number;
  status: ProductStatus;
  label: string;
  description: string;
}

export function WarBriefingPreview({
  saasName = "Ghost AI Tool",
  rank = 1204,
  rankDrop = 42,
  timestamp = "March 2, 2026",
  refId = "LR-992-DELTA",
}: WarBriefingPreviewProps) {
  const metrics: MetricData[] = [
    {
      name: "AEO Visibility",
      score: 4,
      status: getStatusLabel(4),
      label: '"Invisible."',
      description:
        "LLM simulations (Claude-3.5) show 0.04% mention share. You are not a citable authority. Perplexity bypasses you for 3 competitors.",
    },
    {
      name: "Positioning",
      score: 13,
      status: getStatusLabel(13),
      label: "87% Generic.",
      description:
        'Your H1 mirrors 14 "Market Laggards." You are drifting toward the commodity mean. High risk of price-war extinction.',
    },
    {
      name: "Product Clarity",
      score: 35,
      status: getStatusLabel(35),
      label: "TTA: 58 Seconds.",
      description:
        '"Time-to-Aha" is terminal. A CFO would bounce before understanding the ROI. Failure to communicate output over input.',
    },
    {
      name: "Momentum",
      score: 18,
      status: getStatusLabel(18),
      label: "Negative Velocity.",
      description:
        "Activity is not progress. No verified technical pivots or revenue growth detected in 14 days. You are stagnating.",
    },
    {
      name: "Proof Vault",
      score: 0,
      status: getStatusLabel(0),
      label: "Empty.",
      description:
        "0 Verified Revenue Streams. 0 Moat Evidence. No proprietary data sets found. Your claims are currently unbacked noise.",
    },
  ];

  const overallScore = getOverallScore(metrics.map((m) => m.score));
  const productStatus = getProductStatus(overallScore);
  const RadialGauge = ({ metric }: { metric: MetricData }) => {
    const statusConfig = getProductStatus(metric.score);
    const data = [
      { name: metric.name, value: 100, fill: "#1e293b" },
      { name: metric.name, value: metric.score, fill: statusConfig.colorHex },
    ];

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-26 h-26 md:w-32 md:h-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              outerRadius="100%"
              innerRadius="50%"
              barSize={10}
              barGap={5}
              data={data}
              startAngle={180}
              endAngle={-178}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={4}
                background={{ fill: "#f0fcd5" }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center rounded-full w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center">
              <div
                className="text-2xl md:text-3xl font-black"
                style={{ color: statusConfig.colorHex }}
              >
                {metric.score}
              </div>
              <div className="text-[9px] uppercase">{statusConfig.status}</div>
            </div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <p
            className="font-mono text-[9px] uppercase tracking-[0.2em]"
            style={{ color: statusConfig.colorHex }}
          >
            {metric.name}
          </p>
          <h4 className="text-lg md:text-xl font-bold">{metric.label}</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-light px-2">
            {metric.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-16 bg-black text-white border border-slate-800 rounded-sm overflow-hidden shadow-[0_0_60px_-15px_rgba(255,0,0,0.15)]">
      {/* System Status Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-red-500 animate-pulse">
            ● LIVE_AUDIT_IN_PROGRESS
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            REF_ID: {refId}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase">
          Timestamp: {timestamp}
        </div>
      </div>

      <div className="p-8 md:p-12 space-y-2">
        {/* 1. Header: The Verdict */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-800 pb-10">
          <div className="space-y-2">
            <h3 className="text-3xl font-black uppercase tracking-tighter italic">
              SF-1 War Briefing: {saasName}
            </h3>
            <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">
              Global Sovereign Rank: #{rank.toLocaleString()} (▼ {rankDrop}{" "}
              Position Drop)
            </p>
          </div>
          <div
            className="px-6 py-2 text-center"
            style={{ background: productStatus.colorHex }}
          >
            <div className="text-4xl font-mono font-black text-white italic">
              {productStatus.status}
            </div>
            <div className="text-[9px] font-mono uppercase text-white tracking-tighter">
              Current Status
            </div>
          </div>
        </div>

        {/* 2. The 5-Angle Radial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {metrics.map((metric, index) => (
            <RadialGauge key={index} metric={metric} />
          ))}
        </div>

        {/* Summary / The "Why You're Here" */}
        <div className="space-y-4 bg-red-950/20 p-6 border border-red-900/30">
          <p className="font-mono text-[10px] text-red-500 uppercase tracking-[0.2em]">
            DIRECT COMMAND
          </p>
          <p className="text-sm font-bold leading-tight">
            "You are building a feature, not a business. Secure your record or
            prepare for archive."
          </p>
        </div>

        {/* 3. Footer: Tactical Missions */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-green-500 uppercase tracking-[0.4em]">
              Required_Missions_To_Fix_Record:
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-[11px] font-mono text-slate-300">
              <li>&gt; REWRITE_H1_FOR_SPECIFIC_ROI_OUTPUT</li>
              <li>&gt; UPLOAD_REVENUE_PROOF_FOR_FEB_2026</li>
              <li>&gt; PUBLISH_PROPRIETARY_AEO_FRAMEWORK</li>
              <li>&gt; SUBMIT_USER_RETENTION_COHORT_DATA</li>
            </ul>
          </div>
          <div className="text-right flex flex-col gap-2">
            <Button className="bg-white text-black font-black uppercase text-xs px-8 rounded-none hover:bg-red-600 hover:text-white transition-all">
              Secure My Record
            </Button>
            <p className="text-[9px] font-mono text-slate-600 uppercase">
              Session will expire in 04:59
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
