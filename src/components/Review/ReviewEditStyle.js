import styled from "styled-components";
import { Container, Button, Form } from "react-bootstrap";

// 제목 스타일
export const ReviewEditTitle = styled.h2`
  text-align: center;
  color: var(--text-color-white); /* 텍스트 색상을 흰색으로 */
  font-size: 1.8rem; /* 더 큰 폰트 크기 */
  font-weight: bold; /* 두꺼운 글씨 */
  margin-bottom: 30px;
  padding: 20px 0;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    /* 기본 색상 */ var(--secondary-color) /* 보조 색상 */
  );
  border-radius: 10px; /* 둥근 모서리 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* 텍스트 그림자 */
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2rem; /* 모바일에서는 폰트 크기를 조금 더 작게 */
    padding: 15px 0;
  }
`;

// 제목에 있는 사용자 이름
export const Username = styled.span`
  color: var(--primary-color); /* 사용자 이름을 기본 색상으로 강조 */
  font-size: 2rem; /* 사용자 이름만 조금 더 크게 */
  font-weight: bold;
  background: linear-gradient(
    135deg,
    var(--tertiary-color),
    /* 다른 그라데이션 색상 */ var(--quaternary-color) /* 또 다른 보조 색상 */
  );
  -webkit-background-clip: text; /* 그라데이션 텍스트로 적용 */
  color: transparent; /* 텍스트 색상을 투명하게 해서 그라데이션이 보이도록 */
`;

// 제목에 있는 가게 이름
export const StoreName = styled.span`
  color: var(--text-color-black); /* 가게 이름을 기본 색상으로 강조 */
  font-size: 2rem; /* 가게 이름을 좀 더 크게 */
  font-weight: bold;
`;

export const ReveiwContainer = styled(Container)`
  padding: 50px 0; /* 충분한 여백을 주어 화면 중앙 정렬 */
  background-color: var(--background-color);
  @media (max-width: 768px) {
    padding: 30px 0;
  }
`;

// 리뷰 수정 버튼
export const SubmitButton = styled(Button)`
  background-color: var(--primary-color); /* 기본 버튼 색상 */
  color: var(--text-color-white);
  font-size: 1.1rem;
  padding: 12px 30px;
  border-radius: 10px;
  border: none;
  width: 100%;
  transition: background-color 0.3s;
  cursor: pointer;
  &:hover {
    background-color: var(--secondary-color); /* 호버 시 색상 */
  }
  &:focus {
    outline: none;
  }
  @media (max-width: 767px) {
    font-size: 1rem;
    padding: 10px 25px;
  }
`;

export const FileUploadSection = styled.div`
  margin-top: 40px;
  border-top: 2px solid var(--tertiary-color);
  padding-top: 20px;
`;

export const FileList = styled.div`
  margin-top: 30px;
`;

export const FileItem = styled.div`
  display: inline-block;
  margin-right: 20px;
  position: relative;
  text-align: center;
  margin-bottom: 20px;
`;

export const FileImage = styled.img`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;

  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid var(--tertiary-color); /* 이미지 테두리 색상 */
`;

export const FileUploadButton = styled(Button)`
  background-color: var(--primary-color); /* 기본 버튼 색상 */
  color: var(--text-color-white);
  font-size: 1.1rem;
  padding: 12px 30px;
  border-radius: 10px;
  border: none;
  width: 100%;
  transition: background-color 0.3s;
  cursor: pointer;
  &:hover {
    background-color: var(--secondary-color); /* 호버 시 색상 */
  }
  &:focus {
    outline: none;
  }
  @media (max-width: 767px) {
    font-size: 1rem;
    padding: 10px 25px;
  }
`;

export const DeleteFileButton = styled(Button)`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: var(--primary-color); /* 삭제 버튼 기본 색상 */
  color: var(--text-color-white);
  font-size: 0.9rem;
  border-radius: 50%;
  border: none;
  padding: 8px;
  transition: background-color 0.3s;
  &:hover {
    background-color: var(--secondary-color); /* 호버 시 색상 */
  }
  &:focus {
    outline: none;
  }
`;

// Rating Input Section
export const RatingFormGroup = styled(Form.Group)`
  margin-bottom: 20px; /* 각 입력 요소 간 간격 */
`;

export const RatingLabel = styled(Form.Label)`
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-color-black);
  margin-bottom: 10px;
`;

export const RatingInput = styled(Form.Control)`
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid var(--primary-color);
  &:hover {
    border-color: var(--secondary-color);
  }
  &:focus {
    outline: none;
    border-color: var(--tertiary-color);
    box-shadow: none; /* 기존의 포커스 효과 (박스 그림자) 제거 */
  }
`;

// Review Comment Section
export const ReviewCommentFormGroup = styled(Form.Group)`
  margin-bottom: 30px; /* 리뷰 작성 필드 간 간격 */
`;

export const ReviewCommentLabel = styled(Form.Label)`
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-color-black);
  margin-bottom: 10px;
`;

export const ReviewCommentTextArea = styled(Form.Control)`
  height: 150px;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid var(--primary-color);
  &:hover {
    border-color: var(--secondary-color);
  }
  &:focus {
    outline: none;
    border-color: var(--tertiary-color);
    box-shadow: none; /* 기존의 포커스 효과 (박스 그림자) 제거 */
  }
`;

export const FileLibel = styled(Form.Label)`
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-color-black);
  margin-bottom: 10px;
`;

export const DivStar = styled.div`
  display: flex;
  justify-content: left;
  align-items: center; /* 세로 중앙정렬 */
  gap: 20px; /* 별들 간의 간격을 설정 */
`;
