type MyCoursesItems = {
	courseId: number;
	title: string;
	price: number;
	viewCount: number;
	commentCount: number;
	tags: string[];
	thumbnailUrl: string | null;
	isShow: boolean;
	createdAt: string;
};

export type { MyCoursesItems };
