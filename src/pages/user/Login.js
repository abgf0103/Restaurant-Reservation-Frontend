import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokenInfo } from "../../hooks/tokenSlice";
import { setUserInfo } from "../../hooks/userSlice";
import "./css/login.css";

const Login = () => {
    // 페이지 이동 함수
    const navigate = useNavigate();
    // 저장소에 저장하는 변수
    const dispath = useDispatch();

    const [loginInfo, setLoginInfo] = useState({
        username: "111",
        password: "111",
        deviceInfo: {
            deviceId: "2",
            deviceType: "DEVICE_TYPE_WINDOWS",
            notificationToken: "111",
        },
    });

    // form의 변경이 일어나면...
    const onChange = (e) => {
        console.log(e.target.id);
        if (e.target.id === "username") {
            setLoginInfo({
                ...loginInfo,
                username: e.target.value,
            });
        } else if (e.target.id === "password") {
            setLoginInfo({
                ...loginInfo,
                password: e.target.value,
            });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(loginInfo);
        axios
            .post(`${process.env.REACT_APP_HOST}/auth/login`, loginInfo)
            .then((res) => {
                console.log(res);
                const { accessToken, refreshToken, tokenType, expiryDuration } = res.data;
                console.log(accessToken);
                console.log(refreshToken);
                console.log(tokenType);
                console.log(expiryDuration);

                // 로그인에 성공하면 토큰 정보가 나오는데 해당 정보를 tokenInfoSlice에 저장해서 전역 변수로 사용한다.
                dispath(setTokenInfo(res.data));

                console.log(res.data);
                axios
                    .get(`${process.env.REACT_APP_HOST}/user/me`, {
                        headers: {
                            Authorization: `${tokenType}${accessToken}`,
                        },
                    })
                    .then((res) => {
                        console.log(res);
                        if (res) {
                            dispath(setUserInfo(res.data));
                            localStorage.setItem("userInfo", JSON.stringify(res.data)); // localStorage에 사용자 정보 저장
                            navigate("/"); // 메인 페이지로 이동
                        }
                    })
                    .catch((err) => {
                        Swal.fire({
                            title: "로그인 오류",
                            text: "토큰 정보가 올바르지 않습니다.",
                            icon: "error",
                        });
                    });
            })
            .catch((err) => {
                Swal.fire({
                    title: "로그인 오류",
                    text: "아이디 또는 비밀번호를 확인하세요.",
                    icon: "error",
                });
            });
    };
    const findidgo = () => {
        navigate("/user/findID");
    };
    const findpwgo = () => {
        navigate("/user/findPassword");
    };

    return (
        <main>
            <Form className="loginContainer" onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label></Form.Label>
                    <Form.Control type="text" placeholder="아이디를 입력하세요." onChange={onChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label></Form.Label>
                    <Form.Control type="password" placeholder="비밀번호를 입력하세요." onChange={onChange} />
                </Form.Group>
                <div className="button-container">
                    <Button type="button" onClick={findidgo} className="find-button">
                        아이디 찾기
                    </Button>
                    <Button type="button" onClick={findpwgo} className="find-button">
                        비밀번호 찾기
                    </Button>
                </div>
                <Button type="submit" className="login-button">
                    로그인
                </Button>
            </Form>
        </main>
    );
};
export default Login;
