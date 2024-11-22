import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import instance from "../../api/instance";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useDaumPostcodePopup } from "react-daum-postcode";

const RegisterStore = () => {
  const navigate = useNavigate();
  const { storeId } = useParams(); // URL에서 storeId를 추출
  const [address, setAddress] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // 업로드할 파일
  const [fileList, setFileList] = useState([]); // 업로드된 파일 리스트

  // 유저정보 가져오기
  const [userInfo, setUserInfo] = useState("");
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);

  // 가게 정보 가져오기
  const [storeData, setStoreData] = useState({
    storeHours: "",
    phone: "",
    description: "",
    saveFileName: "", // 대표 이미지 파일 이름
    fileTarget: "", // fileTarget (파일삭제용)
    fileId: "", // 파일 ID
    storeName: "", // 가게 이름
    address: "", // 주소
  });

  const getStoreData = () => {
    instance.get(`/store/view/${storeId}`).then((res) => {
      console.log(res.data);
      setStoreData(res.data);
    });
  };

  useEffect(() => {
    getStoreData();
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setStoreData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isAgrre, setIsAgree] = useState(false);

  const isAgreeHandler = (e) => {
    setIsAgree(e.target.checked);
  };

  const postcodeScriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";
    let localAddress = data.sido + " " + data.sigungu;

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress = fullAddress.replace(localAddress, "");
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
      console.log(fullAddress);
      storeData.address = fullAddress;
      setAddress(fullAddress);
    }
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  // 가게 수정 API 호출
  const requestStoreRegister = (e) => {
    e.preventDefault();

    if (!isAgrre) {
      Swal.fire({
        title: "약관 확인",
        text: "가게 수정을 진행하려면 약관에 동의하세요.",
        icon: "warning",
      });
      return;
    }
    console.log({
      storeId: storeData.storeId,
      address: storeData.address,
      storeHours: storeData.storeHours,
      phone: storeData.phone,
      description: storeData.description,
      fileId: storeData.fileId,
    });
    instance
      .post("/store/update", {
        storeId: storeData.storeId,
        address: storeData.address,
        storeHours: storeData.storeHours,
        phone: storeData.phone,
        description: storeData.description,
        fileId: storeData.fileId,
      })
      .then(() => {
        Swal.fire({
          title: "성공",
          text: "가게 수정이 완료되었습니다.",
          icon: "success",
        });
        navigate(`/store/mystore`);
      })
      .catch((error) => {
        console.error("가게 수정 오류:", error);
        Swal.fire({
          title: "실패",
          text: "가게 수정에 실패했습니다.",
          icon: "error",
        });
      });
  };

  // 삭제 요청 상태 관리
  const [isDelete, setIsDelete] = useState(false);

  // 삭제 버튼 관련
  const handleDelete = (storeId) => {
    Swal.fire({
      title: storeData.storeName + "을 삭제하겠습니까?",
      text: "삭제 후 복구할 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: storeData.storeName + "을 <br>삭제했습니다",
          text: "삭제된 매장은 복구할 수 없습니다",
          icon: "success",
        });
        setIsDelete(true);
        console.log(storeId + "삭제 요청");
        instance
          .get(`/store/requestStoreDelete?storeId=` + storeId)
          .catch((error) => {
            console.error("가게 삭제 요청 오류:", error);
            Swal.fire({
              title: "실패",
              text: "가게 삭제 요청에 실패했습니다.",
              icon: "error",
            });
          });
        navigate(`/store/mystore`);
      }
    });
  };

  // 파일 업로드 관련 핸들러
  const handleFileChange = (e) => {
    console.log("Selected File:", e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("fileTarget", "storeImage");
      formData.append("files", selectedFile);

      instance
        .post("/file/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("File Upload Response:", res.data, res.data[0].id); // 콘솔에 파일 업로드 결과 확인
          setSelectedFile(null);
          setFileList([...fileList, ...res.data]); // 업로드된 파일 목록에 추가
          setStoreData({
            ...storeData,
            fileId: res.data[0].id,
          });
        })
        .catch((err) => {
          console.error("File Upload Error:", err); // 콘솔에 파일 업로드 에러 확인
          Swal.fire({
            title: "파일 업로드 실패",
            text: "파일 업로드 중 오류가 발생했습니다.",
            icon: "error",
          });
        });
    }
  };

  const deleteFile = (fileId, fileTarget) => {
    console.log("삭제할 파일 ID:", fileId); // fileId 출력
    console.log("삭제할 파일 Target:", fileTarget); // fileTarget 출력

    instance
      .post("/file/delete", {
        id: fileId,
        fileTarget: fileTarget, // 동적으로 받은 fileTarget 사용
      })
      .then((res) => {
        console.log("파일 삭제 응답:", res);

        // 파일 삭제 후, state 업데이트
        setFileList(fileList.filter((file) => file.id !== fileId)); // 삭제된 파일을 fileList에서 제거
        setStoreData({
          ...storeData,
          fileId: "", // 파일 ID 초기화
          saveFileName: "", // 파일 이름 초기화
          saveFileTarget: "", // 파일 Target 초기화
        });

        Swal.fire({
          title: "성공",
          text: "파일이 성공적으로 삭제되었습니다.",
          icon: "success",
        });
      })
      .catch((err) => {
        console.error("파일 삭제 오류:", err);
        Swal.fire({
          title: "실패",
          text: "파일 삭제 중 오류가 발생했습니다.",
          icon: "error",
        });
      });
  };

  return (
    <div>
      <Form onSubmit={requestStoreRegister}>
        <Form.Group className="mb-3">
          <Form.Label>
            <h2>{storeData.storeName}</h2>
          </Form.Label>
        </Form.Group>
        <Button
          variant="danger"
          onClick={() => handleDelete(storeId)}
          disabled={isDelete}
        >
          {isDelete ? "삭제 중" : "삭제 요청"}
        </Button>

        <h1>대표 이미지 수정</h1>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {fileList.length > 0 && (
          <img
            src={`${process.env.REACT_APP_HOST}/file/view/${fileList[0]?.saveFileName}`}
            alt="미리보기"
            width="100"
          />
        )}
        <Button variant="primary" type="button" onClick={handleFileUpload}>
          이미지 업로드
        </Button>
        {storeData.saveFileName && (
          <>
            <img
              src={`${process.env.REACT_APP_HOST}/file/view/${storeData.saveFileName}`}
              alt="대표 이미지"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
            <button
              type="button"
              onClick={() => {
                console.log(
                  "삭제 요청 시 storeData.saveFileTarget:",
                  storeData.saveFileTarget
                ); // 삭제 버튼 클릭 시 콘솔에 출력
                deleteFile(storeData.fileId, storeData.saveFileTarget); // storeData.saveFileTarget을 사용하여 삭제 요청
              }}
            >
              삭제
            </button>
          </>
        )}

        <Form.Group className="mb-3">
          <Button variant="primary" type="button" onClick={handleClick}>
            주소 검색
          </Button>
          {/* 주소입력 다음 api 추가해서 도로명 주소 받도록 */}
          <Form.Control
            placeholder="주소를 입력해주세요"
            value={address}
            onChange={onChangeHandler}
            name="address"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>전화번호</Form.Label>
          <Form.Control
            type="tel"
            placeholder="전화번호를 입력해주세요"
            value={storeData.phone}
            onChange={onChangeHandler}
            name="phone"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>가게 설명</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={storeData.description}
            onChange={onChangeHandler}
            name="description"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>가게 운영시간</Form.Label>
          <Form.Control
            type="text"
            placeholder="운영시간을 입력해주세요"
            value={storeData.storeHours}
            onChange={onChangeHandler}
            name="storeHours"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="약관에 동의합니다."
            checked={isAgrre}
            onChange={isAgreeHandler}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          수정하기
        </Button>
      </Form>
    </div>
  );
};

export default RegisterStore;
