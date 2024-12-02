import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import instance from "../../api/instance";
import { Button, Card } from "react-bootstrap";
import { convertToWon } from "../../utils/tools";
import Slider from "react-slick";
import "./css/Menu.css";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { isNotLoginSwal } from "../../utils/tools";

const SimilarStoreList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categoryId, setCategoryId] = useState("");

    const location = useLocation();
    const storeId = location.state;

    const [similarStoreList, setSimilarStoreList] = useState([]);

    const userInfo = useSelector(getUserInfo);
    const [isFavorite, setIsFavorite] = useState({});

    const [storeRatings, setStoreRatings] = useState({}); // 각 가게의 평점 저장
    const [storeReviewCounts, setStoreReviewCounts] = useState({}); // 각 가게의 리뷰 수 저장
    // 슬라이드 설정
    const settings = {
        dots: false, // 점 네비게이션 표시
        infinite: false, // 무한 루프 설정
        speed: 500, // 슬라이드 전환 속도
        slidesToShow: 5, // 한 번에 보여줄 슬라이드 개수
        slidesToScroll: 1, // 드래그할 때 한 번에 이동할 슬라이드 수
        variableWidth: false, // 슬라이드의 너비 자동 조정 (비활성화)
        arrows: false, // 화살표 버튼 비활성화
        draggable: true, // 드래그 활성화
        swipeToSlide: true, // 드래그한 만큼 슬라이드가 이동하도록 설정
        centerMode: false, // 센터모드 비활성화 (중앙 정렬)
    };

    // 즐겨찾기 등록 버튼 클릭 핸들러
    const favoriteClickHandler = (storeId) => {
        console.log(userInfo);
        if (userInfo.id !== "") {
            instance
                .post(`/favorite/insertFavorite`, {
                    userId: userInfo.id,
                    storeId: storeId,
                })
                .then(() => {
                    setIsFavorite((prevFavorites) => ({
                        ...prevFavorites,
                        [storeId]: true,
                    }));
                });
        } else {
            // 로그인 안 되어 있으면 swal출력 후 로그인 페이지로 리다이렉트
            isNotLoginSwal();
            navigate("/user/login");
        }
    };

    // 즐겨찾기 취소 버튼 클릭 핸들러
    const favoriteCancelClickHandler = (storeId) => {
        instance
            .post(`/favorite/checkFavoriteByUserStore`, {
                userId: userInfo.id,
                storeId: storeId,
            })
            .then((res) => {
                instance.delete(`/favorite/deleteFavoriteById?favoriteId=${res.data}`).then(() => {
                    setIsFavorite((prevFavorites) => ({
                        ...prevFavorites,
                        [storeId]: false,
                    }));
                });
            });
    };

    // 즐겨찾기 리스트 조회
    const getFavoriteList = () => {
        instance.get(`/store/getFavoriteStoreList?userId=${userInfo.id}`).then((res) => {
            const favorites = res.data.reduce((acc, store) => {
                acc[store.storeId] = true;
                return acc;
            }, {});
            setIsFavorite(favorites); // 즐겨찾기 상태 업데이트
        });
    };

    // 리뷰 평균 평점 구하기
    const getRatingAvgByStoreId = async (storeId) => {
        try {
            const res = await instance.get(`/review/getRatingAvgByStoreId?storeId=${storeId}`);
            return res.data || 0;
        } catch (error) {
            console.error("Error fetching rating:", error);
        }
    };

    // 리뷰 개수 구하기
    const getReviewCountByStoreId = async (storeId) => {
        try {
            const res = await instance.get(`/review/getReviewCountByStoreId?storeId=${storeId}`);
            return res.data; // 리뷰 수가 없으면 0
        } catch (error) {
            console.error("Error fetching review count:", error);
        }
    };

    // storeData 배열의 각 storeId에 대한 평점과 리뷰 수를 비동기적으로 가져오기
    const fetchRatingsAndReviews = async () => {
        const ratings = {};
        const reviewCounts = {};

        for (const store of similarStoreList) {
            const rating = await getRatingAvgByStoreId(store.storeId);
            const reviewCount = await getReviewCountByStoreId(store.storeId);

            ratings[store.storeId] = rating;
            reviewCounts[store.storeId] = reviewCount;
        }

        setStoreRatings(ratings);
        setStoreReviewCounts(reviewCounts);
    };

    const reload = () => {
        window.location.reload();
    };

    // 페이지 로드 시 사용자의 즐겨찾기 정보 불러오기
    useEffect(() => {
        if (userInfo.id) {
            getFavoriteList(); // 사용자의 즐겨찾기 목록을 가져옵니다.
        }
    }, [userInfo.id]);

    // storeData가 업데이트 될 때마다 평점과 리뷰 수 가져오기1
    useEffect(() => {
        if (similarStoreList.length > 0) {
            fetchRatingsAndReviews();
        }
    }, [similarStoreList]);

    // 비슷한 가게 정보 가져오기
    useEffect(() => {
        console.log(storeId);
        instance
            .get(`/category/getCategoryIdByStoreId?storeId=${storeId}`)
            .then((res) => {
                console.log(res.data);
                setCategoryId(res.data);
                instance
                    .get(`/store/getSimilarStoreList?categoryId=${res.data}&storeId=${storeId}`)
                    .then((res) => {
                        console.log(res.data);
                        setSimilarStoreList(res.data); // 비슷한 가게 목록 설정
                    })
                    .catch((error) => {
                        console.error("비슷한 가게 정보 가져오기 실패:", error);
                        Swal.fire({
                            title: "실패",
                            text: "비슷한 가게 정보 리스트 가져오는 데 실패했습니다.",
                            icon: "error",
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error("카테고리ID 가져오기 실패:", error);
                Swal.fire({
                    title: "실패",
                    text: "카테고리ID 가져오기를 실패했습니다.",
                    icon: "error",
                });
            });
    }, []);

    console.log(similarStoreList);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <>
            <div style={{ width: "100%" }}>
                <Slider {...settings} draggable="false">
                    {similarStoreList.map((item, index) => (
                        <div key={index}>
                            <Link to="/store/info" state={item.storeId}>
                                <img
                                    onClick={reload}
                                    src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                                    alt={`slide ${index}`}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        borderTopRightRadius: "8px",
                                        borderTopLeftRadius: "8px",
                                    }}
                                />
                            </Link>
                            <Card.Body className="menuInfo">
                                <Link to="/store/info" state={item.storeId}>
                                    <Card.Title onClick={reload} className="menuTitle">{item.storeName}</Card.Title>
                                    <Card.Text onClick={reload}>
                                        ⭐{storeRatings[item.storeId] || 0}({storeReviewCounts[item.storeId] || 0}){" "}
                                        {item.identity}
                                    </Card.Text>
                                </Link>
                                {isFavorite[item.storeId] ? (
                                    <Button className="onBtn" onClick={() => favoriteCancelClickHandler(item.storeId)}>
                                        <FontAwesomeIcon icon={faBookmarkSolid} />
                                    </Button>
                                ) : (
                                    <Button className="offBtn" onClick={() => favoriteClickHandler(item.storeId)}>
                                        <FontAwesomeIcon icon={faBookmarkRegular} />
                                    </Button>
                                )}
                            </Card.Body>
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    );
};
export default SimilarStoreList;
