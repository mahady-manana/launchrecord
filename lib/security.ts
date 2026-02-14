export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const requestOrigin = new URL(request.url).origin;

  if (origin === requestOrigin) {
    return true;
  }

  const allowedOrigins = [process.env.NEXTAUTH_URL, process.env.APP_URL].filter(
    Boolean,
  ) as string[];

  return allowedOrigins.includes(origin);
}

export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "anonymous";
}
