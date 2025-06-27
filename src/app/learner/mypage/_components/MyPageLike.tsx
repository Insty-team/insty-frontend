"use client";

import { LikeItemProps } from "./LikeItem";
import LikeItem from "./LikeItem";

function MyPageLike() {
  const MOCK_LIKE_ITEMS: LikeItemProps[] = [
    {
      title: "자기 전 10분 스트레칭",
      price: 0,
      duration: "12분",
      category: "스트레칭",
      name: "홍길동",
      thumbnail: "https://via.placeholder.com/314x177?text=Stretching",
      thumbnailWidth: 314,
      thumbnailHeight: 177,
      isLike: true,
    },
    {
      title: "초보자를 위한 명상 입문",
      price: 9900,
      duration: "45분",
      category: "명상",
      name: "김이순",
      thumbnail: "https://via.placeholder.com/314x177?text=Meditation",
      thumbnailWidth: 314,
      thumbnailHeight: 177,
      isLike: true,
    },
    {
      title: "생산성을 높이는 아침 루틴",
      price: 7900,
      duration: "25분",
      category: "루틴",
      name: "박철수",
      thumbnail: "https://via.placeholder.com/314x177?text=Routine",
      thumbnailWidth: 314,
      thumbnailHeight: 177,
      isLike: false,
    },
    {
      title: "일 잘하는 사람의 메모법",
      price: 14900,
      duration: "1시간 10분",
      category: "자기계발",
      name: "이영희",
      thumbnail: "https://via.placeholder.com/314x177?text=Memo",
      thumbnailWidth: 314,
      thumbnailHeight: 177,
      isLike: true,
    },
    {
      title: "코어 근육 단련 20분 루틴",
      price: 5900,
      duration: "20분",
      category: "운동",
      name: "최건우",
      thumbnail: "https://via.placeholder.com/314x177?text=Core",
      thumbnailWidth: 314,
      thumbnailHeight: 177,
      isLike: true,
    },
    {
      title: "하루를 정리하는 저녁 일기",
      price: 0,
      duration: "15분",
      category: "마인드셋",
      name: "정미선",
      thumbnail: "https://via.placeholder.com/314x177?text=Journal",
      thumbnailWidth: 314,
      thumbnailHeight: 177,
      isLike: false,
    },
    {
      title: "집중력을 높이는 환경 만들기",
      price: 8900,
      duration: "30분",
      category: "라이프스타일",
      name: "한서준",
      thumbnail: "https://via.placeholder.com/314x177?text=Focus",
      thumbnailWidth: 314,
      thumbnailHeight: 177,
      isLike: true,
    },
    {
      title: "우울할 때 꺼내 듣는 이야기",
      price: 0,
      duration: "40분",
      category: "정신건강",
      name: "서지은",
      thumbnail: "https://via.placeholder.com/314x177?text=Healing",
      thumbnailWidth: 314,
      thumbnailHeight: 177,
      isLike: true,
    },
    {
      title: "비움과 정리에 대한 철학",
      price: 10900,
      duration: "35분",
      category: "미니멀리즘",
      name: "남윤호",
      thumbnail: "https://via.placeholder.com/314x177?text=Minimal",
      thumbnailWidth: 314,
      thumbnailHeight: 177,
      isLike: false,
    },
  ];

  return (
    <div className="flex flex-col w-full gap-10">
      <h3 className="text-2xl">내가 찜한 영상</h3>
      <div className="flex gap-6 flex-wrap">
        {MOCK_LIKE_ITEMS.map((item) => (
          <LikeItem key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

export default MyPageLike;
