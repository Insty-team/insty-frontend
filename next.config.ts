import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	optimizePackageImports: ["@chakra-ui/react"],
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "./src"),
		};
		return config;
	},
	images: {
		domains: ["dev.insty.ai.kr"],
	},
};

export default nextConfig;
