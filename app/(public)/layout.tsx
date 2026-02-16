import { Footer } from "@/components/launchrecord/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer></Footer>
    </>
  );
}
