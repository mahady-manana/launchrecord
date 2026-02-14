import Link from "next/link";
import Image from "next/image";
import logoLong from "@/public/logo-long.svg";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center">
      <Image 
        src={logoLong} 
        alt="LaunchRecord Logo"
        width={100}
        height={25}
        className="h-6 w-auto"
      />
    </Link>
  );
}
