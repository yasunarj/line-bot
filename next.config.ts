import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_MY_ADDRESS: process.env.NEXT_PUBLIC_MY_ADDRESS,
    NEXT_PUBLIC_MY_PASSWORD: process.env.NEXT_PUBLIC_MY_PASSWORD,
  },
};

module.exports = nextConfig;

