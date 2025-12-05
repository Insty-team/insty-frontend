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
		</div>
	);
};

export default AIRecommendationSection;
export type { LearnerRequest, SelectedField };
