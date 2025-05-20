import { VIDEOS_HEADER_LIST } from "@/app/constants/constants";

type VideosHeaderProps = {
	activeTab: string;
	setActiveTab: (tab: string) => void;
};

function VideosHeader({ activeTab, setActiveTab }: VideosHeaderProps) {
	return (
		<>
			<div className="w-full flex space-x-8 p-4 font-semibold" aria-label="videos-header">
				{VIDEOS_HEADER_LIST.map((header) => (
					<button 
                        key={header.id} 
                        className={`text-lg transition-colors duration-200 ${
                            activeTab === header.id 
                                ? "text-primary-blue-400 border-0 border-b-2 !border-primary-blue-400" 
                                : "text-gray-scale-400 cursor-pointer hover:text-black"
                        }`} 
                        onClick={() => setActiveTab(header.id)}
                    >   
                        {header.title}
                    </button>
				))}
			</div>
		</>
	);
}
export default VideosHeader;
