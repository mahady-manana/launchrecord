import { Navbar } from "@/components/launchrecord/navbar";
import { getUserFromSession } from "@/lib/get-user-from-session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();

  if (!user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Navbar 
        query="" 
        onQueryChange={() => {}} 
        onOpenLaunchModal={() => {}} 
        user={user} 
        authStatus="authenticated" 
      />
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}