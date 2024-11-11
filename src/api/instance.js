import axios from "axios";
import { useSelector } from "react-redux";
import { getTokenInfo } from "../hooks/tokenSlice";
import { getStorageToken } from "../helper/storage";

const instance = axios.create({
  baseURL: process.env.REACT_APP_HOST,
  timeout: 10000,
});

export default instance;

// request 날리기 전에 axios가 할 일
instance.interceptors.request.use(
  (config) => {
    const token = getStorageToken();
    config.headers = {
      Authorization: `${token?.tokenType}${token?.accessToken}`,
      "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    console.log("intercept에서 오류 발생", error);
    return Promise.reject(error);
  }
);

// response 받고 나서 axios가 할 일
// instance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // 오류가 발생하면 뭔가 해라
//     return Promise.reject(error);
//   }
// );
