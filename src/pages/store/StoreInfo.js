import { Link, useLocation, useNavigate } from "react-router-dom";
import instance from "../../api/instance";
import React, { useEffect, useState } from "react";
import { Map as KakaoMap, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useMap } from "react-kakao-maps-sdk";
import { apiStoreViewByStoreId } from "../../webapi/webApiList";
import SlideUpModal from "../../components/SlideUpModal";
import "../reserve/css/Modal.css";
import MenuList from "./MenuList";
import axios from "axios";
import { Button } from "react-bootstrap";
import moment from "moment";
import Swal from "sweetalert2";
import "./css/store.css";
import { convertNewlinesToBr, isNotLoginSwal } from "../../utils/tools";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import SimilarStoreList from "./SimilarStoreList";

const { kakao } = window;

const EventMarkerContainer = ({ position, content }) => {
    const map = useMap();
    const [isVisible, setIsVisible] = useState(false);

    const customMarkerImage = "https://cdn-icons-png.flaticon.com/512/1516/1516034.png"; // 식당 아이콘 이미지 URL

    return (
        <MapMarker
            position={position}
            onClick={(marker) => {
                map.panTo(marker.getPosition());
                setIsVisible(true);
            }}
            onMouseOver={() => setIsVisible(true)}
            onMouseOut={() => setIsVisible(false)}
            image={{
                src: customMarkerImage, // 식당에 어울리는 커스텀 마커 이미지
                size: { width: 50, height: 50 }, // 마커 크기
                option: { offset: { x: 0, y: 0 } }, // 마커 위치 조정 (아래쪽을 기준으로)
            }}
        >
            {isVisible && (
                <CustomOverlayMap position={position} yAnchor={2.1} zIndex={10000}>
                    <div
                        style={{
                            borderRadius: "12px", // 둥글게 만든 인포윈도우
                            padding: "10px 70px",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            //   maxWidth: "200px",
                            //   display: "flex", // flexbox 레이아웃 사용
                            //   justifyContent: "center", // 수평 중앙 정렬
                            //   alignItems: "center", // 수직 중앙 정렬
                            textAlign: "center",
                            fontSize: "16px",
                            color: "#333",
                            fontWeight: "bold",
                            //   visibility: isVisible ? "visible" : "hidden", // visibility를 사용하여 깜빡임 방지
                            //   opacity: isVisible ? 1 : 0, // opacity로 부드러운 전환 효과 추가
                            //   transition: "opacity 0.3s ease-in-out", // 부드러운 전환
                        }}
                    >
                        {content}
                    </div>
                </CustomOverlayMap>
            )}
            {/* {isVisible && (
        <div
          style={{
            borderRadius: "12px", // 둥글게 만든 인포윈도우
            padding: "10px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "200px",
            textAlign: "center",
            fontSize: "14px",
            color: "#333",
          }}
        >
          {content} 
        </div>
      )} */}
        </MapMarker>
    );
};
const CustomMapComponent = ({ storeData }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true); // 지도 준비가 완료되면 true로 설정
    }, []);
};

const StoreInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const storeId = location.state;
    const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보

    const [storeData, setStoreData] = useState({
        latlng: { lat: 0, lng: 0 },
    });
    const [isReady, setIsReady] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const [avgRating, setAvgRating] = useState([]);

    const [nearByStationList, setNearByStationList] = useState([]);

    const [reviewCount, setReviewCount] = useState(0);

    //즐겨찾기 여부
    const [isFavorite, setIsFavorite] = useState({});

    const [shortAddr, setShortAddr] = useState([]);

    const getRatingAvgByStoreId = () => {
        instance.get(`/review/getRatingAvgByStoreId?storeId=${storeId}`).then((res) => {
            setAvgRating(res.data);
        });
    };

    const getMap = () => {
        //맵 불러오기
        apiStoreViewByStoreId(storeId).then((res) => {
            if (window.kakao && res?.address) {
                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(res.address, function (result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(Number(result[0].y), Number(result[0].x));
                        res.content = res.storeName;
                        res.latlng = { lat: coords.getLat(), lng: coords.getLng() };
                        setStoreData(res);
                        setIsReady(true);
                        setShortAddr(result[0].road_address.region_3depth_name);
                        console.log(result[0].road_address);
                        axios
                            .get("https://dapi.kakao.com/v2/local/search/keyword.json", {
                                headers: {
                                    Authorization: "KakaoAK 63b4dfd3d669b85d437e7a6055b0af02",
                                },
                                params: {
                                    y: Number(result[0].y),
                                    x: Number(result[0].x),
                                    query: "전철역",
                                },
                            })
                            .then((res) => {
                                console.log(res);
                                let tempData = res.data?.documents;
                                let tempArr = [];
                                axios
                                    .get(
                                        "https://api.odcloud.kr/api/15071311/v1/uddi:da7cd08f-94f0-4dba-b33d-d02dcb35b57b?page=1&perPage=10000&returnType=json&serviceKey=IFskQDPFMhtRcL%2FBzTYvheHJBzhvfAdGrUkMqIhYKRGuLNIUDxIkUj2fkFtNO6RLP0etoarfdxycKTE%2BBCDDjQ%3D%3D"
                                    )
                                    .then((res) => {
                                        const { data } = res.data;
                                        // 현재 시간을 가져오기
                                        let time = moment();
                                        // 분을 기준으로 변환
                                        let minutes = time.minutes();
                                        let hour = time.hour();
                                        let day = time.day();
                                        if (day >= 1 && day <= 5) {
                                            day = "평일";
                                        } else if (day === 6) {
                                            day = "토요일";
                                        } else {
                                            day = "일요일";
                                        }
                                        const formattedMinutes = minutes < 30 ? "00분" : "30분";
                                        // 원하는 형식으로 출력
                                        const formattedTime =
                                            hour < 12
                                                ? `${time.format(`h시`)}` + formattedMinutes
                                                : time.format(`H시`) + formattedMinutes;

                                        tempData.forEach((item, index) => {
                                            if (index <= 1) tempArr.push(item);
                                        });
                                        tempArr.forEach((item) => {
                                            // data 는 역 시간대 혼잡도 정보
                                            for (let i = 0; i < data.length; i++) {
                                                // 카카오 api에서 제공하는 역 이름과 역 혼잡도에 존재하는 출발역의 이름의 indexOf 값이 0 이상이면 역이 일치한다.
                                                //console.log(formattedTime, i[formattedTime]);
                                                if (
                                                    item.place_name.indexOf(data[i]["출발역"]) >= 0 &&
                                                    data[i]["요일구분"] === day
                                                ) {
                                                    const congestion = Number(
                                                        data[i][formattedTime] ? data[i][formattedTime] : 0
                                                    );
                                                    const nextCongestion = Number(
                                                        i + 1 < data.length && data[i + 1][formattedTime]
                                                            ? data[i + 1][formattedTime]
                                                            : 0
                                                    );

                                                    const congestionSum = (congestion + nextCongestion) / 2;
                                                    const congestionText =
                                                        congestionSum >= 40
                                                            ? "혼잡"
                                                            : congestionSum < 20
                                                            ? "여유"
                                                            : "보통";

                                                    item.congestion = congestionText;
                                                    const color = getCongestionColor(congestionText);
                                                    item.color = color;

                                                    // todo list
                                                    // 시간 파악, 평일인지 주말인지 파악, 상선인지 하선인지 파악
                                                    // 혼잡도는 시간의 값이 40 이상이면 혼잡으로 판단
                                                }
                                            }
                                        });
                                        console.log(tempArr);
                                        setNearByStationList(tempArr);
                                    });
                            });
                    } else {
                        console.error("Geocoder failed due to:", status);
                    }
                });
            }
        });
    };

    // 혼잡도를 색상으로 매핑하는 함수
    function getCongestionColor(congestion) {
        if (congestion === "혼잡") return "#e74c3c"; // 혼잡은 빨간색
        if (congestion === "보통") return "#2ecc71"; // 보통은 초록색
        return "#3498db"; // 여유는 파란색
    }

    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [orgReviews, setOrgReviews] = useState([]);
    const [buttonVisible, setButtonVisible] = useState(true); // 더보기 버튼 표시 여부

    const getData = () => {
        //리뷰 불러오기
        instance
            .get(`/review/list`)
            .then((res) => {
                const filteredReviews = res.data.data.filter((review) => review.storeId === storeId);
                console.log(filteredReviews);

                setOrgReviews(filteredReviews); // 전체 리뷰 상태 저장
                setTotalCount(filteredReviews.length); // 전체 리뷰 개수 설정
                const limit3 = filteredReviews.slice(0, 3); // 처음 3개 리뷰만 표시
                setReviews(limit3); // 첫 3개 리뷰 상태 업데이트

                setReviews(filteredReviews);
                // 서버에서 반환되는 리뷰 데이터에 좋아요 수(likeCount)를 포함해서 처리
                const reviewsWithLikes = filteredReviews.slice(0, 3).map((review) => ({
                    ...review,
                    liked: false, // 좋아요 상태는 기본적으로 false
                    likeCount: review.likeCount || 0, // 서버에서 받은 likeCount 값을 사용하여 초기값 설정
                }));
                console.log(res);

                setReviews(reviewsWithLikes); // 리뷰 목록 상태 업데이트

                if (userInfo.id !== "") {
                    // 리뷰별로 좋아요 상태 가져오기
                    reviewsWithLikes.forEach((review) => {
                        instance
                            .get(`/review/likes/status?reviewId=${review.reviewId}`)
                            .then((statusRes) => {
                                console.log(review);
                                // 해당 리뷰에 대한 좋아요 상태를 갱신
                                setReviews((prevReviews) =>
                                    prevReviews.map((r) =>
                                        r.reviewId === review.reviewId ? { ...r, liked: statusRes.data } : r
                                    )
                                );
                            })
                            .catch((error) => {
                                console.error("좋아요 상태 확인 실패:", error);
                            });
                    });
                }
            })
            .catch((error) => {
                console.error("리뷰 목록 가져오기 실패:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const nextPage = () => {
        const nextPageNumber = page + 3; // 페이지를 3개씩 증가시킴
        console.log(nextPageNumber, totalCount);
        if (nextPageNumber >= totalCount) {
            //Swal.fire("더 이상 리뷰가 없습니다.", "", "info"); // 더 이상 리뷰가 없으면 알림
            setButtonVisible(false); // 버튼 숨기기
        } else {
            setPage(nextPageNumber); // 페이지 증가
            const nextReviews = orgReviews.slice(nextPageNumber, nextPageNumber + 3); // 새로운 3개 리뷰 가져오기
            setReviews((prevReviews) => [...prevReviews, ...nextReviews]); // 기존 리뷰에 새로운 리뷰 추가
            const tempLengthArr = [...reviews, ...nextReviews];
            console.log(tempLengthArr.length);
            console.log(orgReviews.length);
            if (tempLengthArr.length >= orgReviews.length) {
                setButtonVisible(false); // 버튼 숨기기
            } else {
                setButtonVisible(true); // 버튼 숨기기
            }
            // 새로 추가된 리뷰들에 대해 좋아요 상태 가져오기
            nextReviews.forEach((review) => {
                instance
                    .get(`/review/likes/status?reviewId=${review.reviewId}`)
                    .then((statusRes) => {
                        // 추가된 리뷰에 대한 좋아요 상태를 갱신
                        setReviews((prevReviews) =>
                            prevReviews.map((r) =>
                                r.reviewId === review.reviewId ? { ...r, liked: statusRes.data } : r
                            )
                        );
                    })
                    .catch((error) => {
                        console.error("좋아요 상태 확인 실패:", error);
                    });
            });
        }
    };

    const getReviewCountByStoreId = () => {
        instance
            .get(`/review/getReviewCountByStoreId?storeId=${storeId}`)
            .then((res) => {
                console.log(res.data);
                setReviewCount(res.data);
                if (res.data <= 3) {
                    setButtonVisible(false);
                }
                if (res.data > 0) {
                    getRatingAvgByStoreId();
                } else {
                    setAvgRating(0);
                }
            })
            .catch((error) => {
                console.error("리뷰 개수 가져오기 실패:", error);
            });
    };

    //좋아요 버튼 클릭 핸들러
    const handleLikeClick = (reviewId, isLiked) => {
        console.log(userInfo.id);
        if (userInfo.id !== "") {
            const apiCall = isLiked
                ? instance.delete(`/review/unlike/${reviewId}`, FormData) // 좋아요 취소
                : instance.post(`/review/like/${reviewId}`, FormData); // 좋아요 추가

            apiCall
                .then((res) => {
                    if (res.data.success) {
                        // 좋아요 상태가 변경되면 리뷰 업데이트
                        instance
                            .get(`/review/view/${reviewId}`, FormData)
                            .then((updatedReviewRes) => {
                                const updatedReview = updatedReviewRes.data.data;
                                setReviews((prevReviews) =>
                                    prevReviews.map((r) =>
                                        r.reviewId === reviewId
                                            ? {
                                                  ...r,
                                                  liked: !isLiked, // 상태 변경
                                                  likeCount: updatedReview.likeCount, // 업데이트된 좋아요 수 (서버에서 받은 값으로 갱신)
                                              }
                                            : r
                                    )
                                );
                            })
                            .catch((error) => {
                                console.error("리뷰 업데이트 실패:", error);
                            });
                    }
                })
                .catch((error) => {
                    console.error(isLiked ? "좋아요 취소 실패" : "좋아요 추가 실패", error);
                    Swal.fire("실패", isLiked ? "좋아요 취소에 실패했습니다." : "좋아요 추가에 실패했습니다.", "error");
                });
        } else {
            isNotLoginSwal();
            navigate("/user/login");
        }
    };

    //즐겨찾기 여부
    const getIsFavorite = () => {
        console.log(userInfo.id);
        console.log(storeId);
        if (userInfo.id !== "") {
            instance
                .post(`/favorite/checkFavoriteByUserStore`, {
                    userId: userInfo.id,
                    storeId: storeId,
                })
                .then((res) => {
                    if (res.data) {
                        console.log(res.data);
                        // 해당 storeId에 대한 즐겨찾기 상태를 업데이트
                        setIsFavorite((prevFavorites) => ({
                            ...prevFavorites,
                            [storeId]: true, // 해당 storeId는 즐겨찾기 등록
                        }));
                    } else {
                        setIsFavorite((prevFavorites) => ({
                            ...prevFavorites,
                            [storeId]: false, // 해당 storeId는 즐겨찾기 미등록
                        }));
                    }
                })
                .catch((err) => {
                    console.error("즐겨찾기 여부 조회 실패", err);
                });
        }
    };

    const handleReserveClick = () => {
        setIsPanelOpen(true);
    };

    // 스크롤 이벤트 처리 함수
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        const headerHeight = document.querySelector("header").offsetHeight; // 헤더 높이 가져오기

        // section의 위치 가져오기
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;

        // sectionTop에 헤더 높이를 빼서 최종 스크롤 위치 계산
        const scrollToPosition = sectionTop - headerHeight;

        // 스크롤을 부드럽게 이동하도록 설정
        window.scrollTo({
            top: scrollToPosition,
            behavior: "smooth",
        });
    };

    console.log(reviews);

    // 별점을 처리하는 함수
    const renderStars = (rating) => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                i < rating ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gold" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="" viewBox="0 0 16 16">
                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                    </svg>
                )
            );
        }
        return stars;
    };

    // 즐겨찾기 등록 버튼 클릭 핸들러
    const favoriteClickHandler = () => {
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
    console.log(storeData);

    // 즐겨찾기 취소 버튼 클릭 핸들러
    const favoriteCancelClickHandler = (storeId) => {
        console.log(storeData);
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

    useEffect(() => {
        getMap();
        getData();
        console.log(storeData);
    }, [storeId]);

    //리뷰가 있으면 getRatingAvgByStoreId 실행으로 변경
    useEffect(() => {
        getReviewCountByStoreId();
        getIsFavorite();
        console.log(isFavorite);
        console.log(storeData);
        console.log(nearByStationList);
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }
    console.log(reviews);

    return (
        <main className="storeMain">
            <div>
                <span className="storeInfoIdentity">
                    {shortAddr} | {storeData.identity}
                </span>
                <h2>
                    {storeData.storeName}
                    {isFavorite[storeData.storeId] ? (
                        <Button
                            className="storeInfoFavoriteBtn onBtn"
                            onClick={() => favoriteCancelClickHandler(storeData.storeId)}
                        >
                            <FontAwesomeIcon icon={faBookmarkSolid} />
                        </Button>
                    ) : (
                        <Button
                            className="storeInfoFavoriteBtn offBtn"
                            onClick={() => favoriteClickHandler(storeData.storeId)}
                        >
                            <FontAwesomeIcon icon={faBookmarkRegular} />
                        </Button>
                    )}
                </h2>
            </div>
            <p className="score">
                별점 : {avgRating}({reviewCount}) tel : {storeData.phone}
            </p>
            <div className="storeInfoImg">
                <img
                    src={`${process.env.REACT_APP_HOST}/file/view/${storeData.saveFileName}`}
                    alt={`가게 메인 이미지`}
                />
            </div>
            <div>
                <Button
                    variant="colorSecondary"
                    className="onClick-button"
                    onClick={() => scrollToSection("description")}
                >
                    가게 설명
                </Button>{" "}
                <Button variant="colorSecondary" className="onClick-button" onClick={() => scrollToSection("menu")}>
                    메뉴
                </Button>{" "}
                <Button variant="colorSecondary" className="onClick-button" onClick={() => scrollToSection("review")}>
                    리뷰
                </Button>{" "}
                <Button variant="colorSecondary" className="onClick-button" onClick={() => scrollToSection("map")}>
                    위치
                </Button>{" "}
                <Button variant="colorSecondary" className="onClick-button" onClick={() => scrollToSection("info")}>
                    상세정보
                </Button>
            </div>
            <div className="component-line">
                <h4 className="description" id="description">
                    가게 설명
                </h4>
                <p>{storeData.description}</p>
            </div>
            <div className="component-line">
                <h2 className="menu" id="menu">
                    메뉴
                </h2>
                <MenuList />
            </div>
            <div className="component-line">
                <h1 className="review" id="review">
                    리뷰
                </h1>
                {reviews.length > 0 ? (
                    <ul style={{ padding: 0 }}>
                        {reviews.map((review) => (
                            <li key={review.reviewId} className="reviewItem" style={{ marginBottom: "40px" }}>
                                <Link
                                    to={`/review/${review.username}`}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        textDecoration: "none",
                                        color: "var(--color--text)",
                                    }}
                                >
                                    {review.fileId ? (
                                        <img
                                            src={`${process.env.REACT_APP_HOST}/file/viewId/${review.fileId}`}
                                            alt=""
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "2px solid var(--primary-color)",
                                            }}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            className="mypage-default-icon"
                                            icon={faCircleUser} // 기본 아이콘
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                verticalAlign: "middle",
                                                color: "black",
                                                border: "1.5px solid var(--secondary-color)",
                                            }}
                                        />
                                    )}
                                    {" " + review.username}
                                </Link>
                                <br />
                                <strong>별점:</strong> {renderStars(review.rating)}
                                <br />
                                <strong>리뷰 코멘트:</strong> {review.reviewComment}
                                <br />
                                <strong>좋아요:</strong> {review.likeCount}{" "}
                                <button
                                    className="like-button"
                                    onClick={() => handleLikeClick(review.reviewId, review.liked)}
                                >
                                    {review.liked ? "❤️" : "🤍"}
                                </button>
                                <br />
                                {/* 파일 첨부 부분 */}
                                <strong>리뷰 사진:</strong>
                                {review.files.length > 0 && (
                                    <div>
                                        <div>
                                            {review.files.map((fileItem, index) => (
                                                <img
                                                    key={index}
                                                    src={`${process.env.REACT_APP_HOST}/file/view/${fileItem.saveFileName}`}
                                                    alt={`첨부 파일 ${index + 1}`}
                                                    style={{
                                                        width: "200px",
                                                        marginTop: "10px",
                                                        marginRight: "10px",
                                                        marginBottom: "10px",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>작성된 리뷰가 없습니다.</p>
                )}
                {/* "더보기" 버튼 */}
                {buttonVisible && (
                    <button type="button" onClick={nextPage} className="review-button">
                        리뷰 더보기
                    </button>
                )}
            </div>
            <div className="component-line">
                <h4 className="info" id="info">
                    위치
                </h4>
                <div className="kakaoMapContainer">
                    <KakaoMap
                        center={{ lat: storeData.latlng.lat, lng: storeData.latlng.lng }}
                        style={{ width: "100%", height: "300px", borderRadius: "10px" }}
                        level={3}
                    >
                        {isReady && (
                            <EventMarkerContainer
                                key={`EventMarkerContainer-${storeData.latlng.lat}-${storeData.latlng.lng}`}
                                position={storeData.latlng}
                                content={storeData.content}
                            />
                        )}
                    </KakaoMap>
                    <ul id="map" style={{ padding: 0, marginTop: "10px" }}>
                        {nearByStationList.length > 0 &&
                            nearByStationList.map((item, index) => {
                                return (
                                    <li key={index}>
                                        🚇 {item.place_name}에서 {item.distance}m
                                        <span
                                            style={{
                                                padding: "3px 6px",
                                                borderRadius: "5px",
                                                display: "inline-block",
                                                margin: "0 2px",
                                                textAlign: "center",
                                                fontSize: "12px",
                                                color: "#fff",
                                                background: item.color,
                                            }}
                                        >
                                            {item?.congestion}
                                        </span>
                                        {/* {item?.congestion?.map((item, index) => {
                  return (
                    <span
                      key={index}
                      style={{
                        padding: "3px 6px",
                        borderRadius: "5px",
                        display: "inline-block",
                        margin: "0 2px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#fff",
                        background: item.color,
                      }}
                    >
                      {" "}
                      {item.congestion}
                    </span>
                  );
                })} */}
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </div>
            <div className="component-line">
                <h4 className="info" id="info">
                    상세정보
                </h4>
                <p className="address">가게 주소: {storeData.address}</p>
                <p className="storeHours">영업시간: {storeData.storeHours}</p>
                <p className="phone">연락처: {storeData.phone}</p>
            </div>
            {storeData.guideLines !== null && (
                <div className="component-line">
                    <h4 className="info" id="info">
                        안내 및 유의사항
                    </h4>
                    <p className="guideLines">{convertNewlinesToBr(storeData.guideLines)}</p>
                </div>
            )}
            <div className="component-line">
                <h4 className="info" id="info">
                    비슷한 매장 추천
                </h4>
                <SimilarStoreList />
            </div>
            <button className="reserve-button-info" onClick={handleReserveClick}>
                예약하기
            </button>
            <SlideUpModal isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} selectedStoreId={storeId} />
        </main>
    );
};

export default StoreInfo;
