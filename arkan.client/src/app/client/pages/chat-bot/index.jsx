import { ChatBotPanel } from '@(client)/features/chat-bot';
import { FeatherIcon } from '@/app/shared/components';
import { useIsAuthenticated } from '@/hooks';
import { ChatBotThunks } from '@/services/shared/chatbot.service';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './chat-bot.css';

export function ChatBot() {
  const isLoggedIn = useIsAuthenticated();
  const dispatch = useDispatch();
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(ChatBotThunks.getRoomId());
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  const handleOnClick = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className="chat-bot">
      <button className="chat-bot__button" onClick={handleOnClick}>
        {!isPanelVisible && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="60"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#fff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
            <path d="M9.5 9h.01" />
            <path d="M14.5 9h.01" />
            <path d="M9.5 13a3.5 3.5 0 0 0 5 0" />
          </svg>
        )}
        {isPanelVisible && (
          <FeatherIcon className="h-[1.6em] text-slate-200 mb-1 font-semibold hover:text-red-300" name="X" size={22} />
        )}
      </button>

      {isPanelVisible && <ChatBotPanel isPanelVisible={isPanelVisible} setIsPanelVisible={setIsPanelVisible} />}
    </div>
  );
}
