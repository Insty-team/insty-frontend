"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoTrash } from "react-icons/io5";
import Swal from "sweetalert2";

import { BaseButton, Pagination } from "@/app/_components/common";
import Loading from "@/app/_components/common/Loading";
import { deleteCourseRequest } from "@/app/api/ai/community";
import { queryClient, useGetMyCourseRequestsQuery } from "@/app/queries";
import type {
	ApiCourseRequestItem,
	CourseRequestItem,
} from "@/app/types/community";

function MyPageCourseRequest() {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // 페이지당 5개 항목
	const [isDeleting, setIsDeleting] = useState(false);

	const {
		data: myCourseRequest,
		isLoading,
		error,
	} = useGetMyCourseRequestsQuery();

	const transformApiData = (
		apiData: ApiCourseRequestItem[],
	): CourseRequestItem[] => {
		const sortedData = apiData.sort((a, b) => {
			return (
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			);
		});

		return sortedData.map((item) => ({
			requestId: item.request_id,
			title: item.title,
			description: item.description,
			status: mapApiStatusToDisplayStatus(item.requests_status),
			requestDate: formatDate(item.created_at),
		}));
	};

	const mapApiStatusToDisplayStatus = (apiStatus: string): string => {
		switch (apiStatus.toLowerCase()) {
			case "pending":
			case "대기":
				return "대기";
			case "in_progress":
			case "제작중":
				return "제작중";
			case "completed":
			case "registered":
			case "강의등록됨":
				return "완료";
			default:
				return "대기";
		}
	};

	console.log(myCourseRequest);

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getStatusStyle = (status: string) => {
		switch (status) {
			case "대기":
				return "bg-gray-scale-100 text-gray-scale-400 border-gray-scale-200";
			case "제작중":
				return "bg-gray-scale-100 text-gray-scale-500 border-gray-scale-200";
			case "강의등록됨":
				return "bg-primary-green text-primary-green border-primary-green";
			default:
				return "bg-gray-scale-100 text-gray-scale-400 border-gray-scale-200";
		}
	};

	const handleCreateRequest = () => {
		router.push("/learner/mypage/course-request");
	};

	const courseRequests = myCourseRequest?.success
		? transformApiData(myCourseRequest.data)
		: [];

	// 페이지네이션 계산
	const totalItems = courseRequests.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentItems = courseRequests.slice(startIndex, endIndex);

	// 페이지 변경 핸들러
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleDeleteRequest = (requestId: number) => {
		Swal.fire({
			title: "정말 강의 요청을 삭제하시겠어요?",
			text: "삭제된 요청은 복구할 수 없습니다.",
			icon: "warning",
			confirmButtonText: "삭제",
			showCancelButton: true,
			confirmButtonColor: "#6ead79",
			cancelButtonText: "취소",
			cancelButtonColor: "#ff4f64",
		}).then(async (result) => {
			if (result.isConfirmed) {
				setIsDeleting(true);
				try {
					const res = await deleteCourseRequest(requestId);
					if (res.success) {
						Swal.fire({
							title: "강의 요청이 삭제되었습니다.",
							icon: "success",
							confirmButtonText: "확인",
						}).then(() => {
							queryClient.invalidateQueries({
								queryKey: ["myCourseRequests"],
							});
						});
					} else {
						Swal.fire({
							title: "강의 요청 삭제에 실패했습니다.",
							text: `${res.error.message}`,
							icon: "error",
						});
					}
				} catch (error) {
					console.error(error);
				} finally {
					setIsDeleting(false);
					router.refresh();
				}
			}
		});
	};

	if (isLoading) {
		return (
			<div className="flex flex-row w-full gap-16 items-center justify-center">
				<p>데이터를 불러오고 있습니다...</p>
				<Loading width={100} height={100} />
			</div>
		);
	}

	// 에러 상태
	if (error) {
		return (
			<div className="flex flex-col w-full gap-16">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-semibold">내 강의 요청</h2>
					<BaseButton
						title="+ 강의 요청하기"
						onClick={handleCreateRequest}
						className="!w-[20%]"
					/>
				</div>
				<div className="text-center mt-12">
					<Image src="/insty.png" alt="empty" width={100} height={100} />
					<p className="text-secondary-red-300 mt-6">
						데이터를 불러오는 중 오류가 발생했습니다.
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			{courseRequests.length > 0 && (
				<div className="flex flex-col w-full gap-16">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-semibold">내 강의 요청</h2>
						<BaseButton
							title="+ 강의 요청하기"
							onClick={handleCreateRequest}
							className="!w-[20%]"
						/>
					</div>
					<div className="space-y-4">
						{isDeleting && (
							<div className="fixed inset-0 w-full h-full bg-black-100/50 backdrop-blur-sm z-[1000] flex flex-col justify-center items-center">
								<div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 min-w-[300px] animate-fade-in">
									<div className="flex flex-col items-center gap-4">
										<Loading width={50} height={50} />
										<p className="text-black-300 text-xl font-semibold text-center">
											강의를 삭제 중입니다
										</p>
										<p className="text-gray-scale-400 text-sm text-center">
											잠시만 기다려주세요...
										</p>
									</div>
								</div>
							</div>
						)}
						{currentItems.map((item) => (
							<div
								key={item.requestId}
								className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
							>
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-lg font-medium text-gray-900 flex-1 pr-4">
										{item.title}
									</h3>
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(
											item.status,
										)}`}
									>
										{item.status}
									</span>
								</div>

								{item.description && (
									<p className="text-gray-600 mb-3 text-sm leading-relaxed">
										{item.description}
									</p>
								)}

								<div className="flex justify-between items-center text-sm text-gray-500">
									<span>요청일: {item.requestDate}</span>
									<button
										className="text-secondary-red-300 cursor-pointer text-sm flex flex-row items-center gap-1 hover:bg-secondary-red-300 hover:text-white rounded-lg p-2"
										onClick={() => handleDeleteRequest(item.requestId)}
									>
										<p>요청 삭제</p> <IoTrash />
									</button>
								</div>
							</div>
						))}
					</div>

					{/* 페이지네이션 - 5개 이상일 때만 표시 */}
					{totalItems > itemsPerPage && (
						<div className="flex justify-center mt-8">
							<Pagination
								pagination={{
									totalItems: totalItems,
									totalPages: totalPages,
									currentPage: currentPage,
									perPage: itemsPerPage,
								}}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</div>
			)}

			{/* 강의 요청 리스트가 비어있을 때 */}
			{courseRequests.length === 0 && (
				<div className="flex flex-col w-full gap-16 items-center justify-center">
					<div className="flex flex-col items-center text-center mt-12">
						<Image src="/insty.png" alt="empty" width={100} height={100} />
						<div className="mt-6">
							<p className="text-primary-green-500 mb-4 text-2xl font-semibold">
								아직 요청한 강의가 없습니다.
							</p>
							<p className="text-black-300 text-lg">
								&quot;강의 요청하기&quot; 버튼을 클릭해서 새로운 강의를
								요청해보세요!
							</p>
						</div>
						<BaseButton
							title="+ 강의 요청하기"
							onClick={handleCreateRequest}
							className="mt-6"
						/>
					</div>
				</div>
			)}
		</>
	);
}

export default MyPageCourseRequest;
