import { FeatherIcon } from '@/app/shared/components';
import khaledImage from '@assets/icons/khaled.png';

export const ChatBotHeader = ({ setIsPanelVisible }) => (
  <div className="p-4 text-white chat-bot__header flex justify-between items-center relative">
    <div className="flex items-center">
      <div className="relative">
        <img src={khaledImage} alt="Khaled" className="w-10 h-10 rounded-full mr-2 bg-slate-200/40" />
        <span className="absolute bottom-0 right-1 w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
      </div>

      <h2 className="text-base">Chat With Khaled</h2>
    </div>
    <button className="hover:text-red-200" onClick={() => setIsPanelVisible(false)}>
      <FeatherIcon name="ChevronDown" />
    </button>
  </div>
);
