import { useQuery } from "@tanstack/react-query";

import { getAIChatHistory } from "../api/ai";

const useGetAIChatHistoryQuery = ({
	date = "",
	keyword = "",
}: {
	date?: string;
	keyword?: string;
}) => {
	return useQuery({
		queryKey: ["ai-history", date, keyword],
		queryFn: () => getAIChatHistory({ date, keyword }),
	});
};

export { useGetAIChatHistoryQuery };
