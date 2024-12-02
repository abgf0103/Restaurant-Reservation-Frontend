import styled from "styled-components";
import { Card, Button, Container, ListGroup } from "react-bootstrap";

// 제목 스타일
export const MyReviewTitle = styled.h2`
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

// 정보 표시 아이콘 컴포넌트
export const InfoIcon = styled.div`
  font-size: 24px; /* 아이콘 크기 */
  color: var(--primary-color); /* 기본 색상 */
  cursor: pointer; /* 클릭 가능 표시 */
  margin-bottom: 10px; /* 아이콘 아래 마진 추가 */
  transition: color 0.3s ease, transform 0.3s ease; /* hover 효과 및 변환 애니메이션 */

  &:hover {
    color: var(--secondary-color); /* hover 시 색상 변경 */
    transform: scale(1.1); /* hover 시 아이콘 크기 확대 */
  }

  &:focus {
    outline: none; /* focus 시 outline 없애기 */
  }
`;

// 정보 아이콘 배치 컴포넌트
export const InfoContainer = styled.div`
  display: flex;
  align-items: center; /* 세로 가운데 정렬 */
  gap: 15px; /* 아이콘 간격 설정 */
  padding-left: 0; /* 왼쪽 여백 없애기 */
  margin-left: 0; /* 왼쪽 여백 없애기 */
`;

// WLSum 스타일 수정
export const WLSum = styled.h2`
  color: var(--text-color-black);
  padding-left: 20px;
  margin-bottom: 30px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 30px;

  span {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-color-black); /* 기본 텍스트 색상 설정 */

    svg {
      font-size: 1.2rem; /* 아이콘 크기 설정 */
      color: var(--icon-color); /* 기본 아이콘 색상 설정 */
    }

    /* 펜 아이콘 색상 */
    &:nth-child(1) svg {
      color: var(--primary-color); /* 펜 아이콘에 기본 색상 추가 */
    }
    /* 하트 아이콘 색상 */
    &:nth-child(2) svg {
      color: var(--primaryHober-color); /* 하트 아이콘에 기본 색상 추가 */
    }
    /* 트로피 아이콘 색상 */
    &:nth-child(3) svg {
      color: var(--tertiary-color); /* 트로피 아이콘에 밝은 색상 추가 */
    }
  }
`;

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
export const ReviewImage = styled.div`
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

// 버튼 섹션 스타일
export const ReviewButtons = styled.div`
  margin-top: 0.5rem;
  display: flex;
  padding: 1rem;
  justify-content: space-between;

  button {
    width: 48%;
    font-size: 1rem;
    padding: 10px;
  }
`;

export const ButtonDelete = styled(Button)`
  background-color: var(--primary-color);
  color: var(--text-color-white);
  font-size: 1.1rem;
  padding: 12px 30px;
  border-radius: 10px;
  border: none;
  width: 100%;
  transition: background-color 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--secondary-color);
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
  background-color: var(--primary-color);
  color: var(--text-color-white);
  font-size: 1.1rem;
  padding: 12px 30px;
  border-radius: 10px;
  border: none;
  width: 100%;
  transition: background-color 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--secondary-color);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 767px) {
    font-size: 1rem;
    padding: 10px 25px;
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
