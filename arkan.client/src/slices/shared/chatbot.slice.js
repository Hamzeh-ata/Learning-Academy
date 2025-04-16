import { ChatBotThunks } from '@/services/shared/chatbot.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatRoom: {
    rooms: [],
    loading: false,
    error: null
  },
  chatRoomMessages: {
    messages: [
      {
        messageId: 0,
        content: 'Hello, This is Khaled. How can I help you?',
        senderId: 'bot',
        timestamp: '2024-05-27T03:32:08.5189038'
      }
    ],
    loading: false,
    error: null
  },
  selectedChatRoom: null,
  selectedChatRoomId: 0
};

const chatBotSlice = createSlice({
  name: 'chatBot',
  initialState,
  reducers: {
    setSelectedChatRoom: (state, action) => {
      state.selectedChatRoom = action.payload;
      state.selectedChatRoomId = action.payload ? action.payload.roomId : null;
    },
    addMessage: (state, action) => {
      if (state.selectedChatRoomId === 0) {
        state.selectedChatRoomId = action.payload.roomId;
      }
      if (action.payload.roomId === state.selectedChatRoomId) {
        const index = state.chatRoomMessages.messages.findIndex((item) => item.messageId === action.payload.messageId);
        if (index === -1) {
          state.chatRoomMessages.messages = [...state.chatRoomMessages.messages, action.payload];
        }
      }
    },
    deleteMessage: (state, action) => {
      state.chatRoomMessages.messages = state.chatRoomMessages.messages.map((item) => {
        if (item.messageId === action.payload) {
          return { ...item, isDeleted: true };
        }
        return item;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(ChatBotThunks.getRooms.pending, (state) => {
        state.chatRoom.loading = true;
      })
      .addCase(ChatBotThunks.getRooms.fulfilled, (state, action) => {
        state.chatRoom.rooms = action.payload;
        state.chatRoom.loading = false;
        state.chatRoom.error = null;
      })
      .addCase(ChatBotThunks.getRooms.rejected, (state, action) => {
        state.chatRoom.loading = false;
        state.chatRoom.error = action.error.message;
      })

      .addCase(ChatBotThunks.getRoomMessages.pending, (state) => {
        state.chatRoomMessages.loading = true;
      })
      .addCase(ChatBotThunks.getRoomMessages.fulfilled, (state, action) => {
        state.chatRoomMessages.messages = action.payload;
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = null;
      })
      .addCase(ChatBotThunks.getRoomMessages.rejected, (state, action) => {
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = action.error.message;
      })

      .addCase(ChatBotThunks.sendMessage.pending, (state) => {
        state.chatRoomMessages.loading = true;
      })
      .addCase(ChatBotThunks.sendMessage.fulfilled, (state, action) => {
        if (state.selectedChatRoomId === 0) {
          state.selectedChatRoomId = action.payload.roomId;
        }
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = null;
      })
      .addCase(ChatBotThunks.sendMessage.rejected, (state, action) => {
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = action.error.message;
      })

      .addCase(ChatBotThunks.getRoomId.fulfilled, (state, action) => {
        state.selectedChatRoomId = action.payload;
      })

      // delete chat room message
      .addCase(ChatBotThunks.deleteChatRoom.pending, (state) => {
        state.chatRoomMessages.loading = true;
      })
      .addCase(ChatBotThunks.deleteChatRoom.fulfilled, (state, action) => {
        state.chatRoomMessages.messages = state.chatRoomMessages.messages.map((item) => {
          if (item.id === action.payload) {
            return { ...item, isDeleted: true };
          }
          return item;
        });
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = null;
      })
      .addCase(ChatBotThunks.deleteChatRoom.rejected, (state, action) => {
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = action.error.message;
      });
  }
});

export const { setSelectedChatRoom, addMessage, deleteMessage, updateRoomList } = chatBotSlice.actions;

export const selectChatBotRooms = (state) => state.chatBot.chatRoom;
export const selectChatBotMessages = (state) => state.chatBot.chatRoomMessages;
export const selectChatBotSelectedRoomId = (state) => state.chatBot.selectedChatRoomId;
export const getSelectedChatBotRoom = (state) => state.chatBot.selectedChatRoom;

export default chatBotSlice.reducer;
