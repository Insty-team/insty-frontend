/**
 * 전역 타입을 정의하는 파일입니다.
 */

//1. 로그인 타입
export type LoginForm = {
	email: string;
	password: string;
};

//2. 회원가입 타입
export type SignupForm = {
	nickname: string;
	email: string;
	password: string;
	confirmPassword?: string;
};

//3. 닉네임 or 이메일 폼
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

//4. 비밀번호 폼
export type PasswordInputProps<TFieldValues> = {
	label: string;
	name: Path<TFieldValues>;
	placeholder?: string;
	register: UseFormRegister<TFieldValues>;
	validation?: RegisterOptions<TfieldValues, Path<TFieldValues>>;
	error?: FieldError;
};

//5. 비밀번호 확인 폼
export type PasswordConfirmInputProps<TFieldValues> = {
	label: string;
	name: Path<TFieldValues>;
	placeholder?: string;
	confirmPasswordName: string;
	register: UseFormRegister<TFieldValues>;
	validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
	error?: FieldError;
};

//6. 차트 라벨, 툴팁, 값 입력
export type ChartData = {
	name: string;
	fullLabel?: string;
	value: number;
};

//7 차트 값 타입
export type CommonLineChartProps = {
	data: ChartData[];
	yAxisLabel?: string;
	tooltipLabel?: string;
	tooltipUnit?: string;
	height?: number;
};

//8. 프로필 변경 타입
export type ChangeProfileForm = {
	nickname: string
	email: string
	password: string
	changedPassword: string
}

export type UploadformData = {
	link: string;
	title: string;
	recipient: string;
	description: string;
	price: number;
	tags: string[];
	environments: Environment[];
	coreContents: string[];
}

export type VideoFormProps ={
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
}

//유저 정보 저장용
export type UserInfo = {
	nickname: string;
	userType?: string;
	description?: string;
}