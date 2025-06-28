type RecommendMessage = {
  message_id: number;
  sender: "user" | "bot" | "assistant";
  courses?: CourseRecommend[];
  content: string;
  created_at: string;
}

type CourseRecommend = {
	course_id: string;
	course_title: string;
	thumbnail_url: string;
};

export type { RecommendMessage, CourseRecommend };