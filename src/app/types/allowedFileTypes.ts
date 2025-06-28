import { AllowedFileType } from "@/app/types/course";

export const ALLOWED_FILE_TYPES: AllowedFileType = {
	document: {
		accept: ".pdf,.hwp,.doc,.docx,.zip,.jpg,.jpeg,.png,.gif",
		types: [
			"application/hwp",
			"application/pdf",
			"application/x-hwp",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/zip",
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
		],
	},
	video: {
		accept: ".mp4,.mov,.avi",
		types: ["video/mp4", "video/quicktime", "video/x-msvideo"],
	},
};
