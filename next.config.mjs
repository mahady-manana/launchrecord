/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";

const nextConfig = {
  images: {
    unoptimized: true,
  },
};
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
