//이메일 검증 정규식
export const emailReg =
	/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

//비밀 번호 검증 정규식
export const passwordReg =
	/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

//닉네임 검증 정규식
export const nicknameReg = /^(?=.*[a-zA-Z가-힣0-9])[a-zA-Z가-힣0-9]{2,10}$/;
