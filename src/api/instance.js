import axios from "axios";
import { useSelector } from "react-redux";
import { getTokenInfo } from "../hooks/tokenSlice";
import { getStorageToken } from "../helper/storage";
import Swal from "sweetalert2";

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
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 오류가 발생하면 뭔가 해라
        // 400 : 요청 오류 (파라미터 누락 등)
        // 401 : 인증 오류
        // 403 : 권한 없음 (일반 사용자가 관리자 리소스에 접근)
        // 404 : 리소스 없음 (페이지를 찾을 수 없습니다)
        // 405 : 잘못된 요청방식 (GET, POST)
        // 500 : 서버 측 연산 오류
        let msg = "";
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    msg = "잘못된 요청입니다";
                    break;
                case 401:
                    msg = "인증이 필요합니다 로그인 하세요";
                    break;
                case 403:
                    msg = "권한이 없습니다";
                    break;
                case 404:
                    msg = "요청한 리소스를 찾을 수 없습니다";
                    break;
                case 405:
                    msg = "지원하지 않는 메서드입니다";
                    break;
                case 500:
                    msg = "서버 오류입니다 잠시후 다시 시도해주세요";
                    break;
                default:
                    msg = "알 수 없는 오류입니다.";
            }
        } else if (error.request) {
            msg = "서버의 응답이 없습니다.";
        } else {
            msg = error.message;
        }
        Swal.fire({
            title: "Error",
            text: msg,
            icon: "error",
        });
        return Promise.reject(error); //컴파일때 사용
        //return { message: error.message }; //개발할때 사용
    }
);
