/** @type {import('next').NextConfig} */
const nextConfig = {

async redirects() {
    return [
      {
        source: '/',
        destination: '/dees',
        permanent: true, // SEO walata hodai
      },
    ]
  },
  // Hirusha, 'serverComponentsExternalPackages' වෙනුවට දැන් පාවිච්චි කරන්නේ මේක:
  serverExternalPackages: ["@prisma/client"],

  // IP එකෙන් access කරන්න නම් මේක අනිවාර්යයි
  allowedDevOrigins: ['192.168.1.158:3000', 'localhost:3000'],

  experimental: {
    // අවශ්‍ය නම් පමණක් වෙනත් experimental features මෙතන දාන්න
  }
};

export default nextConfig;