import CommunityTab from "./_components/CommunityTab";

// const LEARNER_COMMUNITY_TAB_MENU = [
// 	{
// 		label: "커뮤니티",
// 		content: <CommunityTab />,
// 	},
// 	{
// 		label: "자유게시판",
// 		content: <FreeBoardTab />,
// 	},
// ];

function Community() {
	return (
		<div className="flex flex-col mt-16">
			<CommunityTab />
		</div>
	);
}

export default Community;
