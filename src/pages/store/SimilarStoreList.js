import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import instance from "../../api/instance";
import { Button, Card } from "react-bootstrap";
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

    // 수평 스크롤 설정
    const scrollRef = useRef(null);
    const [isMouseOver, setIsMouseOver] = useState(false); // 마우스 오버 상태
    const isDragging = useRef(false); // 마우스 드래그 상태 추적
    const startX = useRef(0); // 드래그 시작 위치
    const scrollLeft = useRef(0); // 드래그 시작 시 스크롤 위치

    // 마우스가 div 영역에 들어갔을 때
    const handleMouseEnter = () => {
        setIsMouseOver(true);
    };

    // 마우스가 div 영역에서 나갔을 때
    const handleMouseLeave = () => {
        setIsMouseOver(false);
        isDragging.current = false; // 마우스가 나가면 드래그 상태 종료
    };

    // 마우스 휠 이벤트 처리 함수
    const handleWheel = (e) => {
        if (isMouseOver) {
            // 마우스가 div 영역에 있을 때만 수평 스크롤 가능
            if (e.deltaY !== 0) {
                //e.preventDefault();  // 수직 스크롤 방지
                if (scrollRef.current) {
                    scrollRef.current.scrollLeft += e.deltaY; // 수평 스크롤 이동
                }
            }
        } else {
            // 마우스가 div 영역을 벗어났을 때는 기본적으로 세로 스크롤 가능
            return; // 이 경우 수직 스크롤을 허용
        }
    };

    // 마우스 드래그 시작
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX; // 드래그 시작 위치
        scrollLeft.current = scrollRef.current.scrollLeft; // 드래그 시작 시 스크롤 위치
        e.preventDefault(); // 기본 드래그 방지
    };

    // 마우스 드래그 중
    const handleMouseMove = (e) => {
        if (!isDragging.current) return; // 드래그 상태일 때만 처리

        const distance = e.clientX - startX.current; // 드래그한 거리
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft.current - distance; // 스크롤 이동
        }
    };

    // 마우스 드래그 종료
    const handleMouseUp = () => {
        isDragging.current = false; // 드래그 종료
    };

    // 전체 화면에서 수직 스크롤을 방지하는 useEffect
    useEffect(() => {
        // 전체 화면에서 수직 스크롤 방지
        const preventDefaultScroll = (e) => {
            if (isMouseOver) {
                e.preventDefault(); // 수직 스크롤 방지
            }
        };

        // 전체 화면에서 수직 스크롤 방지
        document.body.addEventListener("wheel", preventDefaultScroll, { passive: false });

        // 컴포넌트가 언마운트될 때 수직 스크롤 방지 해제
        return () => {
            document.body.removeEventListener("wheel", preventDefaultScroll);
        };
    }, [isMouseOver]);

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
            <div
                ref={scrollRef}
                onWheel={handleWheel} // 마우스 휠 이벤트 핸들러
                onMouseEnter={handleMouseEnter} // 마우스가 div 영역에 들어갔을 때
                onMouseLeave={handleMouseLeave} // 마우스가 div 영역을 떠났을 때 (드래그 종료와 마우스 오버 상태 업데이트)
                onMouseDown={handleMouseDown} // 마우스 클릭 시작
                onMouseMove={handleMouseMove} // 마우스 드래그 중
                onMouseUp={handleMouseUp} // 마우스 클릭 종료
                className="horizontal-scroll"
            >
                 {similarStoreList.map((item, index) => (
                        <div key={index}
                            className="horizontal-item">
                            <Link to="/store/info" state={item.storeId}>
                                <img
                                    onClick={reload}
                                    src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                                    alt={`slide ${index}`}
                                />
                            </Link>
                            <Card.Body className="menuInfo">
                                <Link to="/store/info" state={item.storeId}>
                                    <Card.Title onClick={reload} className="menuTitle horizontal-item-title">{item.storeName}</Card.Title>
                                    <Card.Text className="horizontal-item-text" onClick={reload}>
                                        ⭐{storeRatings[item.storeId] || 0}({storeReviewCounts[item.storeId] || 0}){" "}
                                        {item.identity}
                                    </Card.Text>
                                </Link>
                                {isFavorite[item.storeId] ? (
                                    <Button className="similarFavoriteBtn onBtn" onClick={() => favoriteCancelClickHandler(item.storeId)}>
                                        <FontAwesomeIcon icon={faBookmarkSolid} />
                                    </Button>
                                ) : (
                                    <Button className="similarFavoriteBtn offBtn" onClick={() => favoriteClickHandler(item.storeId)}>
                                        <FontAwesomeIcon icon={faBookmarkRegular} />
                                    </Button>
                                )}
                            </Card.Body>
                        </div>
                    ))}
            </div>
        </>
    );
};
export default SimilarStoreList;
