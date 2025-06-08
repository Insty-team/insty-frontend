"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import resetTheme from "./resetTheme";

const queryClient = new QueryClient();

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
