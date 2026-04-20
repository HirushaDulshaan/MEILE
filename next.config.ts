/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Cloudinary සහ අනෙක් External Images allow කිරීම
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '**',
      },
    ],
  },

  // 2. Redirects (මුල් පිටුවෙන් /dees වෙත යැවීම)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dees',
        permanent: true,
      },
    ];
  },

  // 3. Prisma වැනි Packages සඳහා configuration
  serverExternalPackages: ["@prisma/client"],

  // 4. IP එකෙන් සහ Localhost එකෙන් access කිරීම (ඔයාගේ IP එක 192.168.1.158 ලෙස තබා ඇත)
 experimental: {
     // allowedDevOrigins වෙනුවට අලුත් version වල පාවිච්චි කරන්නේ මේක
     serverActions: {
       allowedOrigins: ['192.168.1.158:3000', 'localhost:3000'],
     },
 },
};

export default nextConfig;