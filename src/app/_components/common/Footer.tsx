import Image from "next/image";

function Footer() {
	return (
		<footer className="w-full bg-gray-scale-50 py-12 mt-10 flex items-center justify-center gap-10 text-sm shadow-line-t-100">
			<Image src="/insty.png" alt="logo" width={72} height={63} />
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-semibold">문의하기</h2>
				<ul className="flex flex-col gap-1 text-gray-scale-500 text-md">
					<li>Email : instyhelp@gmail.com</li>
					<li>
						<a
							href="https://docs.google.com/forms/d/e/1FAIpQLScmmFrppsCdskhXJtOna0MOr-nIbgEVrlbm7S6H2s93lclWJg/viewform"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-primary-green-600 hover:underline"
						>
							서비스 문의하러 가기
						</a>
					</li>
					<li>
						<a
							href="https://docs.google.com/forms/d/e/1FAIpQLSdfy0jpk-zmcQoNgzI_H76TcPZjCVU9CkBDMCEl1Mb9uqzIdQ/viewform"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-primary-green-600 hover:underline"
						>
							강의 요청하러 가기
						</a>
					</li>
				</ul>
			</div>
		</footer>
	);
}

export default Footer;
