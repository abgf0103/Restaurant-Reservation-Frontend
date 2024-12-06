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
    font-size: 1.5rem; /* 모바일에서 폰트 크기 약간 감소 */
  }
`;

// 제목에 있는 사용자 이름
export const Name = styled.span`
  font-size: 1.8rem;
  font-weight: 600;
  display: block;
  margin-top: 10px;

  /* 그라데이션 적용 */
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--tertiary-color)
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
  ${Name} {
    margin-top: 0;
    display: inline-block;
  }
`;

// 정보 아이콘 배치 (세련되게 아이콘을 옆에 배치)
export const InfoIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  font-size: 30px;
  color: var(--primary-color);

  &:hover {
    color: var(--secondary-color);
    transform: scale(1.1); /* 마우스 오버 시 확대 효과 */
  }

  &:focus {
    outline: none;
  }
`;

// 정보 표시 아이콘 컴포넌트
export const InfoIcon = styled.div`
  font-size: 30px;
  color: var(--primary-color);
  cursor: pointer;
  margin-bottom: 10px;
  transition: color 0.3s ease, transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: var(--secondary-color);
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
`;

// WLSum 스타일 수정 (WLSum과 InfoIcon을 같은 줄에 배치)
export const WLSumContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px; /* 제목과 WLSum 사이에 여백 추가 */
  font-size: 1.2rem;
  color: var(--text-color-black);
`;

// WLSum 아이템 스타일
export const WLSumItem = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    font-size: 1.5rem;
    color: var(--primary-color);
  }

  /* 각 아이템에 색상을 다르게 적용 */
  &:nth-child(1) svg {
    color: var(--primary-color);
  }

  &:nth-child(2) svg {
    color: var(--secondary-color);
  }

  &:nth-child(3) svg {
    color: var(--tertiary-color);
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
