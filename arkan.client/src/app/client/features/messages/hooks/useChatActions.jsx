import {
  addMessage,
  deleteMessage,
  deleteMessageEmoji,
  updateMessageEmoji
} from '@/slices/client-slices/chat-room.slice';

import {
  addMessage as clientAddMessage,
  deleteMessage as clientDeleteMessage,
  deleteMessageEmoji as clientDeleteMessageEmoji,
  updateMessageEmoji as clientUpdateMessageEmoji
} from '@/slices/client-slices/client-chat.slice';

import { useTabs } from './useTabs';
export const useChatActions = () => {
  const { activeIndex } = useTabs();

  return {
    addMessage: activeIndex ? clientAddMessage : addMessage,
    deleteMessage: activeIndex ? clientDeleteMessage : deleteMessage,
    deleteMessageEmoji: activeIndex ? clientDeleteMessageEmoji : deleteMessageEmoji,
    updateMessageEmoji: activeIndex ? clientUpdateMessageEmoji : updateMessageEmoji
  };
};
