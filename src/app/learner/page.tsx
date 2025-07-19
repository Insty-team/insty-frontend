"use client";

import { useRouter } from "next/navigation";

function Home() {
	const router = useRouter();
	return router.push("/learner/recommend");
}

export default Home;
