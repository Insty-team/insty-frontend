"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaCheckSquare, FaExclamationCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import Swal from "sweetalert2";

import Loading from "@/app/_components/common/Loading";
import { getCourseRequestForm } from "@/app/api/ai";
import { usePostCourseRequestMutation } from "@/app/queries";
import { ApiFormField, FormField } from "@/app/types/community";

interface FormData {
	title: string;
	description: string;
	[key: string]: string | string[];
}

function CourseRequestPage() {
	const [formFields, setFormFields] = useState<FormField[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			title: "",
			description: "",
		},
	});

	// API 데이터를 프론트엔드 형태로 변환하는 함수
	const transformFormFields = (apiFields: ApiFormField[]): FormField[] => {
		return apiFields.map((field) => {
			// API 타입을 프론트엔드 타입으로 변환
			let mappedType: FormField["type"] = "text";
			switch (field.type) {
				case "input_text":
					mappedType = "text";
					break;
				case "text_area":
					mappedType = "textarea";
					break;
				case "radio":
					mappedType = "radio";
					break;
				case "checkbox":
					mappedType = "checkbox";
					break;
				default:
					mappedType = "text";
			}

			return {
				id: field.id,
				fieldKey: field.field_key,
				label: field.label,
				type: mappedType,
				isRequired: field.is_required,
				orderNo: field.order_no,
				options: field.options.map((option) => ({
					id: option.id,
					label: option.label,
					orderNo: option.order_no,
				})),
			};
		});
	};

	useEffect(() => {
		const getFormFields = async () => {
			try {
				const res = await getCourseRequestForm();
				if (res.success && res.data.form) {
					const transformedFields = transformFormFields(res.data.form);
					// order_no로 정렬
					transformedFields.sort((a, b) => a.orderNo - b.orderNo);
					setFormFields(transformedFields);

					const dynamicDefaults: FormData = {
						title: "",
						description: "",
					};
					transformedFields.forEach((field) => {
						dynamicDefaults[`field_${field.id}`] =
							field.type === "checkbox" ? [] : "";
						if (field.type === "radio" || field.type === "checkbox") {
							const otherOption = field.options.find(
								(opt) => opt.label.toLowerCase() === "other",
							);
							if (otherOption) {
								dynamicDefaults[`field_${field.id}_answer_text`] = "";
							}
						}
					});
					reset({
						...dynamicDefaults,
					});
				}
			} catch (error) {
				console.error("폼 데이터 로딩 실패:", error);
			} finally {
				setIsLoading(false);
			}
		};
		getFormFields();
	}, []);

	const postMutation = usePostCourseRequestMutation();

	// 폼 제출 핸들러
	const onSubmit = async (data: FormData) => {
		console.log("폼 제출 데이터:", data);

		// answers 배열 생성
		const answers = formFields
			.map((field) => {
				const fieldKey = `field_${field.id}`;
				const fieldValue = data[fieldKey];
				const otherTextKey = `${fieldKey}_answer_text`;
				const otherText = data[otherTextKey] as string;

				// 선택형 필드 (radio, checkbox)
				if (field.type === "radio" || field.type === "checkbox") {
					const answerOptionIds = Array.isArray(fieldValue)
						? fieldValue.map((id) => parseInt(id))
						: fieldValue
							? [parseInt(fieldValue as string)]
							: [];

					const answer: {
						field_id: number;
						answer_option_ids: number[];
						answer_text?: string;
					} = {
						field_id: field.id,
						answer_option_ids: answerOptionIds,
					};

					// "Other" 텍스트가 있으면 추가
					if (otherText && otherText.trim()) {
						answer.answer_text = otherText.trim();
					}

					return answer;
				}

				// 텍스트 필드 (text, textarea)
				else if (field.type === "text" || field.type === "textarea") {
					const answerText = fieldValue as string;

					// 값이 있는 경우만 추가 (빈 문자열은 제외)
					if (answerText && answerText.trim()) {
						return {
							field_id: field.id,
							answer_text: answerText.trim(),
						};
					}

					return null;
				}

				return null;
			})
			.filter((answer) => answer !== null); // null 값 제거

		const submitData = {
			title: data.title,
			description: data.description,
			answers: answers,
		};

		console.log("제출할 데이터:", submitData);
		// TODO: 실제 제출 API 호출
		postMutation.mutate(submitData, {
			onSuccess: (res) => {
				if (res.success) {
					Swal.fire({
						title: "강의 요청이 제출되었습니다.",
						icon: "success",
						text: "강의 요청이 제출되었습니다.",
						confirmButtonText: "확인",
						confirmButtonColor: "#6ead79",
					}).then(() => {
						router.push("/learner/mypage");
					});
				} else {
					Swal.fire({
						title: "강의 요청 제출 실패",
						text: `${res.error?.message || "알 수 없는 오류가 발생했습니다."}`,
						icon: "error",
					});
				}
			},
			onError: (error) => {
				console.error(error);
				Swal.fire({
					title: "강의 요청 제출 실패",
					text: "서버와 통신 중 오류가 발생했습니다.",
					icon: "error",
				});
			},
		});
	};

	// 폼 필드 렌더링 함수
	const renderFormField = (field: FormField) => {
		const fieldName = `field_${field.id}`;

		switch (field.type) {
			case "text":
				return (
					<Controller
						name={fieldName}
						control={control}
						rules={{
							required: field.isRequired
								? `${field.label}은(는) 필수입니다.`
								: false,
						}}
						render={({ field: controllerField }) => (
							<input
								{...controllerField}
								type="text"
								className="w-full px-5 py-4 text-lg border-2 border-gray-scale-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 bg-white"
								placeholder={`${field.label}을(를) 입력해주세요`}
							/>
						)}
					/>
				);

			case "textarea":
				return (
					<Controller
						name={fieldName}
						control={control}
						render={({ field: controllerField }) => (
							<textarea
								{...controllerField}
								rows={6}
								className="w-full px-5 py-4 text-lg border-2 border-gray-scale-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 bg-white resize-none"
								placeholder={`${field.label}을(를) 자세히 입력해주세요`}
							/>
						)}
					/>
				);

			case "radio": {
				// "Other" 옵션 찾기
				const otherOption = field.options.find(
					(opt) => opt.label.toLowerCase() === "other",
				);
				const selectedValue = watch(fieldName) as string;
				const isOtherSelected =
					otherOption && selectedValue === String(otherOption.id);

				return (
					<>
						<Controller
							name={fieldName}
							control={control}
							rules={{
								required: field.isRequired
									? `${field.label}을(를) 선택해주세요.`
									: false,
							}}
							render={({ field: controllerField }) => (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{field.options
										.sort((a, b) => a.orderNo - b.orderNo)
										.map((option) => (
											<label
												key={option.id}
												className={`
												relative flex items-center p-5 rounded-xl border-2 cursor-pointer transition-colors duration-200
												${
													controllerField.value === String(option.id)
														? "border-primary-green-500 bg-primary-green-100"
														: "border-gray-scale-200 bg-white hover:border-primary-green-300 hover:bg-primary-green-50"
												}
											`}
											>
												<input
													type="radio"
													value={option.id}
													checked={controllerField.value === String(option.id)}
													onChange={() =>
														controllerField.onChange(String(option.id))
													}
													className="sr-only"
												/>
												<div
													className={`
												w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors duration-200
												${
													controllerField.value === String(option.id)
														? ""
														: "border-gray-scale-300 bg-white"
												}
											`}
												>
													{controllerField.value === String(option.id) && (
														<FaCircleCheck className="w-6 h-6 text-primary-green-500" />
													)}
												</div>
												<span
													className={`text-lg font-semibold transition-colors duration-200 ${
														controllerField.value === String(option.id)
															? "text-primary-green-500"
															: "text-black-300"
													}`}
												>
													{option.label}
												</span>
											</label>
										))}
								</div>
							)}
						/>

						{/* "Other" 선택 시 텍스트 입력란 표시 */}
						{isOtherSelected && (
							<Controller
								name={`${fieldName}_answer_text`}
								control={control}
								rules={{
									required: field.isRequired
										? "상세 내용을 입력해주세요."
										: false,
								}}
								render={({ field: otherField }) => (
									<div className="mt-4">
										<input
											{...otherField}
											type="text"
											placeholder="상세 내용을 입력해주세요"
											className="w-full px-5 py-4 text-lg border-2 border-gray-scale-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 bg-white"
										/>
										{errors[`${fieldName}_answer_text`] && (
											<div className="flex items-center gap-2 mt-2">
												<FaExclamationCircle className="w-5 h-5 text-secondary-red-300" />
												<p className="text-secondary-red-300 text-base font-medium">
													{errors[`${fieldName}_answer_text`]?.message}
												</p>
											</div>
										)}
									</div>
								)}
							/>
						)}
					</>
				);
			}

			case "checkbox": {
				// "Other" 옵션 찾기
				const otherOption = field.options.find(
					(opt) => opt.label.toLowerCase() === "other",
				);
				const selectedValues = watch(fieldName) as string[];
				const isOtherChecked =
					otherOption &&
					Array.isArray(selectedValues) &&
					selectedValues.includes(String(otherOption.id));

				return (
					<>
						<Controller
							name={fieldName}
							control={control}
							rules={{
								required: field.isRequired
									? `${field.label}을(를) 선택해주세요.`
									: false,
							}}
							render={({ field: controllerField }) => (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{field.options
										.sort((a, b) => a.orderNo - b.orderNo)
										.map((option) => {
											const currentValues = Array.isArray(controllerField.value)
												? controllerField.value
												: [];
											const isChecked = currentValues.includes(
												String(option.id),
											);

											return (
												<label
													key={option.id}
													className={`
													relative flex items-center p-5 rounded-xl border-2 cursor-pointer transition-colors duration-200
													${
														isChecked
															? "border-primary-green-500 bg-primary-green-100"
															: "border-gray-scale-200 bg-white hover:border-primary-green-300 hover:bg-primary-green-50"
													}
												`}
												>
													<input
														type="checkbox"
														checked={isChecked}
														onChange={(e) => {
															if (e.target.checked) {
																controllerField.onChange([
																	...currentValues,
																	String(option.id),
																]);
															} else {
																controllerField.onChange(
																	currentValues.filter(
																		(value) => value !== String(option.id),
																	),
																);
															}
														}}
														className="sr-only"
													/>
													<div
														className={`
													w-6 h-6 rounded border-2 mr-4 flex items-center justify-center transition-colors duration-200
													${isChecked ? "" : "border-gray-scale-300 bg-white"}
												`}
													>
														{isChecked && (
															<FaCheckSquare className="w-6 h-6 text-primary-green-500" />
														)}
													</div>
													<span
														className={`text-lg font-semibold transition-colors duration-200 ${
															isChecked
																? "text-primary-green-500"
																: "text-black-300"
														}`}
													>
														{option.label}
													</span>
												</label>
											);
										})}
								</div>
							)}
						/>

						{/* "Other" 선택 시 텍스트 입력란 표시 */}
						{isOtherChecked && (
							<Controller
								name={`${fieldName}_answer_text`}
								control={control}
								rules={{
									required: field.isRequired
										? "상세 내용을 입력해주세요."
										: false,
								}}
								render={({ field: otherField }) => (
									<div className="mt-4">
										<input
											{...otherField}
											type="text"
											placeholder="상세 내용을 입력해주세요"
											className="w-full px-5 py-4 text-lg border-2 border-gray-scale-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 bg-white"
										/>
										{errors[`${fieldName}_answer_text`] && (
											<div className="flex items-center gap-2 mt-2">
												<FaExclamationCircle className="w-5 h-5 text-secondary-red-300" />
												<p className="text-secondary-red-300 text-base font-medium">
													{errors[`${fieldName}_answer_text`]?.message}
												</p>
											</div>
										)}
									</div>
								)}
							/>
						)}
					</>
				);
			}

			default:
				return null;
		}
	};

	if (isLoading) {
		return (
			<div className="max-w-2xl mx-auto p-6">
				<div className="text-center py-12">
					<p className="text-black-300 text-lg">폼을 불러오는 중...</p>
					<Loading width={40} height={40} />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-scale-50 to-white">
			<div className="max-w-4xl mx-auto px-6 py-12">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-black-300 mb-4">
						강의 요청하기
					</h1>
					<p className="text-xl text-black-300 max-w-2xl mx-auto leading-relaxed">
						원하시는 강의에 대한 정보를 입력해주세요.
						<br />
						검토 후 맞춤형 강의를 제작해드립니다.
					</p>
				</div>

				{/* 폼 카드 */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-scale-100 overflow-hidden">
					<div className="p-8 md:p-12">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
							{/* 제목 입력 */}
							<div className="bg-gray-scale-50 rounded-xl p-6 border-l-4 border-primary-green">
								<div className="flex items-start gap-4">
									<div className="flex-shrink-0 w-6 h-6 bg-primary-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
										📝
									</div>
									<div className="flex-1 space-y-4">
										<label className="block text-xl font-bold text-black-400">
											요청 제목
											<span className="text-secondary-red-300 ml-2 text-xl">
												*
											</span>
										</label>
										<div className="space-y-2">
											<Controller
												name="title"
												control={control}
												rules={{
													required: "요청 제목은 필수입니다.",
												}}
												render={({ field }) => (
													<input
														{...field}
														type="text"
														className="w-full px-5 py-4 text-lg border-2 border-gray-scale-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 bg-white"
														placeholder="예: React를 배우고 싶어요, Python 기초를 배우고 싶어요"
													/>
												)}
											/>
											{errors.title && (
												<div className="flex items-center gap-2 mt-2">
													<FaExclamationCircle className="w-5 h-5 text-secondary-red-300" />
													<p className="text-secondary-red-300 text-base font-medium">
														{errors.title?.message}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* 설명 입력 */}
							<div className="bg-gray-scale-50 rounded-xl p-6 border-l-4 border-primary-green">
								<div className="flex items-start gap-4">
									<div className="flex-shrink-0 w-6 h-6 bg-primary-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
										📄
									</div>
									<div className="flex-1 space-y-4">
										<label className="block text-xl font-bold text-black-400">
											요청 상세 내용
											<span className="text-secondary-red-300 ml-2 text-xl">
												*
											</span>
										</label>
										<div className="space-y-2">
											<Controller
												name="description"
												control={control}
												rules={{
													required: "요청 상세 내용은 필수입니다.",
												}}
												render={({ field }) => (
													<textarea
														{...field}
														rows={6}
														className="w-full px-5 py-4 text-lg border-2 border-gray-scale-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-green/20 focus:border-primary-green transition-all duration-200 bg-white resize-none"
														placeholder="배우고 싶은 내용을 자세히 설명해주세요. 예: 웹개발 입문자인데 React로 쇼핑몰을 만들어보고 싶어요."
													/>
												)}
											/>
											{errors.description && (
												<div className="flex items-center gap-2 mt-2">
													<FaExclamationCircle className="w-5 h-5 text-secondary-red-300" />
													<p className="text-secondary-red-300 text-base font-medium">
														{errors.description?.message}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* API로 받은 동적 폼 필드들 */}
							{formFields.map((field, index) => (
								<div
									key={field.id}
									className="bg-gray-scale-50 rounded-xl p-6 border-l-4 border-primary-green"
								>
									<div className="flex items-start gap-4">
										<div className="flex-shrink-0 w-6 h-6 bg-primary-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
											{index + 1}
										</div>

										<div className="flex-1 space-y-4">
											<label className="block text-xl font-bold text-black-400">
												{field.label}
												{field.isRequired && (
													<span className="text-secondary-red-300 ml-2 text-xl">
														*
													</span>
												)}
												{field.id === 2 && (
													<span className="text-secondary-red-300 ml-2 text-base">
														(다중선택 가능)
													</span>
												)}
											</label>

											<div className="space-y-2">
												{renderFormField(field)}
												{errors[`field_${field.id}`] && (
													<div className="flex items-center gap-2 mt-2">
														<FaExclamationCircle className="w-5 h-5 text-secondary-red-300" />
														<p className="text-secondary-red-300 text-base font-medium">
															{errors[`field_${field.id}`]?.message}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							))}

							<div className="pt-8 border-t border-gray-scale-100">
								<div className="flex flex-col md:flex-row gap-4">
									<button
										type="button"
										onClick={() => window.history.back()}
										className="flex-1 px-8 py-4 border-2 border-gray-scale-200 text-black-300 rounded-xl hover:bg-primary-green-500 hover:text-white transition-all duration-200 transform hover:-translate-y-1 font-semibold text-lg cursor-pointer"
									>
										취소
									</button>
									<button
										type="submit"
										disabled={postMutation.isPending}
										className="flex-1 px-8 py-4 bg-primary-green-500 text-white rounded-xl hover:bg-primary-green-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
									>
										{postMutation.isPending ? (
											<div className="flex flex-row items-center gap-2">
												<Loading width={20} height={20} />
												<span>강의 요청 중...</span>
											</div>
										) : (
											"🚀 강의 요청하기"
										)}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CourseRequestPage;
