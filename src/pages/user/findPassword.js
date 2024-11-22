import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import instance from "../../api/instance"; // 커스텀 axios 인스턴스를 임포트

function FindPassword() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // navigate 함수

  // 폼 제출 처리
  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      email: email,
      username: username,
      name: name,
    };

    try {
      // 서버에 POST 요청을 보내 임시 비밀번호 생성
      const response = await instance.post(
        "/member/user/findPassword",
        requestData
      );

      console.log(response.data);

      setMessage(response.data.message); // 응답 메시지 설정

      // 결과 페이지로 이동하며 message 전달
      navigate("/user/findPasswordResult", {
        state: { message: response.data.message },
      });
    } catch (error) {
      console.error("Error fetching temp password:", error);
      setMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <h1>임시 비밀번호 찾기</h1>
      <form onSubmit={handleSubmit}>
        <label>
          이메일:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          아이디:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          이름:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">임시 비밀번호 찾기</button>
      </form>
    </div>
  );
}

export default FindPassword;
