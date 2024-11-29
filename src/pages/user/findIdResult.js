import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation import
import "./css/findIdResult.css";
import { Button } from "react-bootstrap";

const FindIdResult = () => {
  const location = useLocation(); // 현재 위치 정보 받기
  const { cause } = location.state || {}; // state에서 cause 받기
  const navigate = useNavigate();

  // 아이디의 맨 앞글자와 맨 뒷글자를 *로 감추는 함수
  const maskId = (id) => {
    if (id && id.length > 2) {
      const firstChar = id.charAt(0); // 첫 문자
      const lastChar = id.charAt(id.length - 1); // 마지막 문자
      const middleChars = id.substring(1, id.length - 1); // 중간 문자들
      return `${firstChar}***${lastChar}`; // 첫 문자, *** 중간 문자들, 마지막 문자
    }
    return id; // 아이디 길이가 2 이하일 경우 그대로 반환
  };
  const goFindPW = () => {
    navigate("/user/findPassword");
  };
  const goLogin = () => {
    navigate("/user/login");
  };

  return (
    <main className="id-result-main">
      <div className="id-result-cover">
        <h4 className="id-result-h4">
          <span className="id-result-text">회원님의 아이디를 확인해주세요</span>
        </h4>
        <hr />

        {cause ? (
          <p>
            회원님의 아이디는 <span className="id-cause">{maskId(cause)}</span>{" "}
            입니다.
          </p>
        ) : (
          <p>아이디를 찾을 수 없습니다.</p>
        )}

        <Button type="button" className="find-result-btn" onClick={goLogin}>
          로그인하기
        </Button>
        <Button type="button" className="find-result-btn" onClick={goFindPW}>
          비밀번호 찾기
        </Button>
      </div>
    </main>
  );
};

export default FindIdResult;
