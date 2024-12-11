import styled from "styled-components";
import { Container, Button, Form } from "react-bootstrap";

// 제목 스타일
export const ReviewEditTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color-black);
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 3px solid var(--primary-color); /* 제목 아래에 세련된 밑줄 추가 */

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    font-size: 1.5rem; /* 모바일에서 폰트 크기 약간 감소 */
    margin-bottom: 20px;
    padding-bottom: 20px;
  }
`;

// 제목에 있는 사용자 이름
export const Name = styled.span`
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

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    font-size: 1.5rem; /* 모바일에서 폰트 크기 약간 감소 */
  }
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

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    flex-direction: column; /* 모바일에서 세로로 배치 */
    align-items: center;
  }
`;

// 제목에 있는 가게 이름
export const StoreName = styled.span`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;

  /* 그라데이션 적용 */
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--text-color-gray)
  );
  -webkit-background-clip: text;
  color: transparent;

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    font-size: 1.5rem; /* 모바일에서 폰트 크기 약간 감소 */
  }
`;

export const ReveiwContainer = styled(Container)`
  padding: 50px; /* 충분한 여백을 주어 화면 중앙 정렬 */
  padding-bottom: 200px;
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
  padding-top: 0px;
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

  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid var(--primary-color); /* 이미지 테두리 색상 */

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

export const FileUploadButton = styled(Button)`
  background-color: var(--primary-color); /* 기본 버튼 색상 */
  color: var(--text-color-white);
  font-size: 1rem; /* 버튼 크기 조정 */
  padding: 8px 20px; /* 패딩 조정 */
  border-radius: 10px;
  border: none;

  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: var(--secondary-color); /* 호버 시 색상 */
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 767px) {
    font-size: 0.9rem;
    padding: 8px 15px; /* 모바일에서 패딩 크기 더 줄이기 */
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

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    margin-bottom: 15px; /* 모바일에서 간격 약간 축소 */
  }
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

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px;
  }
`;

// Review Comment Section
export const ReviewCommentFormGroup = styled(Form.Group)`
  margin-bottom: 30px; /* 리뷰 작성 필드 간 간격 */

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    margin-bottom: 20px; /* 모바일에서 간격 약간 축소 */
  }
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

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    font-size: 0.9rem;
    height: 120px; /* 모바일에서 높이 조정 */
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

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    gap: 10px; /* 모바일에서 별 간격 좁힘 */
  }
`;
