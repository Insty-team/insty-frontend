import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	optimizePackageImports: ["@chakra-ui/react"],
	async redirects() {
		return [
			{
				source: "/creator/mypage",
				destination: "/creator/mypage/profile",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
