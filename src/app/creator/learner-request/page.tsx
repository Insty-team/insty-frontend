"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaCheckSquare, FaExclamationCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import Swal from "sweetalert2";

import AIRecommendationSection from "@/app/_components/common/AIRecommendationSection";
import Loading from "@/app/_components/common/Loading";
import Modal from "@/app/_components/common/Modal";
import {
	getCheckCourseRequestAvailibility,
	getCourseRequestFinalResult,
	getCreatorRecommendationForm,
	getLastCreatorForm,
	patchRecommendationStatus,
	postCourseRequestWithoutBase,
} from "@/app/api/ai/community";
import { getMyCourses } from "@/app/api/backend";
import { useCourseRequestRecommendationsWithBaseQuery } from "@/app/queries/course-request";
import type { ApiFormField, FormField } from "@/app/types/community";

interface SelectedField {
	field_key: string;
	answer_text: string;
}

interface LearnerRequest {
	request_id: number;
	title: string;
	description: string;
	selected_fields: SelectedField[];
	reason: string;
}

interface FormData {
	[key: string]: string | string[];
}

interface CourseRequestResultTask {
	task: string;
	status: string;
	output: {
		summary_title?: string;
		summary_purpose?: string;
		summary_recommendation_level?: string;
		estimated_duration_minutes?: number;
		intro?: string;
		main?: string;
		outro?: string;
		call_to_action?: string;
		error?: string;
		item?: string;
		references?: {
			title: string;
			url: string;
			type?: string;
			description?: string;
		}[];
		// 기타 필드는 필요 시 확장
		[key: string]: unknown;
	};
}

interface CourseRequestFinalResult {
	request_id: number;
	package_status_id: number;
	results: CourseRequestResultTask[];
}

