import type { NextConfig } from "next";
import { plugin } from "postcss"; // Unnecessary import
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, // Match all `.svg` files
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false,
                },
              ],
            },
            icon: true,
          },
        },
      ],
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
