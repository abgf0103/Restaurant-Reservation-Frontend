import React, { useRef } from "react";
import { useLocation } from "react-router-dom"; // useLocation import
import "./css/findPasswordResult.css";

const FindPasswordResult = () => {
  const location = useLocation(); // 현재 위치 정보 받기
  const { message } = location.state || {}; // state에서 message 받기

  const copyTxtRef = useRef(null); // useRef를 컴포넌트 레벨에서 선언

  const copy = () => {
    const copyTxt = copyTxtRef.current;

    // 텍스트 선택
    copyTxt.select();
    copyTxt.setSelectionRange(0, 99999); // 모바일 대응

    // 클립보드에 텍스트 복사
    navigator.clipboard
      .writeText(copyTxt.value)
      .then(() => {
        alert("복사되었습니다");
      })
      .catch((err) => {
        console.error("복사 실패", err);
        alert("복사 실패");
      });
  };

  return (
    <div className="cover">
      <h2>임시 비밀번호 찾기 결과</h2>
      <textarea
        ref={copyTxtRef} // ref 연결
        value={message} // 복사할 메시지 설정
        readOnly // 읽기 전용
      />
      <button onClick={copy}>복사하기</button>
    </div>
  );
};

export default FindPasswordResult;
