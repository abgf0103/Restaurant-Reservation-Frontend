import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import instance from "../api/instance";
import axios from "axios";
import Swal from "sweetalert2";

function Admin() {
    const [key, setKey] = useState("stores");

    // 상태 변수 설정
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [userTypes, setUserTypes] = useState({});
    const [businessUsers, setBusinessUsers] = useState([]); // 사업자 목록
    const [regularUsers, setRegularUsers] = useState([]); // 일반 사용자 목록

    // 데이터 로드 함수
    const loadData = () => {
        try {
            // 가게 정보 요청
            instance.get("/store/getStoreListForAdmin").then((res) => {
                setStores(res.data);
            });

            // 유저 정보 요청
            instance.get("/user/list").then((res) => {
                setUsers(res.data);
                loadUserTypes(res.data); // 유저 정보가 로드되면 유저 유형을 로드
            });

            // 리뷰 정보 요청
            instance.get("/review/list").then((res) => {
                setReviews(res.data.data);
            });
        } catch (error) {
            console.error("데이터 로드 오류:", error);
        }
    };

    // 각 유저의 유형을 로드하고 사업자와 일반 사용자 분리
    const loadUserTypes = async (userList) => {
        const types = {};
        const businessUsersTemp = [];
        const regularUsersTemp = [];

        for (const user of userList) {
            try {
                // 유저 유형 로드
                const response = await axios.get(`http://localhost:8080/api/user/isManagerByUserId?userId=${user.id}`);
                const userType = response.data === 1 ? "사업자" : "일반 사용자";
                types[user.id] = userType;

                // 사업자와 일반 사용자 분리
                if (userType === "사업자") {
                    businessUsersTemp.push(user);
                } else {
                    regularUsersTemp.push(user);
                }
            } catch (error) {
                console.error("유저 유형 로드 실패:", error);
                types[user.id] = "알 수 없음"; // 오류 처리
            }
        }

        setUserTypes(types);
        setBusinessUsers(businessUsersTemp); // 사업자 목록 설정
        setRegularUsers(regularUsersTemp); // 일반 사용자 목록 설정
    };

    // 승인 요청 함수
    const acceptStore = (storeId) => {
        Swal.fire({
            title: `가게 ID : ${storeId}을 승인하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "승인",
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                instance
                    .get(`/store/acceptStoreRegister?storeId=${storeId}`)
                    .then(() => {
                        Swal.fire({
                            title: "가게 승인 성공",
                            text: "승인이 완료되었습니다.",
                            icon: "success",
                        });
                        loadData(); // 승인 후 데이터 새로고침
                    })
                    .catch((err) => {
                        console.error("가게 승인 오류:", err);
                        Swal.fire({
                            title: "가게 승인 실패",
                            text: "승인에 실패했습니다.",
                            icon: "error",
                        });
                    });
            }
        });
    };

    // 삭제 요청 함수
    const deleteStore = (storeId) => {
        Swal.fire({
            title: `가게 ID : ${storeId}를 삭제하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "삭제",
        }).then((result) => {
            if (result.isConfirmed) {
                instance
                    .get(`/store/acceptStoreDelete?storeId=${storeId}`)
                    .then(() => {
                        Swal.fire({
                            title: "가게 삭제 성공",
                            text: "가게 삭제가 완료되었습니다.",
                            icon: "success",
                        });
                        loadData(); // 승인 후 데이터 새로고침
                    })
                    .catch((err) => {
                        console.error("가게 삭제 오류:", err);
                        Swal.fire({
                            title: "가게 삭제 실패",
                            text: "삭제에 실패했습니다.",
                            icon: "error",
                        });
                    });
            }
        });
    };

    // 리뷰 삭제 함수
    const deleteReview = (reviewId) => {
        Swal.fire({
            title: `리뷰 ID : ${reviewId}를 삭제하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "삭제",
        }).then((result) => {
            if (result.isConfirmed) {
                instance
                    .delete(`/review/deleteReviewForAdmin?reviewId=${reviewId}`)
                    .then(() => {
                        Swal.fire({
                            title: "리뷰 삭제 성공",
                            text: "리뷰 삭제가 완료되었습니다.",
                            icon: "success",
                        });
                        loadData(); // 승인 후 데이터 새로고침
                    })
                    .catch((err) => {
                        console.error("리뷰 삭제 오류:", err);
                        Swal.fire({
                            title: "리뷰 삭제 실패",
                            text: "리뷰 삭제에 실패했습니다.",
                            icon: "error",
                        });
                    });
            }
        });
    };

    const deactiveUser = (userId) => {
        Swal.fire({
            title: `유저 ID : ${userId}를 비활성화 하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "삭제",
        }).then((result) => {
            if (result.isConfirmed) {
                instance
                    .get(`/user/deactiveUser?userId=${userId}`)
                    .then(() => {
                        Swal.fire({
                            title: "유저 비활성화 성공",
                            text: "유저 비활성화가 완료되었습니다.",
                            icon: "success",
                        });
                        loadData(); // 승인 후 데이터 새로고침
                    })
                    .catch((err) => {
                        console.error("유저 비활성화 오류:", err);
                        Swal.fire({
                            title: "유저 비활성화 실패",
                            text: "유저 비활성화에 실패했습니다.",
                            icon: "error",
                        });
                    });
            }
        });
    };

    // 컴포넌트가 처음 렌더링될 때 데이터 로드
    useEffect(() => {
        loadData();
    }, []);

    console.log(users);
    return (
        <main>
            <Container>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="store-management-tabs">
                    {/* 가게 목록 탭 */}
                    <Tab eventKey="stores" title="가게 목록">
                        <Table className="align-middle" striped bordered hover>
                            <thead className="text-center">
                                <tr>
                                    <th>가게 ID</th>
                                    <th>가게 이름</th>
                                    <th>상태</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {stores.map((store) => (
                                    <tr key={store.storeId}>
                                        <td>{store.storeId}</td>
                                        <td>{store.storeName}</td>
                                        <td className="text-center">
                                            {store.isActive === 0 && <span>승인 대기중</span>}
                                            {store.isActive === 1 && <span>서비스중</span>}
                                            {store.isActive === 2 && <span>삭제 대기중</span>}
                                            {store.isActive === 3 && <span>삭제됨</span>}
                                        </td>
                                        <td className="text-center">
                                            {store.isActive === 0 && (
                                                <Button variant="success" onClick={() => acceptStore(store.storeId)}>
                                                    승인
                                                </Button>
                                            )}
                                            {store.isActive === 1 && (
                                                <Button variant="danger" onClick={() => deleteStore(store.storeId)}>
                                                    삭제
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab>

                    {/* 사업자 목록 탭 */}
                    <Tab eventKey="businessUsers" title="사업자 목록">
                        <Table className="align-middle" striped bordered hover>
                            <thead className="text-center">
                                <tr>
                                    <th>아이디</th>
                                    <th>닉네임</th>
                                    <th>이메일</th>
                                    <th>상태</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {businessUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.username}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="text-center">
                                            <span>{user.active ? "활성" : "비활성"}</span>
                                        </td>{" "}
                                        {/* 상태 표시 */}
                                        <td className="text-center">
                                            <Button variant="danger" onClick={() => deactiveUser(user.id)}>
                                                활동 제한
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab>

                    {/* 일반 사용자 목록 탭 */}
                    <Tab eventKey="regularUsers" title="일반 사용자 목록">
                        <Table className="align-middle" striped bordered hover>
                            <thead className="text-center">
                                <tr>
                                    <th>아이디</th>
                                    <th>닉네임</th>
                                    <th>이메일</th>
                                    <th>상태</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {regularUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.username}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="text-center">
                                            <span>{user.active ? "활성" : "비활성"}</span>
                                        </td>
                                        {/* 상태 표시 */}
                                        <td className="text-center">
                                            <Button variant="danger" onClick={() => deactiveUser(user.id)}>
                                                활동 제한
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab>

                    {/* 리뷰 관리 탭 */}
                    <Tab eventKey="reviews" title="리뷰 목록">
                        <Table className="align-middle" striped bordered hover>
                            <thead className="text-center">
                                <tr>
                                    <th>리뷰 ID</th>
                                    <th>가게 이름</th>
                                    <th>유저 ID</th>
                                    <th>리뷰 내용</th>
                                    <th>평점</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.reviewId}>
                                        <td>{review.reviewId}</td>
                                        <td>{review.storeName}</td>
                                        <td>{review.username}</td>
                                        <td>{review.reviewComment}</td>
                                        <td className="text-center">{review.rating}</td>
                                        <td className="text-center">
                                            <Button variant="danger" onClick={() => deleteReview(review.reviewId)}>
                                                삭제
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab>
                </Tabs>
            </Container>
        </main>
    );
}

export default Admin;
