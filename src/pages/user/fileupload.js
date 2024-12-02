import React, { useState } from "react";
import instance from "./../../api/instance"; // API 호출을 위한 instance import
import Swal from "sweetalert2";
import { Button } from "react-bootstrap"; // Button 컴포넌트 추가
import "./css/myPage.css";

const FileUpload = ({ onFileUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // 업로드된 이미지 URL 상태 추가

  // 파일 선택 시 자동으로 업로드 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 선택된 첫 번째 파일
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file); // 파일 업로드 함수 호출
    }
  };

  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append("fileTarget", "profileImage"); // 파일 타입을 지정 (예: profileImage)
    formData.append("files", file); // 파일 추가

    instance
      .post("/file/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("파일 업로드 성공:", res.data);
        const uploadedFileUrl = `${process.env.REACT_APP_HOST}/file/view/${res.data[0].saveFileName}`; // 서버에서 반환된 이미지 URL
        setUploadedImageUrl(uploadedFileUrl); // 이미지 URL을 상태로 설정
        onFileUploadSuccess(res.data); // 업로드 성공 후 부모 컴포넌트에 파일 정보 전달
        Swal.fire({
          title: "성공",
          text: "파일 업로드 성공!",
          icon: "success",
        });
      })
      .catch((err) => {
        console.error("파일 업로드 실패:", err);
        Swal.fire({
          title: "실패",
          text: "파일 업로드 실패",
          icon: "error",
        });
      });
  };

  // 파일 선택 input의 ref를 통해 클릭 이벤트 트리거
  const handleButtonClick = () => {
    document.getElementById("fileInput").click(); // 버튼 클릭 시 파일 입력창을 여는 방법
  };

  return (
    <div>
      {/* 파일 입력 숨기기 */}
      <input
        className="mypage-file-upload-input"
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        accept="image/*" // 이미지 파일만 선택 가능
        style={{ display: "none" }} // 파일 입력을 숨기기
      />

      {/* 부트스트랩 버튼으로 파일 업로드 */}
      <Button
        variant="primary"
        onClick={handleButtonClick}
        className="mypage-file-upload-input-btn"
      >
        사진 업로드
      </Button>
    </div>
  );
};

export default FileUpload;
