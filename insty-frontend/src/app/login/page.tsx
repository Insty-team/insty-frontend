import Image from "next/image";
import Link from "next/link";

function Select() {
	return (
		<>
			<div className="flex justify-center p-8 w-full">
				<div className="flex flex-col items-center">
					<Image src="/insty.png" alt="logo" width={208} height={181} />
					<div className="text-center mt-12">
						<p className="text-2xl text-black-200">
							어떤 활동을 시작하시겠어요?
						</p>
						<p className="text-3xl text-black-400 font-bold">
							가입 유형을 선택하고 시작하세요!
						</p>
					</div>
					<div className="flex justify-between mt-12 gap-20">
						<div className="flex flex-col justify-between items-center p-16 border border-primary-blue-400 rounded-2xl h-[400px]">
							<p className="mb-4 text-3xl text-black-400 font-semibold">러너</p>
							<div className="text-center text-black-200 text-2xl">
								<div>
									<p>설치 가이드를 보고</p>
									<p>전문가처럼 설치해보세요!</p>
								</div>
								<div className="mt-2">
									<p>영상과 문서로</p>
									<p>따라하기 쉬운 가이드 제공</p>
								</div>
							</div>
							<Link href="/login/learner" className="mt-12 h-12 bg-primary-blue-300 hover:bg-primary-blue-500 cursor-pointer text-white border px-10 py-2 rounded-2xl flex items-center text-xl">
								시작하기{" "}
								<Image
									className="ml-4"
									src="/next.png"
									alt="next"
									width={8}
									height={16}
								/>
							</Link>
						</div>
						<div className="flex flex-col justify-between items-center p-16 border border-orange rounded-2xl h-[400px]">
							<p className="mb-4 text-3xl text-black-400 font-semibold">
								크리에이터
							</p>
							<div className="text-center text-black-200 text-2xl">
								<div>
									<p>나만의 설치 가이드를</p>
									<p>제작하고 공유하세요!</p>
								</div>
								<div className="mt-2">
									<p>가이드 제작으로</p>
									<p>수익을 창출할 수 있어요.</p>
								</div>
							</div>
							<Link href="/login/creator" className="mt-12 h-12 bg-orange hover:bg-orange-hover cursor-pointer text-white border px-10 py-2 rounded-2xl flex items-center text-xl">
								시작하기{" "}
								<Image
									className="ml-4"
									src="/next.png"
									alt="next"
									width={8}
									height={16}
								/>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default Select;
