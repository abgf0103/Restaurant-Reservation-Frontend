import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokenInfo } from "../../hooks/tokenSlice";
import { getUserInfo, setUserInfo } from "../../hooks/userSlice";
import "./css/login.css";

const Login = () => {
  // 페이지 이동 함수
  const navigate = useNavigate();
  // 저장소에 저장하는 변수
  const dispatch = useDispatch();

  // 로컬 스토리지에서 아이디 불러오기 (기존에 저장된 아이디가 있다면)
  const savedUsername = localStorage.getItem("username") || "";

  const [loginInfo, setLoginInfo] = useState({
    username: savedUsername, // 초기값을 로컬 스토리지에서 불러온 아이디로 설정
    password: "111",
    deviceInfo: {
      deviceId: "2",
      deviceType: "DEVICE_TYPE_WINDOWS",
      notificationToken: "111",
    },
  });

  const [isSaveChecked, setIsSaveChecked] = useState(savedUsername !== ""); // 아이디가 저장되어 있으면 체크박스를 체크 상태로 설정

  // form의 변경이 일어나면...
  const onChange = (e) => {
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

  // 아이디 저장 체크박스 변경 시 동작
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsSaveChecked(isChecked);
    console.log(isChecked);

    if (isChecked) {
      // 체크박스를 체크하면 로컬 스토리지에 아이디 저장
      localStorage.setItem("username", loginInfo.username);
    } else {
      // 체크박스를 해제하면 로컬 스토리지에서 아이디 삭제
      localStorage.removeItem("username");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_HOST}/auth/login`, loginInfo)
      .then((res) => {
        console.log(res);
        const { accessToken, refreshToken, tokenType, expiryDuration } =
          res.data;
        console.log(accessToken);
        console.log(refreshToken);
        console.log(tokenType);
        console.log(expiryDuration);

        // 로그인에 성공하면 토큰 정보가 나오는데 해당 정보를 tokenInfoSlice에 저장해서 전역 변수로 사용한다.
        dispatch(setTokenInfo(res.data));

        axios
          .get(`${process.env.REACT_APP_HOST}/user/me`, {
            headers: {
              Authorization: `${tokenType}${accessToken}`,
            },
          })

          .then((res) => {
            if (res) {
              console.log(res.data.active);
              dispatch(setUserInfo(res.data));
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
    <div className="login-maincover">
      <Form className="login-container" onSubmit={onSubmit}>
        <h3>Login</h3>
        <hr />
        <Form.Group className="mb-3" controlId="username">
          <Form.Control
            type="text"
            placeholder="아이디를 입력하세요."
            value={loginInfo.username} // 입력 필드에 로컬 스토리지에서 불러온 아이디를 표시
            onChange={onChange}
            className="login-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Control
            type="password"
            placeholder="비밀번호를 입력하세요."
            onChange={onChange}
            className="login-input"
          />
        </Form.Group>

        {/* 아이디 저장 체크박스 */}
        <Form.Group controlId="saveUsername" className="mb-3">
          <Form.Check
            type="checkbox"
            label="아이디 저장하기"
            checked={isSaveChecked}
            onChange={handleCheckboxChange}
          />
        </Form.Group>
        <Button type="submit" className="login-button">
          로그인
        </Button>
        <div className="button-container1">
          <span type="button" onClick={findidgo} className="find-button">
            아이디 찾기
          </span>
          <span type="button" onClick={findpwgo} className="find-button">
            비밀번호 찾기
          </span>
        </div>
      </Form>
    </div>
  );
};

export default Login;
