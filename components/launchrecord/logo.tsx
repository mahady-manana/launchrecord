import logoLong from "@/public/logo-long.svg";
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src={logoLong}
        alt="LaunchRecord Logo"
        width={100}
        height={25}
        className="h-6 w-auto hidden md:block"
      />
      <Image
        src="/lr-logo.svg"
        alt="LaunchRecord Logo"
        width={40}
        height={40}
        className="h-8 w-auto md:hidden block"
      />
    </Link>
  );
}
