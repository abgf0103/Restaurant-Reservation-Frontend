import { Link, useLocation } from "react-router-dom";
import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { useMap } from "react-kakao-maps-sdk";
import { apiStoreViewByStoreId } from "../../webapi/webApiList";
import SlideUpModal from "../../components/SlideUpModal";
import "../reserve/css/reserve.css";
import MenuList from "./MenuList";
import axios from "axios";
import { Button } from "react-bootstrap";
import moment from "moment";
import Swal from "sweetalert2";

const { kakao } = window;

const EventMarkerContainer = ({ position, content }) => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <MapMarker
      position={position}
      onClick={(marker) => map.panTo(marker.getPosition())}
      onMouseOver={() => setIsVisible(true)}
      onMouseOut={() => setIsVisible(false)}
    >
      {isVisible && content}
    </MapMarker>
  );
};

const StoreInfo = () => {
  const location = useLocation();
  const storeId = location.state;

  const [storeData, setStoreData] = useState({
    storeName: "",
    latlng: { lat: 0, lng: 0 },
  });
  const [isReady, setIsReady] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [avgRating, setAvgRating] = useState([]);

  const [nearByStationList, setNearByStationList] = useState([]);

  const [reviewCount, setReviewCount] = useState(0);

  const getRatingAvgByStoreId = () => {
    instance
      .get(`/review/getRatingAvgByStoreId?storeId=${storeId}`)
      .then((res) => {
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
            const coords = new kakao.maps.LatLng(
              Number(result[0].y),
              Number(result[0].x)
            );
            res.content = res.storeName;
            res.latlng = { lat: coords.getLat(), lng: coords.getLng() };
            setStoreData(res);
            setIsReady(true);
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
                        : time.format(`hh시`) + formattedMinutes;

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
                          const congestionObj = [];
                          const congestion =
                            data[i][formattedTime] >= 40
                              ? "혼잡"
                              : data[i][formattedTime] < 20
                              ? "여유"
                              : "보통";

                          // 혼잡도에 맞는 색상 매핑
                          const color = getCongestionColor(congestion);

                          congestionObj.push({
                            direction: data[i]["상하구분"],
                            congestion,
                            color, // 색상 추가
                          });

                          if (i + 1 < data.length) {
                            const nextCongestion =
                              data[i + 1][formattedTime] >= 40
                                ? "혼잡"
                                : data[i + 1][formattedTime] < 20
                                ? "여유"
                                : "보통";
                            const nextColor =
                              getCongestionColor(nextCongestion);

                            congestionObj.push({
                              direction: data[i + 1]["상하구분"],
                              congestion: nextCongestion,
                              color: nextColor, // 색상 추가
                            });
                          }

                          item.congestion = congestionObj;

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

  const getData = () => {
    //리뷰 불러오기
    instance
      .get(`/review/list`)
      .then((res) => {
        const filteredReviews = res.data.data.filter(
          (review) => review.storeId === storeId
        );
        setReviews(filteredReviews);
         // 서버에서 반환되는 리뷰 데이터에 좋아요 수(likeCount)를 포함해서 처리
         console.log(filteredReviews);
         const reviewsWithLikes = filteredReviews.map((review) => ({
            ...review,
            liked: false, // 좋아요 상태는 기본적으로 false
            likeCount: review.likeCount || 0, // 서버에서 받은 likeCount 값을 사용하여 초기값 설정
          }));
          console.log(res);
  
          setReviews(reviewsWithLikes); // 리뷰 목록 상태 업데이트
  
          // 리뷰별로 좋아요 상태 가져오기
          reviewsWithLikes.forEach((review) => {
            instance
              .get(`/review/likes/status?reviewId=${review.reviewId}`)
              .then((statusRes) => {
                console.log(review);
                // 해당 리뷰에 대한 좋아요 상태를 갱신
                setReviews((prevReviews) =>
                  prevReviews.map((r) =>
                    r.reviewId === review.reviewId
                      ? { ...r, liked: statusRes.data }
                      : r
                  )
                );
              })
              .catch((error) => {
                console.error("좋아요 상태 확인 실패:", error);
              });
          });
      })
      .catch((error) => {
        console.error("리뷰 목록 가져오기 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getReviewCountByStoreId = () => {
    instance
      .get(`/review/getReviewCountByStoreId?storeId=${storeId}`)
      .then((res) => {
        setReviewCount(res.data);
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

          Swal.fire(
            isLiked ? "좋아요 취소" : "좋아요",
            isLiked
              ? "리뷰의 좋아요가 취소되었습니다."
              : "리뷰에 좋아요가 추가되었습니다.",
            "success"
          );
        }
      })
      .catch((error) => {
        console.error(isLiked ? "좋아요 취소 실패" : "좋아요 추가 실패", error);
        Swal.fire(
          "실패",
          isLiked
            ? "좋아요 취소에 실패했습니다."
            : "좋아요 추가에 실패했습니다.",
          "error"
        );
      });
  };

  useEffect(() => {
    getMap();
    getData();
  }, [storeId]);

  //리뷰가 있으면 getRatingAvgByStoreId 실행으로 변경
  useEffect(() => {
    getReviewCountByStoreId();
    
  }, []);

  const handleReserveClick = () => {
    setIsPanelOpen(true);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 스크롤 이벤트 처리 함수
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({
      behavior: "smooth", // 부드럽게 스크롤
      block: "start", // 스크롤할 때 상단에 맞추기
    });
  };

  console.log(reviews);

  return (
    <>
      <h2>{storeData.storeName}</h2>
      <p>
        별점 : {avgRating}({reviewCount}) tel : {storeData.phone}
      </p>

      <Button onClick={() => scrollToSection("description")}>가게 설명</Button>
      <Button onClick={() => scrollToSection("menu")}>메뉴</Button>
      <Button onClick={() => scrollToSection("review")}>리뷰</Button>
      <Button onClick={() => scrollToSection("map")}>상세위치</Button>
      <Button onClick={() => scrollToSection("info")}>상세정보</Button>

      <h4 id="description">가게 설명</h4>
      <p>{storeData.description}</p>

      <h2 id="menu">메뉴 리스트</h2>
      <MenuList />

      <h1 id="review">리뷰 목록</h1>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.reviewId}>
              <strong>작성자:</strong>
              <Link to={`/review/${review.username}`}>{review.username}</Link>
              <br />
              <strong>가게 이름:</strong> {review.storeName} <br />
              <strong>별점:</strong> {review.rating} ⭐
              <br />
              <strong>리뷰:</strong> {review.reviewComment}
              <br />
              <strong>좋아요:</strong> {review.likeCount} ❤️
              <br />
              <button
                onClick={() => handleLikeClick(review.reviewId, review.liked)}
              >
                {review.liked ? "좋아요 취소" : "좋아요"}
              </button>
              {/* 파일 첨부 부분 */}
              {review.files.length > 0 && (
                <div>
                  <strong>첨부된 파일:</strong>
                  <div>
                    {review.files.map((fileItem, index) => (
                      <img
                        key={index}
                        src={`${process.env.REACT_APP_HOST}/file/view/${fileItem.saveFileName}`}
                        alt={`첨부 파일 ${index + 1}`}
                        style={{
                          width: "100px",
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

      <KakaoMap
        center={{ lat: storeData.latlng.lat, lng: storeData.latlng.lng }}
        style={{ width: "1000px", height: "600px" }}
        level={3}
        id="map"
      >
        {isReady && (
          <EventMarkerContainer
            key={`EventMarkerContainer-${storeData.latlng.lat}-${storeData.latlng.lng}`}
            position={storeData.latlng}
            content={storeData.content}
          />
        )}
      </KakaoMap>

      <h4 id="info">상세 정보</h4>
      <p>가게 주소: {storeData.address}</p>
      <p>영업시간: {storeData.storeHours}</p>
      <p>연락처: {storeData.phone}</p>

      <button className="reserve-button-info" onClick={handleReserveClick}>
        예약하기
      </button>

      <SlideUpModal
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        selectedStoreId={storeId}
      />
    </>
  );
};

export default StoreInfo;
