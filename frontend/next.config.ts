import type { NextConfig } from "next";
import { config } from "process";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode:true,
  webpack: config => {
      config.resolve.fallback = { fs: false, net: false, tls: false };
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    },
    images : {
      remotePatterns:[
        {
          protocol:'https',
          hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
        }
      ]
    }

};

// next.config.js


export default nextConfig;
