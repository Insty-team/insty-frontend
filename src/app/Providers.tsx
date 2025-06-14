"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./queries";

import resetTheme from "./resetTheme";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<CacheProvider>
			<QueryClientProvider client={queryClient}>
				<ChakraProvider resetCSS={false} theme={resetTheme}>
					{children}
				</ChakraProvider>
			</QueryClientProvider>
		</CacheProvider>
	);
}
