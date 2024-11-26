import styled from "styled-components";
import { Container, Button, Form } from "react-bootstrap";

export const ReveiwContainer = styled(Container)`
  padding: 50px 0; /* 충분한 여백을 주어 화면 중앙 정렬 */
  background-color: var(--background-color);
  @media (max-width: 768px) {
    padding: 30px 0;
  }
`;

export const H1 = styled.h1`
  font-size: 2.2rem;
  color: var(--text-color-black);
  font-weight: bold;
  margin-bottom: 30px; /* 제목과 폼 간 간격 */
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

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
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 10px;
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
