import { HomePage } from "@/components/launchrecord/home-page";

interface LaunchRecordHomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function LaunchRecordHomePage({
  searchParams,
}: LaunchRecordHomePageProps) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return <HomePage initialQuery={initialQuery} />;
}
