import Image from "next/image";

function RunnerHeader() {
	const menuList = ["맞춤 콘텐츠 추천", "마이페이지", "커뮤니티"];

	return (
		<div className="flex justify-between items-center w-full px-4">
			<div className="w-full max-w-[1400px] h-[88px] flex justify-between mx-auto">
				<div className="flex gap-20">
					<Image
						className="object-contain"
						src="/insty.png"
						alt="logo"
						width={72}
						height={63}
					/>
					<div className="flex justify-center items-center gap-24 cursor-pointer --text-2lg font-bold">
						{menuList.map((menu) => (
							<span key={menu}>{menu}</span>
						))}
					</div>
				</div>
				<div className="flex gap-8 justify-center items-center">
					<Image
						className="cursor-pointer"
						src="/alram.svg"
						alt="alram"
						width={36}
						height={36}
					/>
					<Image
						className="cursor-pointer"
						src="/profile.svg"
						alt="profile"
						width={36}
						height={36}
					/>
					<span className="--text-2lg font-medium">김가나</span>
				</div>
			</div>
		</div>
	);
}

export default RunnerHeader;
