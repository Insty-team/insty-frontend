"use client";

import { useState } from "react";

import Modal from "@/app/_components/common/Modal";

//import { FaSearch } from "react-icons/fa";

const DUMMY_REQUESTS = [
	{
		id: 0,
		title: "M1 Mac에서 개발 환경 완벽 구축하기",
		content:
			"M1 Mac 환경에서 개발 환경을 완벽하게 구축하는 방법에 대한 강의를 요청드립니다. 특히 가상환경 설정과 관련된 내용이 궁금합니다.",
	},
	{
		id: 1,
		title: "React 18 Suspense와 Concurrent Features 심화",
		content:
			"React 18의 새로운 기능들, 특히 Suspense와 Concurrent Features에 대한 실무 중심의 강의를 요청합니다.",
	},
	{
		id: 2,
		title: "Next.js App Router 완전 정복",
		content:
			"Next.js 13+ App Router의 모든 기능과 최적화 방법에 대한 상세한 강의를 요청드립니다.",
	},
	{
		id: 3,
		title: "AWS 서버리스 아키텍처 구축하기",
		content:
			"AWS Lambda, API Gateway, DynamoDB를 활용한 완전한 서버리스 애플리케이션 구축 방법을 알려주세요.",
	},
	{
		id: 4,
		title:
			"AWS 서버리스 아키텍처 구축하기 길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기길어지기",
		content:
			"AWS Lambda, API Gateway, DynamoDB를 활용한 완전한 서버리스 애플리케이션 구축 방법을 알려주세요.",
	},
];

interface LearnerRequest {
	id: number;
	title: string;
	content: string;
}

