"use client";
import { useEffect } from "react";

export default function ScrollAnimations() {
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.remove("opacity-0", "translate-y-10");
						entry.target.classList.add("opacity-100", "translate-y-0");
					}
				});
			},
			{
				//30% 보이면 애니 시작
				threshold: 0.3,
				rootMargin: "-10% 0px",
			},
		);

		const sections = document.querySelectorAll("[data-section]");
		sections.forEach((section) => observer.observe(section));

		return () => observer.disconnect();
	}, []);
	return null;
}
