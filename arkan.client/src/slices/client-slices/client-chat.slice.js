import { clientChatThunks } from '@/services/client-services/chat-room.service';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatRoom: {
    rooms: [],
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

const clientRoomSlice = createSlice({
  name: 'clientChatRooms',
  initialState,
  reducers: {
    setSelectedClientChatRoom: (state, action) => {
      state.selectedChatRoom = action.payload;
    },
    addMessage: (state, action) => {
      const index = state.chatRoomMessages.messages.findIndex((item) => item.id === action.payload.id);
      if (index === -1) {
        state.chatRoomMessages.messages = [...state.chatRoomMessages.messages, action.payload];
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(clientChatThunks.getInstructorsList.pending, (state) => {
        state.chatRoom.loading = true;
      })
      .addCase(clientChatThunks.getInstructorsList.fulfilled, (state, action) => {
        state.chatRoom.users = action.payload;
        state.chatRoom.loading = false;
        state.chatRoom.error = null;
      })
      .addCase(clientChatThunks.getInstructorsList.rejected, (state, action) => {
        state.chatRoom.loading = false;
        state.chatRoom.error = action.error.message;
      })

      .addCase(clientChatThunks.getRooms.pending, (state) => {
        state.chatRoom.loading = true;
      })
      .addCase(clientChatThunks.getRooms.fulfilled, (state, action) => {
        state.chatRoom.rooms = action.payload;
        state.chatRoom.loading = false;
        state.chatRoom.error = null;
      })
      .addCase(clientChatThunks.getRooms.rejected, (state, action) => {
        state.chatRoom.loading = false;
        state.chatRoom.error = action.error.message;
      })

      .addCase(clientChatThunks.getRoomChat.pending, (state) => {
        state.chatRoomMessages.loading = true;
      })
      .addCase(clientChatThunks.getRoomChat.fulfilled, (state, action) => {
        state.chatRoomMessages.messages = action.payload;
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = null;
      })
      .addCase(clientChatThunks.getRoomChat.rejected, (state, action) => {
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = action.error.message;
      })
      .addCase(clientChatThunks.deleteMessage.pending, (state) => {
        state.chatRoomMessages.loading = true;
      })
      .addCase(clientChatThunks.deleteMessage.fulfilled, (state, action) => {
        state.chatRoomMessages.messages = state.chatRoomMessages.messages.map((item) => {
          if (item.id === action.payload) {
            return { ...item, isDeleted: true };
          }
          return item;
        });
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = null;
      })
      .addCase(clientChatThunks.deleteMessage.rejected, (state, action) => {
        state.chatRoomMessages.loading = false;
        state.chatRoomMessages.error = action.error.message;
      });
  }
});

export const selectClientChatRooms = (state) => state.clientChatRooms.chatRoom;
export const selectClientChatMessages = (state) => state.clientChatRooms.chatRoomMessages;
export const getSelectClientChatRoom = (state) => state.clientChatRooms.selectedChatRoom;

export const { setSelectedClientChatRoom, addMessage, deleteMessage, updateMessageEmoji, deleteMessageEmoji } =
  clientRoomSlice.actions;

export default clientRoomSlice.reducer;
