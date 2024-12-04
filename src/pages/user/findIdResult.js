import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation import
import "./css/findIdResult.css";
import { Button } from "react-bootstrap";

const FindIdResult = () => {
  const location = useLocation(); // 현재 위치 정보 받기
  const { cause } = location.state || {}; // state에서 cause 받기
  const navigate = useNavigate();

  // 아이디의 앞 4자리를 보이고 나머지는 *로 가리는 함수
  const maskId = (id) => {
    if (id && id.length > 4) {
      const firstPart = id.substring(0, 4); // 첫 4자리
      const maskedPart = "*".repeat(id.length - 4); // 나머지 부분을 *로 가리기
      return `${firstPart}${maskedPart}`; // 첫 4자리 + *로 가려진 나머지
    }
    return id; // 아이디 길이가 4자리 이하일 경우 그대로 반환
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
