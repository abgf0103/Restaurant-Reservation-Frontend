import styled from "styled-components";
import { Card, Button } from "react-bootstrap";

// 전체 페이지 컨테이너 스타일
export const PageContainer = styled.div`
  padding: 20px;
  background-color: var(--background-color);
`;

// 페이지 헤더 스타일
export const Header = styled.h2`
  color: var(--text-color-black);
  text-align: center;
  margin-bottom: 20px;
`;

// 리뷰 카드 컴포넌트 스타일
export const ReviewCard = styled(Card)`
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

// 파일 이미지 섹션 스타일
export const FileImage = styled.div`
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
