import { createSlice } from '@reduxjs/toolkit';
import { chatRoomThunks } from '@/services/admin-services/courses-chat.service';

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

const coursesChatSlice = createSlice({
  name: 'coursesChat',
  initialState,
  reducers: {
    setSelectedChatRoom: (state, action) => {
      state.selectedChatRoom = action.payload;
    },
    toggleStudentMute: (state, action) => {
      const { userId, isMuted, roomId } = action.payload;
      const roomIndex = state.chatRoom.rooms.findIndex((item) => item.roomId === roomId && item.userId === userId);
      if (roomIndex !== -1) {
        state.chatRoom.rooms[roomIndex].isMuted = isMuted;
      }
      const userIndex = state.chatRoom.users.findIndex((item) => item.userId === userId);
      if (userIndex !== -1) {
        state.chatRoom.users[userIndex].isMuted = isMuted;
      }
      if (
        state.selectedChatRoom &&
        state.selectedChatRoom.userId === userId &&
        state.selectedChatRoom.roomId === roomId
      ) {
        state.selectedChatRoom.isMuted = isMuted;
      }
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
      });
  }
});

export const { setSelectedChatRoom, toggleStudentMute } = coursesChatSlice.actions;
export const selectChatRooms = (state) => state.coursesChat.chatRoom;
export const selectChatRoomMessages = (state) => state.coursesChat.chatRoomMessages;
export const getSelectedChatRoom = (state) => state.coursesChat.selectedChatRoom;
export const selectRoomUsers = (state) => state.coursesChat.chatRoom.users;

export default coursesChatSlice.reducer;
