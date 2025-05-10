//전역(공통) 타입 정의

//1. 로그인 타입
export type LoginForm = {
    email: string;
    password: string;
    userType: string,
}

//2. 회원가입 타입
export type SignupForm = {
    nickname: string;
    email: string;
    password: string,
    confirmPassword?: string,
}

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
}

//4. 비밀번호 폼
export type PasswordInputProps<TFieldValues> = {
    label: string;
    name: Path<TFieldValues>;
    placeholder?: string;
    register: UseFormRegister<TFieldValues>;
    validation?: RegisterOptions<TfieldValues, Path<TFieldValues>>;
    error?: FieldError;
}

//5. 비밀번호 확인 폼
type PasswordConfirmInputProps<TFieldValues> = {
    label: string;
    name: Path<TFieldValues>;
    placeholder?: string;
    confirmPasswordName: string;
    register: UseFormRegister<TFieldValues>;
    validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
    error?: FieldError;
};