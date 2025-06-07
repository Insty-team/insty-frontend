"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";

import resetTheme from "./resetTheme";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<CacheProvider>
			<ChakraProvider resetCSS={false} theme={resetTheme}>
				{children}
			</ChakraProvider>
		</CacheProvider>
	);
}
