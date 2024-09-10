/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["t.me", "telegram.org"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
};

export default nextConfig;
