import styled from "styled-components";
import { Card, Container, ListGroup, Row, Col } from "react-bootstrap";

// 전체 페이지 컨테이너 스타일
export const UserReviewPageContainer = styled(Container)`
  padding: 50px 0; /* 충분한 여백을 주어 화면 중앙 정렬 */
  background-color: var(--background-color);
  @media (max-width: 768px) {
    padding: 30px 0;
  }
`;

// 카드 컴포넌트 스타일
export const UserReviewCard = styled(Card)`
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  background-color: var(--background-color); /* 배경색 설정 */
  display: flex;
  flex-direction: column; /* 카드 내용이 수직으로 배치되도록 설정 */
  width: 100%; /* 너비는 100%로 설정하여 일정하게 유지 */

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
export const UserReviewImage = styled.div`
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

// 리뷰 페이지 제목 스타일
export const UserReviewTitle = styled.h2`
  text-align: center;
  color: var(--text-color-black);
  margin-bottom: 30px;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

// 리스트 그룹 항목 스타일 (별점 등)
export const ListGroupItem = styled(ListGroup.Item)`
  font-size: 1rem;
  padding: 12px;
  background-color: var(--background-color);
  color: var(--text-color-black);
  border: none; /* 기본 border 제거 */
  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;

// 리뷰를 감싸는 행(Row) 스타일
export const UserReviewRow = styled(Row)`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

// 리뷰를 감싸는 컬럼 스타일
export const UserReviewCol = styled(Col)`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex: 0 0 100%; /* 작은 화면에서는 1개씩 */
  }

  @media (min-width: 768px) {
    flex: 0 0 50%; /* 중간 화면 이상에서는 2개씩 */
  }

  @media (min-width: 992px) {
    flex: 0 0 33.33%; /* 더 큰 화면에서는 3개씩 */
  }
`;

// 파일 유무에 따라 높이를 자동으로 조정할 수 있도록 설정
export const UserReviewCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: auto; /* 높이를 고정하지 않고 내용에 따라 늘어나도록 설정 */
  justify-content: space-between;
  padding-bottom: 10px;
`;
