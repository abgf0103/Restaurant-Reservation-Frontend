import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom"; // useLocation import
import { Button, Form, Container, Alert } from "react-bootstrap"; // react-bootstrap 컴포넌트 임포트
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy as faCopySolid } from "@fortawesome/free-solid-svg-icons"; // solid 아이콘 임포트
import { faCopy as faCopyRegular } from "@fortawesome/free-regular-svg-icons"; // regular 아이콘 임포트

const FindPasswordResult = () => {
  const location = useLocation(); // 현재 위치 정보 받기
  const { message } = location.state || {}; // state에서 message 받기

  const copyTxtRef = useRef(null); // useRef를 컴포넌트 레벨에서 선언
  const [isCopied, setIsCopied] = useState(false); // 복사 여부를 저장할 상태
  const [copyMessage, setCopyMessage] = useState(""); // 복사 성공 메시지를 저장할 상태

  const copy = () => {
    const copyTxt = copyTxtRef.current;

    // 텍스트 선택
    copyTxt.select();
    copyTxt.setSelectionRange(0, 99999); // 모바일 대응

    // 클립보드에 텍스트 복사
    navigator.clipboard
      .writeText(copyTxt.value)
      .then(() => {
        setIsCopied(true); // 복사 성공 시 아이콘 변경
        setCopyMessage("임시 비밀번호가 복사되었습니다!"); // 복사 성공 메시지 설정

        // 2초 후에 복사 메시지 초기화
        setTimeout(() => {
          setCopyMessage("");
        }, 2000);
      })
      .catch((err) => {
        console.error("복사 실패", err);
        setCopyMessage("복사 실패. 다시 시도해 주세요.");
      });
  };

  return (
    <Container className="find-pw-result-container">
      {message ? (
        <>
          <div className="find-pw-box">
            {" "}
            {/* d-flex로 수평 배치 */}
            <Form.Group controlId="resultMessage" className="flex-grow-1">
              {" "}
              {/* Form.Control 크기 조정 */}
              <Form.Label>
                <h5>임시 비밀번호</h5>
              </Form.Label>
              <Form.Control
                as="textarea"
                ref={copyTxtRef} // ref 연결
                value={message} // 복사할 메시지 설정
                readOnly // 읽기 전용
                rows={4} // 행 크기 조절
                style={{ resize: "none" }} // 크기 조절 비활성화
                className="find-pw-text"
              ></Form.Control>
              <FontAwesomeIcon
                className="copy-icon ms-2" // ms-2로 아이콘과 텍스트 간격 조정
                icon={isCopied ? faCopyRegular : faCopySolid}
                onClick={copy}
                style={{ cursor: "pointer" }} // 아이콘 클릭 시 포인터 모양
                size="3x" // 크기 조정
              />
            </Form.Group>
            {/* 아이콘을 클릭했을 때 복사 여부에 따라 아이콘 변경 */}
          </div>

          {/* 복사 성공 메시지 */}
          {copyMessage && (
            <Alert variant="success" className="mt-3">
              {copyMessage}
            </Alert>
          )}
        </>
      ) : (
        <Alert variant="warning" className="mt-3">
          <p>임시 비밀번호를 찾을 수 없습니다. 다시 시도해 주세요.</p>
        </Alert>
      )}
    </Container>
  );
};

export default FindPasswordResult;
