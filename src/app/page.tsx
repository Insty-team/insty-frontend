import Image from "next/image";
import Link from "next/link";

import ScrollAnimations from "./_components/landing/ScrollAnimations";

function Home() {
	return (
		<div className="bg-white relative">
			<ScrollAnimations />
			<Link
				href="/login"
				className="fixed-login-button fixed top-2 right-2 bg-primary-green-500 text-white hover:bg-primary-green-600 font-bold py-2 px-6 rounded-xl transition-all duration-300 z-50"
			>
				로그인
			</Link>

			<section
				id="problem"
				data-section
				className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-6"
			>
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="text-5xl font-bold text-black-500 mb-8">
						처음에 뭐든 설치하고 세팅하고 참 어렵죠?
					</h1>
					<p className="text-3xl md:text-2xl text-black-200 mb-6">
						설치 방법부터 복잡한 환경 설정까지...
					</p>
					<p className="text-2xl text-black-100 mb-12">
						복잡한 설치, 저희 Insty가 해결해드릴게요!
					</p>
					<div className="text-gray-scale-400 animate-bounce">
						<svg
							className="w-8 h-8 mx-auto"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</div>
				</div>
			</section>

			{/* 두 번째 섹션: 러너 기능 */}
			<section
				id="learner"
				data-section
				className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-6 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
			>
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-primary-blue-500 mb-6">
							러너라면 내가 원하는 강의를 찾아보세요
						</h2>
						<p className="text-xl text-black-200">
							Insty AI가 가이드와 강의 추천을 해드릴게요.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-12 items-center">
						<Image
							src="/learnerfunc.gif"
							alt="learnerfunc"
							width={500}
							height={500}
						/>
						{/* 기능 설명 */}
						<div>
							<div className="space-y-8">
								<div className="bg-white rounded-xl p-6 shadow-lg">
									<h3 className="text-xl font-bold text-black-400 mb-3">
										🤖 AI 학습 도우미
									</h3>
									<p className="text-black-200">
										수강 중 막히는 부분이 있다면, 즉시 질문하고 맞춤형 답변을
										받으세요.
									</p>
								</div>

								<div className="bg-white rounded-xl p-6 shadow-lg">
									<h3 className="text-xl font-bold text-black-400 mb-3">
										📚 강의 추천
									</h3>
									<p className="text-black-200">
										내 목표에 맞는 강의를 AI가 추천해드립니다.
									</p>
								</div>

								<div className="bg-white rounded-xl p-6 shadow-lg">
									<h3 className="text-xl font-bold text-black-400 mb-3">
										💬 커뮤니티 (구현 예정)
									</h3>
									<p className="text-black-200">
										크리에이터와 소통하며 성장하세요.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 세 번째 섹션: 크리에이터 기능 */}
			<section
				id="creator"
				data-section
				className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-6 opacity-0 translate-y-10 transition-all duration-1000 ease-out"
			>
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-primary-green-500 mb-6">
							크리에이터라면 불필요한 시간을 줄이세요
						</h2>
						<p className="text-xl text-black-200">
							Insty AI가 영상을 분석하여 초안을 완성해드립니다.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-12 items-center">
						<Image
							src="/creatorfunc.gif"
							alt="creatorfunc"
							width={500}
							height={500}
						/>

						{/* 기능 설명 */}
						<div className="order-1 md:order-2">
							<div className="space-y-8">
								<div className="flex items-start space-x-4">
									<div className="w-12 h-12 bg-primary-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
										1
									</div>
									<div>
										<h3 className="text-xl font-bold text-black-400 mb-2">
											영상 업로드
										</h3>
										<p className="text-black-200">강의 영상을 업로드하세요.</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="w-12 h-12 bg-secondary-verdigris rounded-lg flex items-center justify-center text-white font-bold text-lg">
										2
									</div>
									<div>
										<h3 className="text-xl font-bold text-black-400 mb-2">
											AI 초안 분석
										</h3>
										<p className="text-black-200">
											제목 부터 핵심 내용까지, 자동으로 완성해드립니다.
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="w-12 h-12 bg-primary-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
										3
									</div>
									<div>
										<h3 className="text-xl font-bold text-black-400 mb-2">
											업로드 완료!
										</h3>
										<p className="text-black-200">
											훨씬 더 쉽게 강의를 준비할 수 있어요.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 혜택 강조 */}
					<div className="mt-16 text-center">
						<div className="inline-flex items-center space-x-6 bg-white rounded-full px-8 py-4 shadow-lg">
							<div className="flex items-center space-x-2">
								<span className="text-2xl">⚡</span>
								<span className="font-semibold text-black-300">
									강의 준비 시간이 엄청 줄어들거에요!
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA 섹션 */}
			<section
				id="cta"
				data-section
				className="py-20 bg-black-400 text-white opacity-0 translate-y-10 transition-all duration-1000 ease-out"
			>
				<div className="max-w-4xl mx-auto text-center px-6">
					<h2 className="text-4xl font-bold mb-8 text-gray-scale-50">
						지금 바로 경험 해보세요!
					</h2>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/login"
							className=" text-white bg-primary-green-500 hover:bg-primary-green-600 font-bold py-4 px-8 rounded-lg transition-colors"
						>
							시작하기
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}

export default Home;
