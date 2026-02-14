import { SignUpForm } from "@/components/launchrecord/signup-form";

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : "/";

  return <SignUpForm callbackUrl={callbackUrl} />;
}
