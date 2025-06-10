import {
	getEmailCheck,
	getNicknameCheck,
	postSignup,
} from "@/app/api/backend/user";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Signup from "../page";

// API 모킹
vi.mock("@/app/api/backend/user", () => ({
	getEmailCheck: vi.fn(),
	getNicknameCheck: vi.fn(),
	postSignup: vi.fn(),
}));

// next/navigation 모킹
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

// SweetAlert2 모킹
vi.mock("sweetalert2", () => ({
	default: {
		fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
	},
}));

describe("Signup Form", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("닉네임 중복 체크가 실패하면 회원가입 버튼이 비활성화되어야 함", async () => {
		vi.mocked(getNicknameCheck).mockResolvedValue({
			isAvailable: false,
			reason: "이미 사용 중인 닉네임입니다.",
		});

		render(<Signup />);

		const nicknameInput = screen.getByPlaceholderText("닉네임을 입력해주세요.");
		fireEvent.change(nicknameInput, { target: { value: "testuser" } });

		const nicknameCheckButton = screen.getByText("닉네임 중복 확인");
		fireEvent.click(nicknameCheckButton);

		await waitFor(() => {
			expect(
				screen.getByText("이미 사용 중인 닉네임입니다."),
			).toBeInTheDocument();
		});

		const submitButton = screen.getByText("회원가입");
		expect(submitButton).toBeDisabled();
	});

	it("이메일 중복 체크가 실패하면 회원가입 버튼이 비활성화되어야 함", async () => {
		vi.mocked(getEmailCheck).mockResolvedValue({
			isAvailable: false,
			reason: "이미 사용 중인 이메일입니다.",
		});

		render(<Signup />);

		const emailInput = screen.getByPlaceholderText("이메일을 입력해주세요.");
		fireEvent.change(emailInput, { target: { value: "test@example.com" } });

		const emailCheckButton = screen.getByText("이메일 중복 확인");
		fireEvent.click(emailCheckButton);

		await waitFor(() => {
			expect(
				screen.getByText("이미 사용 중인 이메일입니다."),
			).toBeInTheDocument();
		});

		const submitButton = screen.getByText("회원가입");
		expect(submitButton).toBeDisabled();
	});

	it("비밀번호 형식이 맞지 않으면 에러 메시지가 표시되어야 함", async () => {
		render(<Signup />);

		const [passwordInput, confirmPasswordInput] =
			screen.getAllByPlaceholderText("비밀번호를 입력해주세요.");

		fireEvent.change(passwordInput, { target: { value: "123" } });
		fireEvent.blur(passwordInput);

		await waitFor(() => {
			const errorMessage = screen.getByText("비밀번호 형식이 잘못되었습니다.");
			expect(errorMessage).toBeInTheDocument();
		});
	});

	it("비밀번호 확인이 일치하지 않으면 에러 메시지가 표시되어야 함", async () => {
		render(<Signup />);

		const [passwordInput, confirmPasswordInput] =
			screen.getAllByPlaceholderText("비밀번호를 입력해주세요.");

		fireEvent.change(passwordInput, { target: { value: "Password123!" } });
		fireEvent.change(confirmPasswordInput, {
			target: { value: "Password123!!" },
		});
		fireEvent.blur(confirmPasswordInput);

		await waitFor(() => {
			const errorMessage = screen.getByText("비밀번호가 일치하지 않습니다.");
			expect(errorMessage).toBeInTheDocument();
		});
	});

	it("모든 유효성 검사를 통과하면 회원가입이 성공해야 함", async () => {
		vi.mocked(getNicknameCheck).mockResolvedValue({
			isAvailable: true,
			reason: "사용 가능한 닉네임입니다.",
		});
		vi.mocked(getEmailCheck).mockResolvedValue({
			isAvailable: true,
			reason: "사용 가능한 이메일입니다.",
		});
		vi.mocked(postSignup).mockResolvedValue({
			nickname: "testuser",
		});

		render(<Signup />);

		const nicknameInput = screen.getByPlaceholderText("닉네임을 입력해주세요.");
		fireEvent.change(nicknameInput, { target: { value: "testuser" } });
		fireEvent.click(screen.getByText("닉네임 중복 확인"));

		const emailInput = screen.getByPlaceholderText("이메일을 입력해주세요.");
		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.click(screen.getByText("이메일 중복 확인"));

		const [passwordInput, confirmPasswordInput] =
			screen.getAllByPlaceholderText("비밀번호를 입력해주세요.");
		fireEvent.change(passwordInput, { target: { value: "Password123!" } });
		fireEvent.change(confirmPasswordInput, {
			target: { value: "Password123!" },
		});

		await waitFor(() => {
			expect(screen.getByText("사용 가능한 닉네임입니다.")).toBeInTheDocument();
			expect(screen.getByText("사용 가능한 이메일입니다.")).toBeInTheDocument();
		});

		const submitButton = screen.getByText("회원가입");
		expect(submitButton).not.toBeDisabled();

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(postSignup).toHaveBeenCalledWith({
				nickname: "testuser",
				email: "test@example.com",
				password: "Password123!",
			});
		});
	});
});
