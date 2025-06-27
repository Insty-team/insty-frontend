type CommunityVideoProps = {
  // thumbnail: string;
  title: string;
  content: string;
  isSelected: boolean;
};

function CommunityVideo({ title, content, isSelected }: CommunityVideoProps) {
  return (
    <div
      className={`flex gap-4 ${
        isSelected ? "bg-[#EFEFEF]" : ""
      } rounded-4xl p-4 w-[480px] cursor-pointer`}
    >
      {/* 추후 이미지 태그로 대체해야 함 */}
      <div className="bg-[#d9d9d9] w-[200px] h-[120px] rounded-2xl"></div>
      <div className="flex flex-col">
        <span>{title}</span>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default CommunityVideo;
