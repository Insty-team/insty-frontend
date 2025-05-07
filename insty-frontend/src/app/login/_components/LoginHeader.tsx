import Image from "next/image";

function LoginHeader() {
	return (
		<div className="flex justify-between items-center px-8 py-2 shadow-line-100">
			<Image src="/insty.png" alt="logo" width={72} height={63} />
			<button className="h-8 bg-primary-blue-300 hover:bg-primary-blue-500 text-white border px-8 py-2 rounded-[16px] flex items-center">
				로그인
			</button>
		</div>
	);
}

export default LoginHeader;
