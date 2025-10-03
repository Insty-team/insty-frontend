"use client";

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

interface AIRecommendationSectionProps {
	/** 러너 요청 데이터 */
	request: LearnerRequest;
	/** 필드 키를 라벨로 변환하는 함수 */
	getFieldLabel: (fieldKey: string) => string;
	/** 커스텀 클래스명 */
	className?: string;
}

const AIRecommendationSection = ({
	request,
	getFieldLabel,
	className = "",
}: AIRecommendationSectionProps) => {
	return (
		<div className={`space-y-6 ${className}`}>
			<h3 className="text-lg font-semibold text-black-300 flex items-center">
				<span className="w-2 h-2 bg-primary-green-500 rounded-full mr-3"></span>
				AI 강의 준비 도우미
			</h3>

			{/* 요청 정보 요약 */}
			<div className="bg-primary-green-50 p-4 rounded-lg border-l-4 border-primary-green-400">
				<h4 className="font-medium text-primary-green-800 mb-2">
					📝 요청 정보 요약
				</h4>
				<div className="text-primary-green-700 text-sm leading-relaxed space-y-2">
					<div>
						<strong>주제:</strong> {request.title}
					</div>
					<div>
						<strong>설명:</strong> {request.description}
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
						{request.selected_fields.map((field, index) => (
							<div key={index} className="bg-primary-green-100 p-2 rounded">
								<div className="font-medium text-primary-green-800">
									{getFieldLabel(field.field_key)}
								</div>
								<div className="text-primary-green-700 text-xs mt-1">
									{field.answer_text}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* AI 추천 이유 */}
			<div className="p-4 rounded-lg border-l-4 border-primary-blue-400">
				<h4 className="font-medium text-primary-blue-700 mb-2">
					🤖 AI 추천 이유
				</h4>
				<p className="text-primary-blue-600 text-sm leading-relaxed">
					{request.reason}
				</p>
			</div>

			{/* 영상 구성 추천 */}
			<div className="p-4 rounded-lg border-l-4 border-primary-blue-400">
				<h4 className="font-medium text-primary-blue-700 mb-3">
					🎬 AI 영상 구성 추천
				</h4>
				<div className="space-y-2 text-sm text-primary-blue-600">
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
			<div className="p-4 rounded-lg border-l-4 border-orange">
				<h4 className="font-medium text-black-400 mb-3">📜 스크립트 초안</h4>
				<div className="text-sm text-black-300 space-y-2">
					<p>
						<strong>인트로:</strong> 안녕하세요! 오늘은 {request.title}에 대해
						알아보겠습니다. 이 강의를 통해...
					</p>
					<p>
						<strong>본문:</strong> 먼저 기본 개념부터 차근차근 설명드리고, 실제
						코드로 구현해보면서...
					</p>
					<p>
						<strong>마무리:</strong> 지금까지 배운 내용을 정리하면... 궁금한
						점이 있으시면 댓글로 문의해주세요!
					</p>
				</div>
			</div>

			{/* 참고 자료 링크 */}
			<div className="p-4 rounded-lg border-l-4 border-orange">
				<h4 className="font-medium text-black-400 mb-3">
					🔗 AI 추천 참고 자료
				</h4>
				<div className="space-y-2 text-sm">
					<a href="#" className="text-primary-blue-500 hover:underline block">
						📚 공식 문서: 관련 기술 가이드
					</a>
					<a href="#" className="text-primary-blue-500 hover:underline block">
						📖 튜토리얼: 단계별 구현 가이드
					</a>
					<a href="#" className="text-primary-blue-500 hover:underline block">
						💬 Stack Overflow: 자주 묻는 질문
					</a>
					<a href="#" className="text-primary-blue-500 hover:underline block">
						🎥 참고 영상: 비슷한 주제 강의
					</a>
				</div>
			</div>
		</div>
	);
};

export default AIRecommendationSection;
export type { LearnerRequest, SelectedField };