function LearnerRequest() {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState<LearnerRequest | null>(
		null,
	);
	const [requestList, setRequestList] = useState<LearnerRequest[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [checklist, setChecklist] = useState({
		scriptPrepared: false,
		videoPrepared: false,
		materialsReady: false,
	});
	const [showForm, setShowForm] = useState(false);
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [formFields, setFormFields] = useState<FormField[]>([]);
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [finalResult, setFinalResult] =
		useState<CourseRequestFinalResult | null>(null);
	const [isFinalResultLoading, setIsFinalResultLoading] = useState(false);
	const [finalResultError, setFinalResultError] = useState<string | null>(null);
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		defaultValues: {},
	});

	// 러너 요청 추천 리스트 (with-base) 캐시 쿼리
	const {
		data: cachedRecommendations = [],
		isFetching: isRecommendationsFetching,
		refetch: refetchRecommendations,
	} = useCourseRequestRecommendationsWithBaseQuery();

	// field_key를 한국어 라벨로 매핑하는 함수
	const getFieldLabel = (fieldKey: string): string => {
		const fieldLabels: Record<string, string> = {
			os_env: "운영체제",
			difficulty: "어려움을 느끼는 부분",
			software_name: "소프트웨어 이름",
			extra_question: "추가 질문",
		};
		return fieldLabels[fieldKey] || fieldKey;
	};

	// 업로드 페이지로 이동하는 함수
	const handleGoToUpload = async () => {
		if (!selectedRequest) return;

		await checkAvailibility(selectedRequest.request_id);
	};

	// API 데이터를 프론트엔드 형태로 변환하는 함수
	const transformFormFields = useCallback(
		(apiFields: ApiFormField[]): FormField[] => {
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
		},
		[],
	);

	const refreshRequest = async () => {
		await fetchRequestList();
	};

	const checkAvailibility = async (requestId: number) => {
		try {
			const res = await getCheckCourseRequestAvailibility(requestId);
			console.log(res);
			//업로드 가능시, 상태 업데이트
			if (
				(res.success && res.data.status === "IGNORED") ||
				res.data.status === "DECLINED"
			) {
				const requestData = {
					request: selectedRequest,
					timestamp: Date.now(), // 저장 시간 추가
				};

				localStorage.setItem(
					"selectedLearnerRequest",
					JSON.stringify(requestData),
				);

				await patchRecommendationStatus(requestId, "ACCEPTED");
				console.log("상태 업데이트 완료!!", requestId, "ACCEPTED");
				router.push("/creator/learner-request/upload");
			} else {
				Swal.fire({
					title: "업로드 불가",
					text: "이미 누군가가 해당 요청에 대한 강의를 작성중입니다.",
					icon: "error",
				}).then(async () => {
					setIsModalOpen(false);
					setSelectedRequest(null);
					setChecklist({
						scriptPrepared: false,
						videoPrepared: false,
						materialsReady: false,
					});
					refreshRequest();
				});
			}
		} catch (error) {
			console.error(error);
			Swal.fire({
				title: "추천 가능 여부 확인 오류!",
				text: "추천 가능 여부를 확인하는데 실패했습니다. 다시시도해주세요.",
				icon: "error",
			});
		}
	};

	// 폼 제출 핸들러
	const onFormSubmit = async (data: FormData) => {
		console.log("폼 제출 데이터:", data);

		// answers 배열 생성 (인덱스 기반으로 0부터 시작)
		const answers = formFields
			.map((field, index) => {
				const fieldKey = `field_${field.id}`;
				const fieldValue = data[fieldKey];

				// 0,1번: 선택형 필드 (answer_option_ids 사용)
				if (index === 0 || index === 1) {
					const answerOptionIds = Array.isArray(fieldValue)
						? fieldValue.map((id) => parseInt(id))
						: fieldValue
							? [parseInt(fieldValue as string)]
							: [];

					return {
						field_id: index,
						answer_option_ids: answerOptionIds,
					};
				}

				// 2,3번: 텍스트 필드 (answer_text 사용)
				else if (index === 2 || index === 3) {
					const answerText = fieldValue as string;

					// 값이 있는 경우만 추가 (빈 문자열은 제외)
					if (answerText && answerText.trim()) {
						return {
							field_id: index,
							answer_text: answerText.trim(),
						};
					}

					return null;
				}

				return null;
			})
			.filter((answer) => answer !== null); // null 값 제거

		const submitData = {
			answers: answers,
		};

		console.log("제출할 데이터:", submitData);

		try {
			setIsLoading(true);
			const response = await postCourseRequestWithoutBase(submitData);

			if (response.success && response.data.recommendations) {
				setRequestList(response.data.recommendations);
				setFormSubmitted(true);
				setShowForm(false);
				Swal.fire({
					title: "추천 완료!",
					icon: "success",
				});
			}
		} catch (error) {
			console.error(error);
			Swal.fire({
				title: "AI 추천 오류!",
				text: "AI 추천에 실패했습니다. 다시시도해주세요.",
				icon: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// 추천 리스트 조회 (초기 진입 / 갱신 공용)
	// - 최초 진입(캐시 없음) 또는 명시적 갱신 시에만 호출
	const fetchRequestList = useCallback(async () => {
		try {
			setIsLoading(true);
			const courseData = await getMyCourses(1, 10);

			//이미 내가 올린 강의가 있다면?
			if (courseData.items.length > 0) {
				try {
					const { data } = await refetchRecommendations();

					if (data && Array.isArray(data)) {
						setRequestList(data as LearnerRequest[]);
						setFormSubmitted(true);
					}
				} catch (error) {
					console.error(error);
					Swal.fire({
						title: "AI 추천 오류!",
						text: "AI 추천에 실패했습니다. 다시시도해주세요.",
						icon: "error",
					});
				}
			} else {
				// 올린 강의가 없다면 폼을 먼저 보여주기
				try {
					const lastFormResponse = await getLastCreatorForm();
					console.log(lastFormResponse);
					//이미 작성한 폼이 존재하면
					if (lastFormResponse.data.exists && lastFormResponse.data.form) {
						const submitData = {
							answers: lastFormResponse.data.form.answers,
						};
						const response = await postCourseRequestWithoutBase(submitData);
						if (response.success && response.data.recommendations) {
							setRequestList(response.data.recommendations);
							setFormSubmitted(true);
						}
					} else {
						setIsFormLoading(true);
						const formResponse = await getCreatorRecommendationForm();
						if (formResponse.success && formResponse.data.form) {
							const transformedFields = transformFormFields(
								formResponse.data.form,
							);
							// order_no로 정렬
							transformedFields.sort((a, b) => a.orderNo - b.orderNo);
							setFormFields(transformedFields);

							// 동적 폼 필드들의 기본값 설정
							const defaultValues: FormData = {};
							transformedFields.forEach((field) => {
								const fieldName = `field_${field.id}`;
								if (field.type === "checkbox") {
									defaultValues[fieldName] = [];
								} else {
									defaultValues[fieldName] = "";
								}
							});

							reset(defaultValues);

							setShowForm(true);
						}
					}
				} catch (error) {
					console.error("폼 데이터 로딩 실패:", error);
					Swal.fire({
						title: "폼 로딩 오류!",
						text: "질문 폼을 불러오는데 실패했습니다. 다시시도해주세요.",
						icon: "error",
					});
				} finally {
					setIsFormLoading(false);
				}
			}
		} catch (error) {
			console.error(error);
			Swal.fire({
				title: "강의 불러오기 오류!",
				text: "추천을 위해 내 강의목록을 조회하는데 실패했습니다. 다시시도해주세요.",
				icon: "error",
			});
		} finally {
			setIsLoading(false);
		}
	}, [refetchRecommendations, reset, transformFormFields]);

	useEffect(() => {
		// 캐시된 추천 리스트가 이미 있다면, 캐시 데이터만 보여줌 (갱신 X)
		const hasCachedRecommendations =
			Array.isArray(cachedRecommendations) && cachedRecommendations.length > 0;

		if (hasCachedRecommendations) {
			// 캐시 데이터만 보여줌
			setRequestList(cachedRecommendations as LearnerRequest[]);
			setFormSubmitted(true);
			setIsLoading(false);
		} else {
			// 캐시가 없을 때만 서버에 요청
			fetchRequestList();
		}
	}, [cachedRecommendations, fetchRequestList]);

	useEffect(() => {
		if (!selectedRequest) {
			setFinalResult(null);
			setFinalResultError(null);
			return;
		}

		const fetchFinalResult = async () => {
			try {
				setIsFinalResultLoading(true);
				const res = await getCourseRequestFinalResult(
					selectedRequest.request_id,
				);

				// //테스팅 용임 나중에 삭제@@
				// const re2 = await getCheckCourseRequestAvailibility(
				// 	selectedRequest.request_id,
				// );

				// if (re2.success && re2.data) {
				// 	console.log(re2.data);
				// } else {
				// 	console.log(re2.message);
				// }

				if (res.success && res.data) {
					setFinalResult(res.data as CourseRequestFinalResult);
					setFinalResultError(null);
				} else {
					setFinalResult(null);
					setFinalResultError(
						res?.message ||
							"AI 강의 설계 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
					);
				}
			} catch (error) {
				console.error(error);
				setFinalResult(null);
				setFinalResultError(
					"AI 강의 설계 결과를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
				);
			} finally {
				setIsFinalResultLoading(false);
			}
		};

		void fetchFinalResult();
	}, [selectedRequest]);

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

			case "radio":
				return (
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
				);

			case "checkbox":
				return (
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
										const isChecked = currentValues.includes(String(option.id));

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
				);

			default:
				return null;
		}
	};

	// 폼을 보여줘야 하는 경우 (올린 강의가 없고 아직 폼을 제출하지 않은 경우)
	if (showForm) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-scale-50 to-white">
				<div className="max-w-4xl mx-auto px-6 py-12">
					<div className="text-center mb-12">
						<h1 className="text-5xl font-bold text-black-300 mb-4">
							추천 받기 위한 정보 입력
						</h1>
						<p className="text-xl text-black-300 max-w-2xl mx-auto leading-relaxed">
							아직 강의를 올린 적이 없으시네요.
							<br />
							더 정확한 추천을 위해 본인의 전문 분야와 환경 정보를 입력해주세요.
							<br />
							입력하신 정보를 바탕으로 맞춤형 강의 주제를 추천해드립니다.
						</p>
					</div>

					{isFormLoading ? (
						<div className="text-center py-12">
							<p className="text-black-300 text-lg">폼을 불러오는 중...</p>
							<Loading width={40} height={40} />
						</div>
					) : (
						<div className="bg-white rounded-2xl shadow-xl border border-gray-scale-100 overflow-hidden">
							<div className="p-8 md:p-12">
								<form
									onSubmit={handleSubmit(onFormSubmit)}
									className="space-y-8"
								>
									{/* API로 받은 동적 폼 필드들만 사용 */}
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
														{/*index === 0
															? "어떤 운영체제/환경을 주로 사용하시나요?"
															: index === 1
																? "어떤 부분을 주로 알려주고 싶으신가요?"
																: index === 2
																	? "주로 알려주고자 하는 프로그램, 소프트웨어 등의 이름을 적어주세요."
																	: "추가로 추천받고 싶은 강의들이 있다면, 정보를 적어주세요."}*/}
														{field.isRequired && (
															<span className="text-secondary-red-300 ml-2 text-xl">
																*
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
												type="submit"
												disabled={isLoading}
												className="flex-1 px-8 py-4 bg-primary-green-500 text-white rounded-xl hover:bg-primary-green-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{isLoading
													? "추천 받는 중..."
													: "🚀 강의 주제 추천 받기"}
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto p-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold text-black-300 mt-8">
					러너 요청 리스트
				</h1>
				<p className="text-gray-scale-400 ml-2">
					러너들이 요청한 강의 주제를 확인해보세요.
				</p>
			</div>

			{/* 리스트 갱신 버튼 */}
			<div className="flex justify-end mt-4">
				<button
					type="button"
					onClick={() => {
						// 명시적 "추천 목록 갱신" 버튼 → 항상 서버에서 최신 목록 요청
						fetchRequestList();
					}}
					disabled={isRecommendationsFetching}
					className="text-sm text-primary-green-600 hover:text-primary-green-700 underline cursor-pointer disabled:opacity-50"
				>
					{isRecommendationsFetching
						? "추천 목록 갱신 중..."
						: "추천 목록 갱신하기"}
				</button>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center py-20">
					<p className="text-2xl text-primary-green-500">
						추천 목록을 불러오는 중 입니다...
					</p>
					<Loading />
				</div>
			) : requestList.length === 0 && formSubmitted ? (
				<div className="text-center py-20">
					<p className="text-gray-scale-400 text-lg">
						현재 추천된 요청이 없습니다.
					</p>
					<p className="text-gray-scale-300 text-sm mt-2">
						나중에 다시 확인해보세요.
					</p>
				</div>
			) : (
				<div className="grid gap-6 mt-8">
					{requestList.map((request) => (
						<div
							key={request.request_id}
							className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
							onClick={() => {
								setSelectedRequest(request);
								setIsModalOpen(true);
							}}
						>
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-lg font-semibold text-black-300">
									{request.title}
								</h3>
							</div>

							<p className="text-gray-scale-400 mb-4 line-clamp-2">
								{request.description}
							</p>

							<div className="bg-primary-green-50 p-3 rounded-lg mb-4">
								<p className="text-sm text-primary-green-800">
									<strong>AI 추천 이유:</strong> {request.reason}
								</p>
							</div>

							<div className="space-y-3">
								<h4 className="text-sm font-medium text-black-300 mb-2">
									📋 러너 요청 정보
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
									{request.selected_fields.map((field, index) => (
										<div
											key={index}
											className="bg-primary-green-50 p-2 rounded border-l-2 border-primary-green-300"
										>
											<span className="font-medium text-primary-green-700">
												{getFieldLabel(field.field_key)}:
											</span>
											<br />
											<span className="text-black-300">
												{field.answer_text}
											</span>
										</div>
									))}
								</div>
							</div>

							<div className="mt-4 flex justify-end">
								<button className="text-primary-green-600 hover:text-primary-green-700 font-medium text-sm cursor-pointer">
									자세히 보기 →
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<Modal
				open={isModalOpen && selectedRequest !== null}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedRequest(null);
					setChecklist({
						scriptPrepared: false,
						videoPrepared: false,
						materialsReady: false,
					});
				}}
				title="강의 요청 사항 확인"
				onCloseTitle="닫기"
				actionsTitle="강의 업로드 하러가기"
				actions={handleGoToUpload}
				isActionDisabled={!Object.values(checklist).every(Boolean)}
			>
				{selectedRequest && (
					<>
						<div className="flex flex-col gap-6">
							{/* 제목 */}
							<div className="border-b pb-4">
								<h2 className="text-xl font-bold text-black-300">
									{selectedRequest.title}
								</h2>
								<p className="text-gray-scale-400 mt-2">
									{selectedRequest.description}
								</p>
							</div>

							{/* AI 분석 및 추천 섹션 */}
							<AIRecommendationSection
								request={selectedRequest}
								getFieldLabel={getFieldLabel}
							/>

							{/* AI 최종 결과 섹션 */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-black-300 flex items-center">
									<span className="w-2 h-2 bg-primary-green-500 rounded-full mr-3"></span>
									AI 생성 강의 설계 결과
								</h3>

								{isFinalResultLoading && (
									<div className="flex items-center gap-2 text-sm text-gray-scale-400">
										<Loading width={24} height={24} />
										<span>강의 설계 결과를 불러오는 중입니다...</span>
									</div>
								)}

								{!isFinalResultLoading && finalResultError && !finalResult && (
									<div className="bg-secondary-red-100 border border-secondary-red-300 rounded-lg p-3 text-md text-white">
										❌ {finalResultError}
									</div>
								)}

								{!isFinalResultLoading && finalResult && (
									<div className="space-y-4">
										{/* summary */}
										{finalResult.results
											.filter(
												(r) =>
													r.task === "summary" &&
													r.status === "COMPLETED" &&
													r.output,
											)
											.map((r) => (
												<div
													key={r.task}
													className="bg-primary-green-50 border border-primary-green-200 rounded-lg p-4"
												>
													<p className="text-sm text-gray-scale-400 mb-1">
														요약
													</p>
													<p className="text-xl font-bold text-black-300 mb-1">
														{r.output.summary_title}
													</p>
													<p className="text-sm text-gray-scale-500 mb-2">
														{r.output.summary_purpose}
													</p>
													<div className="flex flex-wrap gap-2 text-xs text-gray-scale-500">
														<span className="px-2 py-1 rounded-full bg-white border border-primary-green-200">
															난이도: {r.output.summary_recommendation_level}
														</span>
														<span className="px-2 py-1 rounded-full bg-white border border-primary-green-200">
															예상 소요 시간:{" "}
															{r.output.estimated_duration_minutes}분
														</span>
													</div>
												</div>
											))}

										{/* script */}
										{finalResult.results
											.filter(
												(r) =>
													r.task === "script" &&
													r.status === "COMPLETED" &&
													r.output,
											)
											.map((r) => (
												<div
													key={r.task}
													className="bg-white border border-gray-scale-100 rounded-lg p-4 space-y-3"
												>
													<p className="text-sm font-semibold text-black-300">
														강의 스크립트
													</p>
													<div className="space-y-2 text-sm text-gray-scale-500 max-h-72 overflow-y-auto">
														<div>
															<p className="font-semibold text-black-300">
																인트로
															</p>
															<p>{r.output.intro}</p>
														</div>
														<div>
															<p className="font-semibold text-black-300">
																본론
															</p>
															<p>{r.output.main}</p>
														</div>
														<div>
															<p className="font-semibold text-black-300">
																마무리
															</p>
															<p>{r.output.outro}</p>
														</div>
														<div>
															<p className="font-semibold text-black-300">
																실행 요청
															</p>
															<p>{r.output.call_to_action}</p>
														</div>
													</div>
												</div>
											))}

										{/* section_plan - 에러 메시지 등 */}
										{finalResult.results
											.filter((r) => r.task === "section_plan")
											.map((r) => (
												<div
													key={r.task}
													className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800"
												>
													<p className="font-semibold mb-1">섹션별 강의 계획</p>
													{r.status === "COMPLETED" && r.output?.error && (
														<p>{r.output.error}</p>
													)}
												</div>
											))}

										{/* checklist */}
										{finalResult.results
											.filter(
												(r) =>
													r.task === "checklist" &&
													r.status === "COMPLETED" &&
													r.output,
											)
											.map((r) => (
												<div
													key={r.task}
													className="bg-primary-green-50 border border-primary-green-200 rounded-lg p-4 text-sm text-primary-green-900"
												>
													<p className="font-semibold mb-1">체크리스트</p>
													<p>{r.output.item}</p>
												</div>
											))}

										{/* references */}
										{finalResult.results
											.filter(
												(r) =>
													r.task === "references" &&
													r.status === "COMPLETED" &&
													Array.isArray(r.output.references) &&
													r.output.references.length > 0,
											)
											.map((r) => (
												<div
													key={r.task}
													className="bg-gray-scale-50 border border-gray-scale-200 rounded-lg p-4 text-sm"
												>
													<p className="font-semibold text-black-300 mb-2">
														참고 자료
													</p>
													<ul className="space-y-2">
														{(r.output.references ?? []).map(
															(ref: {
																title: string;
																url: string;
																description?: string;
															}) => (
																<li key={ref.url}>
																	<a
																		href={ref.url}
																		target="_blank"
																		rel="noreferrer"
																		className="text-primary-green-600 hover:text-primary-green-700 underline"
																	>
																		{ref.title}
																	</a>
																	{ref.description && (
																		<p className="text-xs text-gray-scale-500">
																			{ref.description}
																		</p>
																	)}
																</li>
															),
														)}
													</ul>
												</div>
											))}
									</div>
								)}

								{/* 영상 제작 체크리스트 */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-black-300 flex items-center">
										<span className="w-2 h-2 bg-orange rounded-full mr-3"></span>
										영상 제작 체크리스트
									</h3>

									<div className="bg-gray-scale-50 p-4 rounded-lg space-y-4">
										<div className="flex items-center space-x-3">
											<input
												type="checkbox"
												id="scriptPrepared"
												checked={checklist.scriptPrepared}
												onChange={(e) =>
													setChecklist((prev) => ({
														...prev,
														scriptPrepared: e.target.checked,
													}))
												}
												className="w-5 h-5 text-primary-green-500 rounded focus:ring-primary-green-500"
											/>
											<label
												htmlFor="scriptPrepared"
												className="text-black-300 font-medium"
											>
												스크립트 작성 완료
											</label>
										</div>
										<p className="ml-8 text-sm text-gray-scale-400">
											강의 내용과 설명 스크립트가 준비되었습니다.
										</p>

										<div className="flex items-center space-x-3">
											<input
												type="checkbox"
												id="videoPrepared"
												checked={checklist.videoPrepared}
												onChange={(e) =>
													setChecklist((prev) => ({
														...prev,
														videoPrepared: e.target.checked,
													}))
												}
												className="w-5 h-5 text-primary-green-500 rounded focus:ring-primary-green-500"
											/>
											<label
												htmlFor="videoPrepared"
												className="text-black-300 font-medium"
											>
												강의 영상 촬영 완료
											</label>
										</div>
										<p className="ml-8 text-sm text-gray-scale-400">
											강의 영상이 준비되었습니다.
										</p>

										<div className="flex items-center space-x-3">
											<input
												type="checkbox"
												id="materialsReady"
												checked={checklist.materialsReady}
												onChange={(e) =>
													setChecklist((prev) => ({
														...prev,
														materialsReady: e.target.checked,
													}))
												}
												className="w-5 h-5 text-primary-green-500 rounded focus:ring-primary-green-500"
											/>
											<label
												htmlFor="materialsReady"
												className="text-black-300 font-medium"
											>
												실습 자료 준비 완료
											</label>
										</div>
										<p className="ml-8 text-sm text-gray-scale-400">
											학습자가 다운로드할 수 있는 실습 파일이 준비되었습니다.
										</p>

										<div
											className={`mt-4 p-3 bg-primary-green-100 border border-primary-green-300 rounded-lg transition-opacity duration-200 ${Object.values(checklist).every(Boolean) ? "opacity-100" : "opacity-0 h-0 p-0 overflow-hidden"}`}
										>
											<p className="text-primary-green-800 text-sm font-medium">
												✅ 모든 준비가 완료되었습니다! 이제 강의를 업로드할 수
												있습니다.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</Modal>
		</div>
	);
}

export default LearnerRequest;
