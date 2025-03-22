/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost"], // Allow localhost to serve images
      },
      async headers() {
        return [
          {
            source: "/uploads/:path*", // Allow images from /uploads/
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
        ];
      },
    
};

export default nextConfig;
