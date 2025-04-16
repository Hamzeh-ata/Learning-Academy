import { chatRoomThunks } from '@/services/client-services/chat-room.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatRoom: {
    rooms: [],
    attachments: [],
    users: [],
    loading: false,
    error: null
  },
  chatRoomMessages: {
    messages: [],
    loading: false,
    error: null
  },
  selectedChatRoom: null
};

const chatRoomSlice = createSlice({
  name: 'chatRooms',
  initialState,
  reducers: {
    setSelectedChatRoom: (state, action) => {
      state.selectedChatRoom = action.payload;
    },
    addMessage: (state, action) => {
      if (action.payload.chatRoomId === state.selectedChatRoom?.id) {
        const index = state.chatRoomMessages.messages.findIndex((item) => item.id === action.payload.id);
        if (index === -1) {
          state.chatRoomMessages.messages = [...state.chatRoomMessages.messages, action.payload];
        }
      }
    },
    deleteMessage: (state, action) => {
      state.chatRoomMessages.messages = state.chatRoomMessages.messages.map((item) => {
        if (item.id === action.payload) {
          return { ...item, isDeleted: true };
        }
        return item;
      });
    },
    updateMessageEmoji: (state, action) => {
      const { messageId, ...rest } = action.payload;
      const message = state.chatRoomMessages.messages.find((e) => e.id === messageId);
      if (!message) {
        return;
      }

      const index = message.reactions.findIndex((item) => item.userId === rest.userId);
      if (index === -1) {
        message.reactions = [...message.reactions, rest];
      }
    },
    deleteMessageEmoji: (state, action) => {
      const { messageId, userId, id } = action.payload;
      const message = state.chatRoomMessages.messages.find((e) => e.id === messageId);
      if (!message) {
        return;
      }
      const index = message.reactions.findIndex((item) => item.userId === userId && item.id === id);
      if (index !== -1) {
        message.reactions.splice(index, 1);
      }
    },
    toggleStudentMute: (state, action) => {
      const { userId, isMuted, roomId } = action.payload;
      if (
        state.selectedChatRoom &&
        state.selectedChatRoom.roomId === roomId &&
        state.selectedChatRoom.userId === userId
      ) {
        state.selectedChatRoom.isMuted = isMuted;
      }
      state.chatRoom.rooms = state.chatRoom.rooms.map((item) => {
        if (item.roomId === roomId && item.userId === userId) {
          return { ...item, isMuted };
        }
        return item;
      });
      state.chatRoom.users = state.chatRoom.users.map((item) => {
        if (item.userId === userId) {
          return { ...item, isMuted };
        }
        return item;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatRoomThunks.getUserRooms.pending, (state) => {
        state.chatRoom.loading = true;
      })
      .addCase(chatRoomThunks.getUserRooms.fulfilled, (state, action) => {
        state.chatRoom.rooms = action.payload;
        state.chatRoom.loading = false;
        state.chatRoom.error = null;
      })
      .addCase(chatRoomThunks.getUserRooms.rejected, (state, action) => {
        state.chatRoom.loading = false;
        state.chatRoom.error = action.error.message;
      })

      .addCase(chatRoomThunks.getRoomUsers.pending, (state) => {
        state.chatRoom.loading = true;
      })
      .addCase(chatRoomThunks.getRoomUsers.fulfilled, (state, action) => {
        state.chatRoom.users = action.payload;
        state.chatRoom.loading = false;
        state.chatRoom.error = null;
      })
      .addCase(chatRoomThunks.getRoomUsers.rejected, (state, action) => {
        state.chatRoom.loading = false;
        state.chatRoom.error = action.error.message;
      })

      .addCase(chatRoomThunks.getRoomAttachments.pending, (state) => {
        state.chatRoom.loading = true;
      })
      .addCase(chatRoomThunks.getRoomAttachments.fulfilled, (state, action) => {
        state.chatRoom.attachments = action.payload;
        state.chatRoom.loading = false;
        state.chatRoom.error = null;
      })
      .addCase(chatRoomThunks.getRoomAttachments.rejected, (state, action) => {
        state.chatRoom.loading = false;
        state.chatRoom.error = action.error.message;
      })

      .addCase(chatRoomThunks.getRoomChat.pending, (state) => {
        state.chatRoomMessages.loading = true;
      })
      .addCase(chatRoomThunks.getRoomChat.fulfilled, (state, action) => {
        state.chatRoomMessages.messages = action.payload;
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = null;
      })
      .addCase(chatRoomThunks.getRoomChat.rejected, (state, action) => {
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = action.error.message;
      })

      .addCase(chatRoomThunks.sendMessage.pending, (state) => {
        state.chatRoomMessages.loading = true;
      })
      .addCase(chatRoomThunks.sendMessage.fulfilled, (state) => {
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = null;
      })
      .addCase(chatRoomThunks.sendMessage.rejected, (state, action) => {
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = action.error.message;
      })

      // delete chat room message
      .addCase(chatRoomThunks.deleteMessage.pending, (state) => {
        state.chatRoomMessages.loading = true;
      })
      .addCase(chatRoomThunks.deleteMessage.fulfilled, (state, action) => {
        state.chatRoomMessages.messages = state.chatRoomMessages.messages.map((item) => {
          if (item.id === action.payload) {
            return { ...item, isDeleted: true };
          }
          return item;
        });
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = null;
      })
      .addCase(chatRoomThunks.deleteMessage.rejected, (state, action) => {
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = action.error.message;
      });
  }
});

export const {
  setSelectedChatRoom,
  addMessage,
  deleteMessage,
  updateMessageEmoji,
  deleteMessageEmoji,
  toggleStudentMute
} = chatRoomSlice.actions;

export const selectChatRooms = (state) => state.chatRooms.chatRoom;
export const selectChatRoomMessages = (state) => state.chatRooms.chatRoomMessages;
export const getSelectedChatRoom = (state) => state.chatRooms.selectedChatRoom;

export default chatRoomSlice.reducer;
