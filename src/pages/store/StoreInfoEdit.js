import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import instance from "../../api/instance";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { formatPhoneNumber, formatStoreHours } from "../../utils/tools";

const RegisterStore = () => {
    const navigate = useNavigate();
    const { storeId } = useParams(); // URL에서 storeId를 추출
    const [address, setAddress] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // 업로드할 파일
    const [fileList, setFileList] = useState([]); // 업로드된 파일 리스트
    const [isGuideLines, setIsGuideLines] = useState(false); // 가게 안내 및 유의사항 체크박스 상태

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
        identity: "", // 가게 정체성
        guideLines: "", // 가게 유의사항
    });

    const getStoreData = () => {
        instance.get(`/store/view/${storeId}`).then((res) => {
            console.log(res.data);
            if (res.data.guideLines !== null) {
                setIsGuideLines(true);
            }
            setStoreData(res.data);
        });
    };

    useEffect(() => {
        getStoreData();
    }, []);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        // 전화번호 포맷을 위한 분기
        if (name === "phone") {
            console.log(name, value);
            const phoneValue = formatPhoneNumber(e.target.value);
            setStoreData((prevState) => ({
                ...prevState,
                [name]: phoneValue,
            }));
        } else if (name === "storeHours") {
            console.log(1);
            const storeHours = formatStoreHours(e.target.value);
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

        console.log("Store Data:", storeData); // 콘솔에 가게 정보 확인
    };

    const isGuideLinesHandler = (e) => {
        setIsGuideLines(e.target.checked); // 가게 안내 및 유의사항 체크박스 상태 업데이트
    };

    const getGuideLines = () => {};

    const [isAgrre, setIsAgree] = useState(false);

    const isAgreeHandler = (e) => {
        setIsAgree(e.target.checked);
    };

    const postcodeScriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
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
                extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
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
            identity: storeData.identity,
            fileId: storeData.fileId,
            guideLines : storeData.guideLines,
        });

        if (storeData.guideLines === undefined) {
            storeData.guideLines = "";
        }
        instance
            .post("/store/update", {
                storeId: storeData.storeId,
                address: storeData.address,
                storeHours: storeData.storeHours,
                phone: storeData.phone,
                description: storeData.description,
                identity: storeData.identity,
                fileId: storeData.fileId,
                guideLines : storeData.guideLines,
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
                instance.get(`/store/requestStoreDelete?storeId=` + storeId).catch((error) => {
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

    const textAreaRef = useRef(null); // textarea에 접근하기 위한 ref

    useEffect(() => {
        if (textAreaRef.current) {
            // 초기 렌더링 시 텍스트 영역의 높이를 자동으로 설정
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [storeData.guideLines]); // storeData.guideLines가 변경될 때마다 텍스트 영역 크기 재조정

    return (
        <main>
            <Form onSubmit={requestStoreRegister} className="registerStoreForm">
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h2 className="title">{storeData.storeName}</h2>
                    </Form.Label>
                </Form.Group>
                <Button
                    className="deleteStoreBtn"
                    variant="danger"
                    onClick={() => handleDelete(storeId)}
                    disabled={isDelete}
                >
                    {isDelete ? "삭제 중" : "삭제 요청"}
                </Button>

                <h5>대표 이미지를 선택하세요</h5>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <p>
                    <Button variant="colorSecondary" type="button" onClick={handleFileUpload}>
                        이미지 업로드
                    </Button>{" "}
                    <Button
                        type="button"
                        variant="colorPrimary"
                        onClick={() => {
                            console.log("삭제 요청 시 storeData.saveFileTarget:", storeData.saveFileTarget); // 삭제 버튼 클릭 시 콘솔에 출력
                            deleteFile(storeData.fileId, storeData.saveFileTarget); // storeData.saveFileTarget을 사용하여 삭제 요청
                        }}
                    >
                        삭제
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
                {storeData.saveFileName && (
                    <>
                        <img
                            src={`${process.env.REACT_APP_HOST}/file/view/${storeData.saveFileName}`}
                            alt="대표 이미지"
                            style={{ maxWidth: "100%", maxHeight: "300px" }}
                        />
                    </>
                )}

                <Form.Group className="mb-3">
                    <Button variant="colorSecondary" type="button" onClick={handleClick}>
                        주소 검색
                    </Button>
                    {/* 주소입력 다음 api 추가해서 도로명 주소 받도록 */}
                    <Form.Control
                        placeholder="주소를 입력해주세요"
                        value={storeData.address}
                        onChange={onChangeHandler}
                        name="address"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>영업시간 (ex/17:00~23:00)</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="영업시간을 입력하세요"
                        value={storeData.storeHours}
                        onChange={onChangeHandler}
                        name="storeHours"
                        maxLength={11}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>전화번호</Form.Label>
                    <Form.Control
                        type="tel"
                        placeholder="전화번호를 입력하세요"
                        value={storeData.phone}
                        onChange={onChangeHandler}
                        name="phone"
                        maxLength={13}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>상세 설명</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={storeData.description}
                        onChange={onChangeHandler}
                        name="description"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>아이덴티티</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={storeData.identity}
                        placeholder="가게에서 판매하는 종목을 한 단어로 입력하세요"
                        name="identity"
                        onChange={onChangeHandler}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        id="agreeGuideCheckbox"
                        checked={isGuideLines}
                        label="가게 안내와 유의사항 작성하기"
                        onChange={isGuideLinesHandler}
                    />
                </Form.Group>

                {isGuideLines && (
                    <>
                        {isGuideLines && (
                            <Form.Group className="mb-3">
                                <Form.Label>유의사항</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="유의사항을 입력하세요"
                                    name="guideLines"
                                    value={storeData.guideLines}
                                    onChange={onChangeHandler}
                                    rows={3} // 기본적으로 3행 크기 설정
                                    ref={textAreaRef} // textarea에 ref 추가
                                    onInput={(e) => {
                                        e.target.style.height = "auto"; // 기존 크기 초기화
                                        e.target.style.height = `${e.target.scrollHeight}px`; // 자동으로 크기 조정
                                    }}
                                    style={{
                                        overflow: "hidden", // 스크롤 숨기기
                                        resize: "none", // 사용자가 크기를 조정하지 못하도록
                                    }}
                                />
                            </Form.Group>
                        )}
                    </>
                )}

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        id="agreeCheckbox"
                        label="약관에 동의합니다."
                        checked={isAgrre}
                        onChange={isAgreeHandler}
                    />
                </Form.Group>

                <Button variant="colorPrimary" type="submit">
                    수정하기
                </Button>
            </Form>
        </main>
    );
};

export default RegisterStore;
