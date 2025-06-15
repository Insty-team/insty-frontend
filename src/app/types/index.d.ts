// 전역 타입을 정의하는 파일입니다.
// Response가 붙은 타입은 서버 API 응답 값

//1. 사용자 정보
export type UserType = "LEARNER" | "CREATOR";

export type UserInfo = {
	nickname: string;
	userType: string;
	introduce?: string;
};

export type UserProfileInfoResponse = {
	id: number;
	email: string;
	nickname: string;
	isEmailAgreed: boolean;
	thumbnailUrl: string;
	introduce: string;
	userType: string;
	createdAt?: string;
};

export type ChangeProfileForm = {
	nickname: string;
	email: string;
	password: string;
	changedPassword: string;
};

//2. 로그인/회원가입
export type LoginForm = {
	email: string;
	password: string;
	userType: string;
};

export type LoginResponse = {
	id: number;
	nickname: string;
	userType: UserType;
	token: Token;
};

export type Token = {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: string;
	refreshTokenExpiresAt: string;
	tokenType: string;
};

export type SignupForm = {
	nickname: string;
	email: string;
	password: string;
	confirmPassword?: string;
};

// 닉네임 or 이메일 입력
export type TextInputProps<TFieldValues> = {
	label: string;
	name: Path<TFieldValues>;
	type?: string;
	placeholder?: string;
	register: UseFormRegister<TFieldValues>;
	validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
	error?: FieldError;
	checkDuplication?: React.ReactNode;
};

// 비밀번호 입력
export type PasswordInputProps<TFieldValues> = {
	label: string;
	name: Path<TFieldValues>;
	placeholder?: string;
	register: UseFormRegister<TFieldValues>;
	validation?: RegisterOptions<TfieldValues, Path<TFieldValues>>;
	error?: FieldError;
};

// 비밀번호 확인 폼
export type PasswordConfirmInputProps<TFieldValues> = {
	label: string;
	name: Path<TFieldValues>;
	placeholder?: string;
	confirmPasswordName: string;
	register: UseFormRegister<TFieldValues>;
	validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
	error?: FieldError;
};

/**
 * 3. 차트
 */
export type ChartData = {
	name: string;
	fullLabel?: string;
	value: number;
};

export type CommonLineChartProps = {
	data: ChartData[];
	yAxisLabel?: string;
	tooltipLabel?: string;
	tooltipUnit?: string;
	height?: number;
};

/**
 * 4. 강의/영상
 */
export type UploadformData = {
	link: string;
	title: string;
	recipient: string;
	description: string;
	price: number;
	tags: string[];
	environments: Environment[];
	coreContents: string[];
};

export type CourseFormProps = {
	subject: string;
	initialData?: {
		link?: string;
		thumbnail?: string;
		title?: string;
		recipient?: string;
		description?: string;
		price?: number;
		tags?: string[];
		environments?: Environment[];
		coreContents?: string[];
	};
	onSubmit: (formData: UploadformData) => void;
	submitText?: string;
	onBack: () => void;
};
