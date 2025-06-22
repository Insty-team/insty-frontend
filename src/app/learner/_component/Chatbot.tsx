import Image from "next/image";
import Link from "next/link";

function Chatbot({ changeDirectSearch }: { changeDirectSearch: () => void }) {
  const messages = [
    { type: "bot", text: "어떤 도움이 필요하세요?" },
    { type: "user", text: "Windows 11에서 파이썬 설치 관련된 데이터 분석" },
    {
      type: "bot",
      text: "알겠습니다! 말씀해주신 목적에 맞는 영상 3가지를 추천해드릴게요.",
    },
  ];

  const recommendations = [
    "설치가이드 주제 설치가이드 주제 설치가이드 주제 설치가이드",
    "설치가이드 주제 설치가이드 주제 설치가이드 주제 설치가이드",
    "설치가이드 주제 설치가이드 주제 설치가이드 주제 설치가이드",
  ];

  return (
    <div className="min-h-[90dvh] flex items-center justify-center bg-[#EFEFEF]">
      <div className="w-full h-[90dvh] rounded-2xl shadow-lg bg-[#EFEFEF] flex flex-col overflow-hidden border border-gray-scale-200">
        <div className="px-6 py-4 flex items-center border-b border-gray-scale-200">
          <div className="w-[160px] h-[160px] bg-white rounded-full flex items-center justify-center mr-3">
            <Image
              src="/insty.png"
              alt="INSTY"
              width={145}
              height={145}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col ml-8">
            <div className="font-bold text-[49px]">INSTY</div>
            <div className="text-[36px] font-semibold">
              어떤 도움이 필요하세요?
            </div>
          </div>
          <button
            className="ml-auto bg-primary-green-500 text-white rounded-2xl px-4 py-2"
            onClick={changeDirectSearch}
          >
            직접 찾기
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end ${msg.type === "user" ? "flex-row-reverse" : "justify-start flex-row"}`}
            >
              <div
                className={`w-[60px] h-[60px] flex items-center justify-center overflow-hidden ${msg.type === "user" ? "ml-3" : "mr-3 rounded-full bg-white"}`}
              >
                <Image
                  src={msg.type === "user" ? "/profile.svg" : "/insty.png"}
                  alt={msg.type === "user" ? "user" : "insty"}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div
                className={`text-[#1a355b] rounded-2xl px-4 py-3 text-2xl max-w-[600px] shadow-sm border border-gray-scale-200
								${
                  msg.type === "user"
                    ? "bg-blue-100 rounded-tl-2xl rounded-tr-md"
                    : "bg-white rounded-tr-2xl rounded-tl-md"
                }
							`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div className="flex gap-3 mt-auto overflow-x-auto">
            {recommendations.map((rec, idx) => (
              <Link
                key={idx}
                href={`/learner/recommend/course/${idx}`}
                className="flex flex-col max-w-[400px] bg-white rounded-xl shadow p-4 text-lg text-black-100 border border-gray-scale-100 flex-shrink-0 mb-2 cursor-pointer"
              >
                <div className="w-full h-[200px] bg-gray-scale-100 rounded-xl mb-4"></div>
                <span className="line-clamp-1">{rec}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#e0e7ef] bg-[#f4f8fc] flex items-center gap-2">
          <Image src="/profile.svg" alt="profile" width={50} height={50} />
          <input
            type="text"
            placeholder="입력해주세요 ..."
            className="flex-1 rounded-xl px-4 py-2.5 text-[15px] bg-white outline-none shadow-sm border-none"
          />
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
