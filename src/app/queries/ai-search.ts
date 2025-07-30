import { useQuery } from "@tanstack/react-query";

import { getAISearchRecommend } from "../api";

const useGetAISearchRecommendQuery = () => {
	return useQuery({
		queryKey: ["aiSearchRecommend"],
		queryFn: getAISearchRecommend,
	});
};

export { useGetAISearchRecommendQuery };
