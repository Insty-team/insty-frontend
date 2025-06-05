import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import Image from "next/image";

interface ChatbotModalProps {
  open: boolean;
}

const dummyMessages = [
  {
    type: "bot",
    text: "어떤 것을 도와드릴까요?\n질문에 대해 빠른 답변을 원하시면 저를 이용하실 수 있어요.",
  },
  {
    type: "user",
    text: "Windows 11에서 파이썬 설치",
  },
  {
    type: "bot",
    text: `라이브 설치가 어려우신가요?\n
괜찮아요, 제가 함께 해결해드릴게요.
아래와 같은 단계로 따라하시면 될거예요!
1. 설치가 시작되지 않아요.
2. 설치 후에도 파이썬이 보이지 않아요.
3. 설치는 했지만 실행이 되지 않아요.
등, 다른 경우도 상세하게 알려주시면 도와드릴 수 있어요!`,
  },
];

function ChatbotModal({ open } : ChatbotModalProps) {
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[2600] w-[40%] h-[80%] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-scale-100">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-scale-100 rounded-t-2xl bg-gray-scale-50">
        <div className="flex items-center gap-2">
          <Image src="/insty.png" alt="logo" width={64} height={64} />
          <div className="ml-2">
            <div className="font-bold text-3xl text-primary-green-700">INSTY</div>
            <div className="text-2xl text-primary-green-600">어떤 도움이 필요하세요?</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`whitespace-pre-line px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                msg.type === "user"
                  ? "bg-primary-green-200 text-black-300"
                  : "bg-white border border-gray-scale-200 text-black-300"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form
        className="flex items-center gap-2 px-4 py-3 border-t border-gray-scale-100 bg-white rounded-b-2xl"
        onSubmit={e => {
          e.preventDefault();
          if (!input.trim()) return;
          setMessages([...messages, { type: "user", text: input }]);
          setInput("");
        }}
      >
        <input
          className="flex-1 px-3 py-2 rounded-full border border-gray-scale-200 focus:outline-none focus:ring-2 focus:ring-primary-green-400 text-sm"
          placeholder="입력해주세요 ..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="text-primary-green-600 hover:text-primary-green-800">
          <IoSend size={22} className="text-primary-green-600"/>
        </button>
      </form>
    </div>
  );
}

export default ChatbotModal;
