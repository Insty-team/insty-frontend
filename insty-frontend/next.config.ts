import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
