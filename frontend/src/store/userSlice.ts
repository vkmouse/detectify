import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '../types/api';

type UserState = {
  isLoading: boolean;
  userInfo: UserInfo | null;
};

const initialState: UserState = {
  isLoading: false,
  userInfo: {
    name: '',
    email: '',
    avatarURL: '',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.isLoading = false;
      if (action.payload) {
        state.userInfo = {
          ...action.payload,
          avatarURL: action.payload.avatarURL + `?v=${new Date().getTime()}`,
        };
      } else {
        state.userInfo = null;
      }
    },
    reset: (state) => {
      state.isLoading = false;
      state.userInfo = {
        name: '',
        email: '',
        avatarURL: '',
      };
    },
  },
});

export const { startLoading, setUser, reset } = userSlice.actions;
export default userSlice.reducer;
