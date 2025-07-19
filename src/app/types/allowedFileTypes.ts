import { AllowedFileType } from "@/app/types/course";

export const ALLOWED_FILE_TYPES: AllowedFileType = {
	image: {
		accept: ".jpg,.jpeg,.png",
		types: ["image/jpeg", "image/jpg", "image/png"],
	},
	document: {
		accept: ".pdf,.hwp,.doc,.docx,.zip,.jpg,.jpeg,.png,.gif",
		types: [
			"application/hwp",
			"application/x-hwp",
			"application/haansofthwp",
			"application/hwp-document",
			"x-application/hwp",
			"application/pdf",
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
