import styled from "styled-components";
import { Card, Container, ListGroup, Row } from "react-bootstrap";

// 제목 스타일
export const UserReviewTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color-black);
  margin-bottom: 30px;
  border-bottom: 3px solid var(--primary-color); /* 제목 아래에 세련된 밑줄 추가 */

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    font-size: 1.8rem; /* 모바일에서 폰트 크기 약간 감소 */
  }
`;

// 제목에 있는 사용자 이름
export const Username = styled.span`
  color: var(--primary-color);
  font-size: 1.8rem;
  font-weight: 600;
  display: block;
  margin-top: 10px;

  /* 그라데이션 적용 */
  background: linear-gradient(
    135deg,
    var(--tertiary-color),
    var(--quaternary-color)
  );
  -webkit-background-clip: text;
  color: transparent;
`;

// 프로필 이미지 스타일링
export const ProfileImage = styled.div`
  display: flex;
  align-items: center; /* 가로로 배치 */
  justify-content: flex-start;
  gap: 20px; /* 프로필 이미지와 텍스트 간 간격 */
  padding: 20px 0;
  position: relative; /* 정보 아이콘을 우측 상단에 배치하기 위한 설정 */

  img {
    width: 100px; /* 프로필 이미지 크기 */
    height: 100px;
    border-radius: 50%;
    border: 2px solid var(--primary-color); /* 이미지에 테두리 추가 */
    object-fit: cover;
  }

  /* 유저네임 */
  ${Username} {
    margin-top: 0;
    display: inline-block;
  }
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
