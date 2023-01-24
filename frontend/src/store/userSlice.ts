import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '../types/api';

type UserState = {
  isInit: boolean;
  isFetching: boolean;
  userInfo: UserInfo | null;
};

const initialState: UserState = {
  isInit: false,
  isFetching: false,
  userInfo: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startFetching: (state) => {
      state.isFetching = true;
    },
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.isInit = true;
      state.isFetching = false;
      state.userInfo = {
        ...action.payload,
        avatar: action.payload.avatar + `?v=${new Date().getTime()}`,
      };
    },
    reset: (state) => {
      state.isInit = true;
      state.isFetching = false;
      state.userInfo = null;
    },
  },
});

export const { startFetching, setUser, reset } = userSlice.actions;
export default userSlice.reducer;
