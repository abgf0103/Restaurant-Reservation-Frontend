import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import instance from "../../api/instance";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from "react-daum-postcode";

const RegisterStore = () => {
  const navigate = useNavigate();

  // 카테고리 리스트를 저장하기 위한 state 선언
  const [categoryList, setCategoryList] = useState([]);
  const [storeData, setStoreData] = useState({});
  const [storeCategory, setStoreCategory] = useState();
  const [address, setAddress] = useState("");
  const [isAgree, setIsAgree] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // 업로드할 파일
  const [fileList, setFileList] = useState([]); // 업로드된 파일 리스트

  // Daum 우편번호 API 스크립트 URL
  const postcodeScriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  // 카테고리 리스트를 API로 받아서 state에 저장
  useEffect(() => {
    instance.get("/category/list").then((res) => {
      console.log("Category List:", res.data); // 콘솔에 카테고리 리스트 확인
      setCategoryList(res.data);
    });
  }, []);

  // 사용자 정보 가져오기
  const [userInfo, setUserInfo] = useState("");
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);

  // 가게 정보를 입력할 때마다 이벤트를 발생시켜 값을 저장
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setStoreData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log("Store Data:", storeData); // 콘솔에 가게 정보 확인
  };

  const isAgreeHandler = (e) => {
    setIsAgree(e.target.checked);
    console.log("Agree Checkbox:", isAgree); // 콘솔에 약관 동의 체크 상태 확인
  };

  // 카테고리 선택 핸들러
  const storeCategoryHandler = (e) => {
    setStoreCategory(e.target.value);
    console.log("Selected Category:", storeCategory); // 콘솔에 선택된 카테고리 확인
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
          console.log("File Upload Response:", res.data); // 콘솔에 파일 업로드 결과 확인
          setSelectedFile(null);
          setFileList([...fileList, ...res.data]); // 업로드된 파일 목록에 추가
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

  // 주소 검색 처리
  const handleComplete = (data) => {
    console.log("Address Search Data:", data); // 콘솔에 주소 검색 결과 확인
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
      setAddress(fullAddress);
    }
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  // 가게 등록 API 호출
  const requestStoreRegister = (e) => {
    e.preventDefault();

    // 가게 이름 중복 체크
    console.log("Store Name Check:", storeData.storeName); // 콘솔에 가게 이름 확인
    instance
      .get("/store/hasStoreName", {
        params: { storeName: storeData.storeName },
      })
      .then((res) => {
        if (res.data) {
          Swal.fire({
            title: "가게 이름 중복",
            text: "동일한 가게 이름이 존재합니다.",
            icon: "error",
          });
          return;
        }
      });

    // 카테고리 선택 및 약관 동의 체크
    if (storeCategory === undefined) {
      Swal.fire({
        title: "카테고리 선택",
        text: "가게 등록을 진행하려면 카테고리를 선택하세요.",
        icon: "warning",
      });
      return;
    }

    if (!isAgree) {
      Swal.fire({
        title: "약관 확인",
        text: "가게 등록을 진행하려면 약관에 동의하세요.",
        icon: "warning",
      });
      return;
    }

    // 파일 ID 가져오기
    const fileId = fileList[0]?.id; // 업로드된 파일 ID
    console.log("File ID:", fileId); // 콘솔에 파일 ID 확인

    if (!fileId) {
      Swal.fire({
        title: "파일 업로드 오류",
        text: "파일 업로드가 제대로 되지 않았습니다.",
        icon: "warning",
      });
      return;
    }

    // 가게 등록
    instance
      .post("/store/insert", {
        userId: userInfo.id,
        storeName: storeData.storeName,
        address: address,
        storeHours: storeData.storeHours,
        phone: storeData.phone,
        description: storeData.description,
        fileId: fileId, // fileId를 사용하여 파일 정보와 연결
      })
      .then(() => {
        Swal.fire({
          title: "성공",
          text: "가게 등록이 완료되었습니다.",
          icon: "success",
        });

        // storeName으로 storeId 찾아오기
        instance
          .get("/store/findStoreIdByStoreName", {
            params: { storeName: storeData.storeName },
          })
          .then((res) => {
            const storeId = res.data;
            console.log("Store ID:", storeId); // 콘솔에 storeId 확인
            instance
              .post("/storeCategory/save", {
                storeId: storeId,
                categoryId: storeCategory,
              })
              .then(() => {
                navigate("/store/mystore"); // 내 가게 페이지로 이동
              })
              .catch(() => {
                Swal.fire({
                  title: "카테고리 등록 오류",
                  text: "카테고리 등록에 오류가 발생했습니다. 나중에 다시 시도해주세요.",
                  icon: "error",
                });
              });
          });
      })
      .catch(() => {
        Swal.fire({
          title: "가게 등록 실패",
          text: "가게 등록에 실패했습니다.",
          icon: "error",
        });
      });
  };

  return (
    <div>
      <h2>가게 등록 페이지</h2>
      <Form onSubmit={requestStoreRegister}>
        <Form.Group className="mb-3">
          <Form.Label>가게 이름</Form.Label>
          <Form.Control
            type="text"
            placeholder="가게 이름을 입력하세요"
            name="storeName"
            onChange={onChangeHandler}
            required
          />
        </Form.Group>

        <h3>대표 이미지 선택</h3>
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

        <Form.Group className="mb-3">
          <Form.Label>카테고리 선택</Form.Label>
          <Form.Select
            name="category"
            onChange={storeCategoryHandler}
            value={storeCategory}
            required
          >
            <option value="" hidden>
              카테고리를 선택하세요
            </option>
            {categoryList.map((item) => (
              <option key={item.categoryId} value={item.categoryId}>
                {item.categoryTitle}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Button variant="primary" type="button" onClick={handleClick}>
            주소 검색
          </Button>
          <Form.Control
            placeholder="주소를 입력하세요"
            name="address"
            onChange={onChangeHandler}
            value={address}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>영업시간 (ex/17:00~23:00)</Form.Label>
          <Form.Control
            placeholder="영업시간을 입력하세요"
            name="storeHours"
            onChange={onChangeHandler}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>전화번호</Form.Label>
          <Form.Control
            type="tel"
            placeholder="전화번호를 입력하세요"
            name="phone"
            onChange={onChangeHandler}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>상세 설명</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="상세 설명을 입력하세요"
            name="description"
            onChange={onChangeHandler}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>아이덴티티</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="가게에서 판매하는 종목을 한 단어로 입력하세요"
            name="identity"
            onChange={onChangeHandler}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="agreeCheckbox"
            label="약관에 동의합니다."
            onChange={isAgreeHandler}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          가게 등록
        </Button>
      </Form>
    </div>
  );
};

export default RegisterStore;
