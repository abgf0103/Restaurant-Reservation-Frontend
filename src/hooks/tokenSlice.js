import { createSlice } from "@reduxjs/toolkit";
import { removeStorageToken, setStorageToken } from "../helper/storage"; // 로컬스토리지 관리 유틸리티 함수들

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
            setStorageToken(action.payload); // 토큰을 로컬스토리지에 저장
        },
        removeTokenInfo: (state) => {
            state.info = {
                accessToken: "",
                refreshToken: "",
                tokenType: "",
                expiryDuration: 0,
            };
            removeStorageToken(); // 로컬스토리지에서 토큰 삭제
        },
    },
});

export default tokenSlice.reducer;
export const { setTokenInfo, removeTokenInfo } = tokenSlice.actions;
export const getTokenInfo = (state) => state.token.info;
