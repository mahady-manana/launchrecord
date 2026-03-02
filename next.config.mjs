/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  serverActions: {
    bodySizeLimit: "5mb", // Example: setting the limit to 10MB
  },
};

export default nextConfig;
