import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import instance from "../../api/instance";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDaumPostcodePopup } from "react-daum-postcode";

const MenuEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const storeId = location.state.storeId;
    const menuId = location.state.menuId;

    // 유저 정보 가져오기
    const [userInfo, setUserInfo] = useState("");
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
            setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
        }
    }, []);

    // 메뉴 정보 가져오기
    const [menuData, setMenuData] = useState({
        menuName: "",
        description: "",
        price: "",
        fileId: "", // 파일 ID
        saveFileName: "", // 저장된 파일 이름
        fileTarget: "", // 파일 Target
    });

    useEffect(() => {
        instance
            .get(`/store/menu/getMenuById?menuId=${menuId}`)
            .then((res) => {
                console.log("메뉴 데이터:", res.data);
                setMenuData(res.data);

                // fileTarget과 saveFileName을 콘솔에 출력
                console.log("파일 타겟:", res.data.fileTarget); // 콘솔에 fileTarget 출력
                console.log("파일 이름:", res.data.saveFileName); // 콘솔에 saveFileName 출력
            })
            .catch((error) => {
                console.error(error);
            });
    }, [menuId]); // menuId가 변경될 때마다 호출

    // 메뉴 정보 입력 시 상태 업데이트
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setMenuData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // 파일 업로드 상태 관리
    const [selectedFile, setSelectedFile] = useState(null); // 업로드할 파일

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 파일 업로드 핸들러
    const handleFileUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("fileTarget", "menuImage"); // "menuImage"로 설정
            formData.append("files", selectedFile);

            instance
                .post("/file/save", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    console.log("파일 업로드 성공:", res.data);
                    // 업로드된 파일의 ID와 이름을 상태에 저장
                    setMenuData({
                        ...menuData,
                        fileId: res.data[0].id, // 업로드된 파일의 ID
                        saveFileName: res.data[0].saveFileName, // 업로드된 저장된 파일 이름
                    });

                    // 파일 ID와 파일 이름을 콘솔에 출력
                    console.log("업로드된 파일 ID:", res.data[0].id);
                    console.log("업로드된 파일 이름:", res.data[0].saveFileName);

                    Swal.fire({
                        title: "성공",
                        text: "파일 업로드가 완료되었습니다.",
                        icon: "success",
                    });
                })
                .catch((err) => {
                    console.error("파일 업로드 오류:", err);
                    Swal.fire({
                        title: "실패",
                        text: "파일 업로드 중 오류가 발생했습니다.",
                        icon: "error",
                    });
                });
        }
    };

    // 파일 삭제 핸들러
    const deleteFile = () => {
        if (menuData.fileId) {
            Swal.fire({
                title: "삭제",
                text: "이미지를 삭제하시겠습니까?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "삭제",
                cancelButtonText: "취소",
            }).then((result) => {
                if (result.isConfirmed) {
                    instance
                        .post("/file/delete", {
                            id: menuData.fileId, // 파일 ID를 id로 설정
                            fileTarget: menuData.fileTarget, // 메뉴 이미지로 파일타겟 설정
                            reserveId: null, // reserveId는 null로 설정
                        })
                        .then(() => {
                            setMenuData({
                                ...menuData,
                                fileId: "", // 파일 삭제 후 상태 초기화
                                saveFileName: "", // 파일 삭제 후 상태 초기화
                            });
                            Swal.fire({
                                title: "성공",
                                text: "파일이 삭제되었습니다.",
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
                }
            });
        }
    };

    // 메뉴 수정 API 호출
    const requestMenuUpdate = (e) => {
        e.preventDefault();

        console.log("수정할 메뉴 데이터:", menuData);

        instance
            .post("/store/menu/update", {
                menuId: menuId,
                menuName: menuData.menuName,
                description: menuData.description,
                price: menuData.price,
                fileId: menuData.fileId, // fileId를 전달
                saveFileName: menuData.saveFileName, // saveFileName을 전달
            })
            .then(() => {
                Swal.fire({
                    title: "성공",
                    text: "메뉴 수정이 완료되었습니다.",
                    icon: "success",
                }).then(() => {
                    // 메뉴 수정 후, 메뉴 관리 페이지로 리다이렉트
                    navigate(`/store/menu/management/${storeId}`); // storeId를 URL에 포함시켜 리다이렉트
                });
            })
            .catch((error) => {
                console.error("메뉴 수정 오류:", error);
                Swal.fire({
                    title: "실패",
                    text: "메뉴 수정에 실패했습니다.",
                    icon: "error",
                });
            });
    };

    // 메뉴 삭제 API 호출
    const handleDeleteMenu = () => {
        Swal.fire({
            title: `${menuData.menuName}을 삭제하시겠습니까?`,
            text: "삭제 후 복구할 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                instance
                    .delete(`/store/menu/delete/${menuId}`)
                    .then(() => {
                        Swal.fire({
                            title: "성공",
                            text: "메뉴가 삭제되었습니다.",
                            icon: "success",
                        });
                        navigate(`/store/menu/${storeId}`); // 메뉴 목록 페이지로 이동
                    })
                    .catch((err) => {
                        console.error("메뉴 삭제 오류:", err);
                        Swal.fire({
                            title: "실패",
                            text: "메뉴 삭제에 실패했습니다.",
                            icon: "error",
                        });
                    });
            }
        });
    };

    return (
        <main>
            <Form onSubmit={requestMenuUpdate}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <h2 className="title">메뉴 수정</h2>
                    </Form.Label>
                </Form.Group>

                <Button
                    variant="danger"
                    onClick={handleDeleteMenu} // 메뉴 삭제 호출
                >
                    메뉴 삭제
                </Button>

                <Form.Group className="mb-3">
                    <Form.Label>메뉴 이름</Form.Label>
                    <Form.Control
                        placeholder="메뉴 이름을 입력하세요"
                        name="menuName"
                        value={menuData.menuName}
                        onChange={onChangeHandler}
                        required
                    />
                </Form.Group>

                <h5>메뉴 이미지</h5>
                {/* 이미지 업로드 */}
                <p>
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    <Button variant="colorSecondary" type="button" onClick={handleFileUpload}>
                        이미지 업로드
                    </Button>
                </p>
                {/* 업로드된 이미지 미리보기 및 삭제 버튼 */}
                {menuData.saveFileName && (
                    <>
                        <img
                            src={`${process.env.REACT_APP_HOST}/file/view/${menuData.saveFileName}`}
                            alt="메뉴 이미지"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "300px",
                                marginTop: "10px",
                            }}
                        />
                        <Button variant="danger" type="button" onClick={deleteFile}>
                            이미지 삭제
                        </Button>
                    </>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>메뉴 설명</Form.Label>
                    <Form.Control
                        placeholder="메뉴 설명을 입력하세요"
                        name="description"
                        value={menuData.description}
                        onChange={onChangeHandler}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가격을 설정하세요</Form.Label>₩
                    <Form.Control
                        type="number"
                        name="price"
                        placeholder="가격을 설정하세요"
                        value={menuData.price}
                        onChange={onChangeHandler}
                        required
                    />
                </Form.Group>

                <Button variant="colorPrimary" type="submit">
                    메뉴 수정
                </Button>
            </Form>
        </main>
    );
};

export default MenuEdit;
