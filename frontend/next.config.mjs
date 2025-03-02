/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'fastly.picsum.photos',
          },
          {
            protocol: 'https',
            hostname: 'unsplash.com'
          }
        ],
    },
};

export default nextConfig;
