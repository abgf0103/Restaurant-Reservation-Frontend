import styled from "styled-components";
import { Card, Container, ListGroup, Row } from "react-bootstrap";

// 제목 스타일
export const UserReviewTitle = styled.h2`
  text-align: center;
  color: var(--text-color-white); /* 텍스트 색상을 흰색으로 */
  font-size: 2.5rem; /* 더 큰 폰트 크기 */
  font-weight: bold; /* 두꺼운 글씨 */
  margin-bottom: 30px;
  padding: 20px 0;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  ); /* 기본 색상과 보조 색상 그라데이션 */
  border-radius: 10px; /* 둥근 모서리 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* 텍스트 그림자 */
  position: relative;
  z-index: 1;

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    font-size: 2rem; /* 모바일에서는 폰트 크기를 조금 더 작게 */
    padding: 15px 0;
  }
`;

// 제목에 있는 사용자 이름
export const Username = styled.span`
  color: var(--primary-color); /* 사용자 이름을 기본 색상으로 강조 */
  font-size: 2.8rem; /* 사용자 이름만 조금 더 크게 */
  font-weight: bold;
  background: linear-gradient(
    135deg,
    var(--tertiary-color),
    var(--quaternary-color)
  ); /* 배경에 다른 그라데이션 적용 */
  -webkit-background-clip: text; /* 그라데이션 텍스트로 적용 */
  color: transparent; /* 텍스트 색상을 투명하게 해서 그라데이션이 보이도록 */
`;

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
  width: 100%;
  justify-content: space-between;
  margin-bottom: 1rem;
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
export const UserReviewImage = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 이미지를 가로로 가운데 정렬 */
  align-items: center; /* 이미지를 세로로 가운데 정렬 */
  gap: 10px;
  padding: 1rem;

  img {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid var(--tertiary-color); /* 이미지 테두리 색상 */
  }
`;

// 카드 제목 스타일
export const MiniTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: var(--text-color-black);
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
  color: var(--text-color-black);
`;
