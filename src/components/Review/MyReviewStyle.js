import styled from "styled-components";
import { Card, Button } from "react-bootstrap";

// 카드 컴포넌트 스타일
export const ReviewCard = styled(Card)`
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  background-color: var(--background-color); /* 배경색 */

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .card-title {
    color: var(--text-color-black); /* 텍스트 색상 */
  }

  .card-text {
    color: var(--text-color-gray); /* 텍스트 색상 */
  }
`;

// 파일 이미지 섹션 스타일
export const ReviewImage = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid var(--tertiary-color); /* 이미지 테두리 색상 */
  }
`;

// 버튼 섹션 스타일
export const ReviewButtons = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: space-between;

  button {
    width: 48%;
    font-size: 1rem;
    padding: 10px;
  }
`;
export const ButtonDelete = styled(Button)`
  background-color: var(--primary-color); /* 삭제 버튼 색상 */
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

export const ButtonEdit = styled(Button)`
  background-color: var(--primary-color); /* 수정 버튼 색상 */
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
