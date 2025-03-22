/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "52.66.102.198", // Your AWS Public IP
      },
    ],
  },
};

export default nextConfig;
