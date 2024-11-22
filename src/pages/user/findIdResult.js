import React from "react";
import { useLocation } from "react-router-dom"; // useLocation import

const FindIdResult = () => {
  const location = useLocation(); // 현재 위치 정보 받기
  const { cause } = location.state || {}; // state에서 cause 받기

  return (
    <div>
      <h2>아이디 찾기 결과</h2>
      {cause ? (
        <p>회원님의 아이디는 {cause} 입니다.</p>
      ) : (
        <p>아이디를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default FindIdResult;
