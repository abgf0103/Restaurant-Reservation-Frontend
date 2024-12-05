import styled from "styled-components";
import { Container, Button, Form } from "react-bootstrap";

// 제목 스타일
export const ReviewEditTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color-black);
  margin-bottom: 50px; /* 제목과 아래 요소들 간의 여백 제거 */
  padding: 40px 0px;
  border-bottom: 3px solid var(--primary-color); /* 제목 아래에 세련된 밑줄 추가 */

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    font-size: 1.8rem; /* 모바일에서 폰트 크기 약간 감소 */
  }
`;

// 제목에 있는 사용자 이름
export const Username = styled.span`
  color: var(--primary-color); /* 사용자 이름을 기본 색상으로 강조 */
  font-size: 2rem; /* 사용자 이름만 조금 더 크게 */
  font-weight: bold;
  background: linear-gradient(
    135deg,
    var(--tertiary-color),
    /* 다른 그라데이션 색상 */ var(--quaternary-color) /* 또 다른 보조 색상 */
  );
  -webkit-background-clip: text; /* 그라데이션 텍스트로 적용 */
  color: transparent; /* 텍스트 색상을 투명하게 해서 그라데이션이 보이도록 */
`;

// 제목에 있는 가게 이름
export const StoreName = styled.span`
  color: var(--text-color-gray); /* 가게 이름을 기본 색상으로 강조 */
  font-size: 2rem; /* 가게 이름을 좀 더 크게 */
  font-weight: bold;
`;

// 프로필 이미지 스타일링
export const ProfileImage = styled.div`
  display: flex;
  align-items: center; /* 세로 가운데 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */

  img {
    width: 80px; /* 이미지 크기 */
    height: 80px;
    border-radius: 50%; /* 원형 이미지 */
    margin-right: 15px; /* 이미지와 텍스트 사이의 간격 */
    border: 2px solid var(--primary-color);
  }

  /* 반응형 디자인 */
  @media (max-width: 768px) {
    padding: 0 10px; /* 모바일에서는 좌우 패딩을 좀 더 적게 */
  }
`;

export const ReveiwContainer = styled(Container)`
  padding: 50px 0; /* 충분한 여백을 주어 화면 중앙 정렬 */
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
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;

  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid var(--primary-color); /* 이미지 테두리 색상 */
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

export const DivStar = styled.div`
  display: flex;
  justify-content: left;
  align-items: center; /* 세로 중앙정렬 */
  gap: 20px; /* 별들 간의 간격을 설정 */
`;
