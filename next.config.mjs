/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // Use "https" if your server supports it
        hostname: "localhost", // Replace with your server's hostname or IP
        port: "3000", // Replace with your server's port
        pathname: "/uploads/**", // Allow images from the "uploads" folder
      },
    ],
  },
};

export default nextConfig;
