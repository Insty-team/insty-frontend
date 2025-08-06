import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "dev.insty.ai.kr",
			},
			{
				protocol: "https",
				hostname: "insty.ai.kr",
			},
		],
	},
	optimizePackageImports: ["@chakra-ui/react"],
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "./src"),
		};
		return config;
	},
};

export default nextConfig;
