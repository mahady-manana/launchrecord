import ExampleSIOReportPageClient from "@/research/example-sio-report/ExampleSIOReportPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIO-V5 Report Example - LaunchRecord Research",
  description:
    "Research preview: Example SIO-V5 report showing problem/solution-focused audit with measurable actions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExampleSIOReportPage() {
  return <ExampleSIOReportPageClient />;
}
