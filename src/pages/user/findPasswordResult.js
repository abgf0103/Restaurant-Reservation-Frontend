import React from "react";
import { useLocation } from "react-router-dom"; // useLocation import

const FindPasswordResult = () => {
  const location = useLocation(); // 현재 위치 정보 받기
  const { message } = location.state || {}; // state에서 message 받기

  return (
    <div>
      <h2>임시 비밀번호 찾기 결과</h2>
      <p>{message}</p> {/* 서버에서 받은 메시지를 출력 */}
      <h1>임시 비밀번호를 복사해주세요</h1>
    </div>
  );
};

export default FindPasswordResult;
