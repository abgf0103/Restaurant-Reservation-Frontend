import React, { useState } from "react";
import axios from "axios";
import instance from "../../api/instance";

function FindPassword() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

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
          사용자 이름:
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
      <h2>결과</h2>
      {message && <p>{message}</p>} {/* 임시 비밀번호 또는 오류 메시지 출력 */}
    </div>
  );
}

export default FindPassword;
