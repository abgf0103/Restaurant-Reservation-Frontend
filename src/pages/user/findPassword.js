//비밀번호 찾기 페이지

import React, { useState } from "react";
import instance from "../../api/instance"; // 커스텀 axios 인스턴스를 임포트

const FindPasswordForm = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 아이디 입력 처리
  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  // 이름 입력 처리
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // 이메일 입력 처리
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id || !name || !email) {
      setMessage("아이디, 이름, 이메일을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 서버에 아이디, 이름, 이메일을 전달하여 유효성 검사
      const response = await instance.post("/member/user/findPassword", {
        id,
        name,
        email,
      });

      if (response.data.success) {
        setMessage("임시 비밀번호가 이메일로 발송되었습니다.");
      } else {
        setMessage("입력한 정보가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error(error);
      setMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="id"
          value={id}
          onChange={handleIdChange}
          placeholder="아이디를 입력하세요"
        />
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          placeholder="이름을 입력하세요"
        />
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="이메일을 입력하세요"
        />
        <button type="submit" disabled={loading}>
          {loading ? "로딩 중..." : "비밀번호 찾기"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FindPasswordForm;
