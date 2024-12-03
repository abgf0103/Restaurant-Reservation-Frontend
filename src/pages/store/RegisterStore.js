import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import instance from "../../api/instance";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { formatPhoneNumber, formatStoreHours } from "../../utils/tools";

const RegisterStore = () => {
    const navigate = useNavigate();

    // 카테고리 리스트를 저장하기 위한 state 선언
    const [categoryList, setCategoryList] = useState([]);
    const [storeData, setStoreData] = useState({});
    const [storeCategory, setStoreCategory] = useState();
    const [address, setAddress] = useState("");
    const [isAgree, setIsAgree] = useState(false);
    const [isGuideLines, setIsGuideLines] = useState(false); // 가게 안내 및 유의사항 체크박스 상태
    const [selectedFile, setSelectedFile] = useState(null); // 업로드할 파일
    const [fileList, setFileList] = useState([]); // 업로드된 파일 리스트

    // Daum 우편번호 API 스크립트 URL
    const postcodeScriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    // 영업 시간 검증
    const [storeTime, setStoreTime] = useState({
        storeHours: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isValidTime, setIsValidTime] = useState(true);

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
        // 전화번호 포맷을 위한 분기
        if (name === "phone") {
            const phoneValue = formatPhoneNumber(e.target.value);
            setStoreData((prevState) => ({
                ...prevState,
                [name]: phoneValue,
            }));
        } else if (name === "storeHours") {
            const storeHours = formatStoreHours(e.target.value);
            console.log(storeHours);
            setStoreData((prevState) => ({
                ...prevState,
                [name]: storeHours,
            }));
        } else {
            //전화번호, 영업시간이 둘다 아닐 경우
            setStoreData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
        console.log("Store Data:", storeData); // �����에 가게 정보 확인
    };

    const isAgreeHandler = (e) => {
        setIsAgree(e.target.checked);
    };

    const isGuideLinesHandler = (e) => {
        setIsGuideLines(e.target.checked); // 가게 안내 및 유의사항 체크박스 상태 업데이트
    };

    // 카테고리 선택 핸들러
    const storeCategoryHandler = (e) => {
        setStoreCategory(e.target.value);
    };

    // 파일 업로드 관련 핸들러
    const handleFileChange = (e) => {
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
                    setSelectedFile(null);
                    setFileList([...fileList, ...res.data]);
                })
                .catch((err) => {
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
        let fullAddress = data.address;
        let extraAddress = "";
        let localAddress = data.sido + " " + data.sigungu;

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
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

        // 파일 업로드 검증
        const fileId = fileList[0]?.id;
        if (!fileId) {
            Swal.fire({
                title: "파일 업로드 오류",
                text: "파일 업로드가 제대로 되지 않았습니다.",
                icon: "warning",
            });
            return;
        }

        // storeHours 검증
        const storeHours = storeData.storeHours;
        const timePattern = /^(\d{2}):(\d{2})~(\d{2}):(\d{2})$/; // 'HH:mm~HH:mm' 형식
        const match = storeHours.match(timePattern);

        if (!match) {
            Swal.fire({
                title: "시간 형식 오류",
                text: "가게 운영시간을 올바른 형식으로 입력해주세요 (예: 17:00~23:00).",
                icon: "warning",
            });
            return;
        }

        const startHour = parseInt(match[1]);
        const startMinute = parseInt(match[2]);
        const endHour = parseInt(match[3]);
        const endMinute = parseInt(match[4]);

        // 시간 범위 검증
        if (startHour > 24 || endHour > 24 || startMinute > 59 || endMinute > 59) {
            Swal.fire({
                title: "시간 범위 오류",
                text: "시간은 00:00부터 23:59까지 입력할 수 있습니다.",
                icon: "warning",
            });
            return;
        }

        // 시작 시간이 종료시간보다 크면 안 됨
        if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
            Swal.fire({
                title: "시간 오류",
                text: "시작시간은 종료시간보다 늦을 수 없습니다.",
                icon: "warning",
            });
            return;
        }

        console.log(storeData.guideLines);
        if (storeData.guideLines === undefined) {
            storeData.guideLines = "";
        }
        instance
            .post("/store/insert", {
                userId: userInfo.id,
                storeName: storeData.storeName,
                address: address,
                storeHours: storeData.storeHours,
                phone: storeData.phone,
                description: storeData.description,
                identity: storeData.identity,
                fileId: fileId,
                guideLines: storeData.guideLines,
            })
            .then(() => {
                Swal.fire({
                    title: "성공",
                    text: "가게 등록이 완료되었습니다.",
                    icon: "success",
                });

                instance
                    .get("/store/findStoreIdByStoreName", {
                        params: { storeName: storeData.storeName },
                    })
                    .then((res) => {
                        const storeId = res.data;
                        instance
                            .post("/storeCategory/save", {
                                storeId: storeId,
                                categoryId: storeCategory,
                            })
                            .then(() => {
                                navigate("/store/mystore");
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
        <main>
            <h3 className="title">가게 등록</h3>
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

                <h5>대표 이미지를 선택하세요</h5>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <p>
                    <Button className=" btnMargin" variant="colorSecondary" type="button" onClick={handleFileUpload}>
                        이미지 업로드
                    </Button>
                </p>

                {fileList.length > 0 && (
                    <div className="storeMainImg">
                        <img
                            src={`${process.env.REACT_APP_HOST}/file/view/${fileList[0]?.saveFileName}`}
                            alt="미리보기"
                            width="100"
                        />
                    </div>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>카테고리</Form.Label>
                    <Form.Select name="category" onChange={storeCategoryHandler} value={storeCategory} required>
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
                    <Button variant="colorSecondary" type="button" onClick={handleClick}>
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
                        value={storeData.storeHours}
                        maxLength={11}
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
                        value={storeData.phone}
                        maxLength={13}
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
                        placeholder="가게에서 판매하는 대표 음식을 한 단어로 입력하세요"
                        name="identity"
                        onChange={onChangeHandler}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        id="agreeGuideCheckbox"
                        label="가게 안내와 유의사항 작성하기"
                        onChange={isGuideLinesHandler}
                    />
                </Form.Group>

                {isGuideLines && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>유의사항</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="유의사항을 입력하세요"
                                name="guideLines"
                                onChange={onChangeHandler}
                                rows={3} // 기본적으로 3행 크기 설정
                                onInput={(e) => {
                                    e.target.style.height = "auto";
                                    e.target.style.height = `${e.target.scrollHeight}px`; // 자동으로 크기 조정
                                }}
                                style={{
                                    overflow: "hidden", // 스크롤 숨기기
                                    resize: "none", // 사용자가 크기를 조정하지 못하도록
                                }}
                            />
                        </Form.Group>
                    </>
                )}

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        id="agreeCheckbox"
                        label="약관에 동의합니다."
                        onChange={isAgreeHandler}
                        required
                    />
                </Form.Group>

                <Button variant="colorPrimary" type="submit">
                    가게 등록
                </Button>
            </Form>
        </main>
    );
};

export default RegisterStore;
