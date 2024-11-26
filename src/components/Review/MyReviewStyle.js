import styled from "styled-components";
import { Card, Button, Container, ListGroup, Row } from "react-bootstrap";

// 전체 페이지 컨테이너 스타일
export const MyReviewContainer = styled(Container)`
  padding: 50px 0; /* 충분한 여백을 주어 화면 중앙 정렬 */
  background-color: var(--background-color);
  @media (max-width: 768px) {
    padding: 30px 0;
  }
`;

// 카드 컴포넌트 스타일
export const ReviewCard = styled(Card)`
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  background-color: var(--background-color); /* 배경색 설정 */

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px); /* hover 시 카드가 약간 위로 올라오는 효과 */
  }

  .card-title {
    color: var(--text-color-black); /* 텍스트 색상 */
    font-size: 1.25rem;
  }

  .card-text {
    color: var(--text-color-gray); /* 리뷰 본문 텍스트 색상 */
    font-size: 1rem;
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

// 리뷰 페이지 제목 스타일
export const Title = styled.h2`
  text-align: center;
  color: var(--text-color-black);
  margin-bottom: 30px;
`;

// 리뷰를 감싸는 행(Row) 스타일
export const ReviewRow = styled(Row)`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
`;

// 카드 텍스트 스타일
export const CardText = styled(Card.Text)`
  font-size: 14px;
  color: var(--text-color-gray);
`;

// 리스트 그룹 안의 각 항목 스타일
export const ListGroupItem = styled(ListGroup.Item)`
  font-size: 14px;
  padding: 10px;
  background-color: var(--background-color);
  color: var(--text-color-gray);
`;
