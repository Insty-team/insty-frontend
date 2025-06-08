import Link from "next/link";

function Home() {
	return (
		<div>
			추후 랜딩페이지가 생길 곳입니다.
			<div className="mt-8">
				<Link
					href={"/login"}
					className="bg-primary-blue-300 hover:bg-primary-blue-500 text-white rounded-2xl p-4"
				>
					로그인으로
				</Link>
			</div>
		</div>
	);
}

export default Home;
