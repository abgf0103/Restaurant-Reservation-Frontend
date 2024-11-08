import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    info: {
      active: false,
      email: "",
      roles: [],
      username: "",
    },
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.info = action.payload;
    },
    removeUserInfo: (state) => {
      state.info = {
        active: false,
        email: "",
        roles: [],
        username: "",
      };
    },
  },
});

export default userSlice.reducer;
export const { removeUserInfo, setUserInfo } = userSlice.actions;
export const getUserInfo = (state) => state.user.info;