function LearnerRequest() {
	//const [searchTerm, setSearchTerm] = useState("");
	// const [requestList, setRequestList] = useState<LearnerRequest[]>([]);

	// useEffect(() => {
	// 	const fetchRequestList = async () => {
	// 		const res = await getLearnerRequestList();
	// 		setRequestList(res.data);
	// 	};
	// 	fetchRequestList();
	// }, []);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState<LearnerRequest | null>(
		null,
	);
	const [checklist, setChecklist] = useState({
		scriptPrepared: false,
		videoPrepared: false,
		materialsReady: false,
	});

	return (
		<div className="mx-auto p-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold text-black-300 mt-8">
					러너 요청 리스트
				</h1>
				<p className="text-gray-500 ml-2">
					러너들이 요청한 강의 주제를 확인해보세요.
				</p>
			</div>

			{/* 검색 기능, 필요시 사용 */}
			{/* <div className="flex gap-4">
				<div className="flex-1 relative">
					<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
					<input
						type="text"
						placeholder="제목 또는 내용으로 검색..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green-500 focus:border-transparent transition-all"
					/>
				</div>
			</div> */}

			<div className="grid grid-cols-2 gap-6 mt-12">
				{DUMMY_REQUESTS.map((request) => (
					<div
						key={request.id}
						className="bg-white rounded-lg shadow-sm border hover:shadow-lg hover:-translate-y-2 transition-all duration-200 p-6 flex flex-col"
					>
						<div className="flex flex-col h-full space-y-3">
							<h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mx-auto text-center">
								{request.title}
							</h3>

							<p className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-1 mx-auto text-center">
								{request.content}
							</p>

							<button
								className="w-[90%] mx-auto px-4 py-2 cursor-pointer bg-primary-green-500 text-white rounded-lg hover:bg-primary-green-600 transition-colors text-sm font-medium mt-auto"
								onClick={() => {
									setSelectedRequest(request);
									setIsModalOpen(true);
								}}
							>
								이 주제 강의 업로드하기
							</button>
						</div>
					</div>
				))}
			</div>

			{isModalOpen && selectedRequest && (
				<Modal
					open={isModalOpen}
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
					actions={() => {}}
					isActionDisabled={!Object.values(checklist).every(Boolean)}
				>
					<>
						<div className="flex flex-col gap-6">
							{/* 제목 */}
							<div className="border-b pb-4">
								<h2 className="text-xl font-bold text-gray-900">
									{selectedRequest.title}
								</h2>
							</div>

							{/* AI 분석 및 추천 섹션 */}
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-gray-800 flex items-center">
									<span className="w-2 h-2 bg-primary-green-500 rounded-full mr-3"></span>
									AI 강의 준비 도우미
								</h3>

								{/* 요청 정보 요약 */}
								<div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
									<h4 className="font-medium text-green-900 mb-2">
										📝 요청 정보 요약
									</h4>
									<p className="text-green-800 text-sm leading-relaxed">
										<strong>주제:</strong> {selectedRequest.title}
										<br />
										<strong>목적:</strong>{" "}
										{selectedRequest.content.length > 100
											? `${selectedRequest.content.substring(0, 100)}...`
											: selectedRequest.content}
										<br />
										<strong>권장 난이도:</strong> 중급자 대상
										<br />
										<strong>예상 소요 시간:</strong> 15분 이내
									</p>
								</div>

								{/* 영상 구성 추천 */}
								<div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
									<h4 className="font-medium text-blue-900 mb-3">
										🎬 AI 영상 구성 추천
									</h4>
									<div className="space-y-2 text-sm text-blue-800">
										<div className="flex">
											<span className="font-medium w-20">1단계:</span>
											<span>개념 소개 및 필요성 설명 (3분)</span>
										</div>
										<div className="flex">
											<span className="font-medium w-20">2단계:</span>
											<span>실습 환경 구축 (3분)</span>
										</div>
										<div className="flex">
											<span className="font-medium w-20">3단계:</span>
											<span>핵심 기능 구현 (7분)</span>
										</div>
										<div className="flex">
											<span className="font-medium w-20">4단계:</span>
											<span>트러블슈팅 & 마무리 (2분)</span>
										</div>
									</div>
								</div>

								{/* 스크립트 초안 */}
								<div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
									<h4 className="font-medium text-purple-900 mb-3">
										📜 스크립트 초안
									</h4>
									<div className="text-sm text-purple-800 space-y-2">
										<p>
											<strong>인트로:</strong> 안녕하세요! 오늘은{" "}
											{selectedRequest.title}에 대해 알아보겠습니다. 이 강의를
											통해...
										</p>
										<p>
											<strong>본문:</strong> 먼저 기본 개념부터 차근차근
											설명드리고, 실제 코드로 구현해보면서...
										</p>
										<p>
											<strong>마무리:</strong> 지금까지 배운 내용을 정리하면...
											궁금한 점이 있으시면 댓글로 문의해주세요!
										</p>
									</div>
								</div>

								{/* 참고 자료 링크 */}
								<div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
									<h4 className="font-medium text-yellow-900 mb-3">
										🔗 AI 추천 참고 자료
									</h4>
									<div className="space-y-2 text-sm">
										<a href="#" className="text-blue-600 hover:underline block">
											📚 공식 문서: 관련 기술 가이드
										</a>
										<a href="#" className="text-blue-600 hover:underline block">
											📖 튜토리얼: 단계별 구현 가이드
										</a>
										<a href="#" className="text-blue-600 hover:underline block">
											💬 Stack Overflow: 자주 묻는 질문
										</a>
										<a href="#" className="text-blue-600 hover:underline block">
											🎥 참고 영상: 비슷한 주제 강의
										</a>
									</div>
								</div>
							</div>

							{/* 영상 제작 체크리스트 */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-800 flex items-center">
									<span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
									영상 제작 체크리스트
								</h3>

								<div className="bg-gray-50 p-4 rounded-lg space-y-4">
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
											className="text-gray-700 font-medium"
										>
											스크립트 작성 완료
										</label>
									</div>
									<p className="ml-8 text-sm text-gray-600">
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
											className="text-gray-700 font-medium"
										>
											강의 영상 촬영 완료
										</label>
									</div>
									<p className="ml-8 text-sm text-gray-600">
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
											className="text-gray-700 font-medium"
										>
											실습 자료 준비 완료
										</label>
									</div>
									<p className="ml-8 text-sm text-gray-600">
										학습자가 다운로드할 수 있는 실습 파일이 준비되었습니다.
									</p>

									{Object.values(checklist).every(Boolean) && (
										<div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
											<p className="text-green-800 text-sm font-medium">
												✅ 모든 준비가 완료되었습니다! 이제 강의를 업로드할 수
												있습니다.
											</p>
										</div>
									)}
								</div>
							</div>

							{/* 요청 내용 */}
							<div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
								<h4 className="font-medium text-blue-900 mb-2">
									러너 요청 내용
								</h4>
								<p className="text-blue-800 leading-relaxed">
									{selectedRequest.content}
								</p>
							</div>
						</div>
					</>
				</Modal>
			)}
		</div>
	);
}

export default LearnerRequest;
