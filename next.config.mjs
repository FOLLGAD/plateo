/** @type {import('next').NextConfig} */
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

// note: the if statement is present because you
//       only need to use the function during development
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

const nextConfig = {
};

export default nextConfig;
