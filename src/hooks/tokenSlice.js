import { createSlice } from "@reduxjs/toolkit";
import { removeStorageToken, setStorageToken } from "../helper/storage";

// npm install redux-persist redux-thunk

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    info: {
      accessToken: "",
      refreshToken: "",
      tokenType: "",
      expiryDuration: 0,
    },
  },
  reducers: {
    setTokenInfo: (state, action) => {
      state.info = action.payload;
      setStorageToken(action.payload);
    },
    removeTokenInfo: (state) => {
      state.info = {
        accessToken: "",
        refreshToken: "",
        tokenType: "",
        expiryDuration: 0,
      };
      removeStorageToken();
    },
  },
});

export default tokenSlice.reducer;
export const { setTokenInfo, removeTokenInfo } = tokenSlice.actions;
export const getTokenInfo = (state) => state.token.info;
