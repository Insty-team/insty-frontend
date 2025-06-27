import { FaMessage } from "react-icons/fa6";

// 임시 주석
// type CommunityQuestionProps = {
// 	thumbnail: string;
// 	title: string;
// 	content: string;
// 	hasReply: boolean;
// };

function CommunityQuestion() {
  return (
    <div className="flex flex-col border-b-1 border-gray-200 gap-4">
      <span className="font-medium">
        M1 맥북에서 Python 환경 설정이 잘 안돼요. 어떻게 해야되나요?M1 맥북에서
        Python 환경 설정이 잘 안돼요. 어떻게 해야되나요?
      </span>
      <p className="font-medium mb-4 text-gray-500">
        M1 맥북에서 Python 환경 설정이 잘 안돼요. 어떻게 해야되나요?M1 맥북에서
        Python 환경 설정이 잘 안돼요. 어떻게 해야되나요? M1 맥북에서 Python 환경
        설정이 잘 안돼요. 어떻게 해야되나요?M1 맥북에서 Python 환경 설정이 잘
        안돼요. 어떻게 해야되나요?
      </p>
      <div className="flex mb-10 items-center gap-2">
        <FaMessage />
        <span>답변 달림 or 답변 대기 중</span>
      </div>
    </div>
  );
}

export default CommunityQuestion;
