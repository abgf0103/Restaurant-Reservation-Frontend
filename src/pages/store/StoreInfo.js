import { Link, useLocation } from "react-router-dom";
import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { useMap } from "react-kakao-maps-sdk";
import { apiStoreViewByStoreId } from "../../webapi/webApiList";
import SlideUpModal from "../../components/SlideUpModal";
import "../../css/Style.css";
import MenuList from "./MenuList";
import axios from "axios";
import { Button } from "react-bootstrap";
import moment from "moment";

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

  const getRatingAvgByStoreId = () => {
    instance
     .get(`/review/getRatingAvgByStoreId?storeId=${storeId}`)
     .then((res) => {
        setAvgRating(res.data);
      });
  }

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
      })
      .catch((error) => {
        console.error("리뷰 목록 가져오기 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [nearByStationList, setNearByStationList] = useState([]);

  useEffect(() => {
    getMap();
    getData();
    getRatingAvgByStoreId();
  }, [storeId]);

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

  return (
    <>
      <h2>{storeData.storeName}</h2>
      <p>별점 : {avgRating} 리뷰개수, tel : {storeData.phone}</p>

      <Button onClick={() => scrollToSection("description")}>가게 설명</Button>
      <Button onClick={() => scrollToSection("menu")}>메뉴</Button>
      <Button onClick={() => scrollToSection("review")}>리뷰</Button>
      <Button onClick={() => scrollToSection("map")}>상세위치</Button>
      <Button onClick={() => scrollToSection("info")}>상세정보</Button>

      <h4 id="description">가게 설명</h4>
      <p>{storeData.description}</p>

      <h2 id="menu">메뉴 리스트</h2>
      <MenuList />

      {reviews.length > 0 && <h3 id="review">리뷰 목록</h3>}
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.reviewId}>
              <strong>작성자:</strong>
              <Link to={`/review/${review.username}`}>{review.username}</Link>
              <br />
              <strong>가게 이름:</strong> {review.storeName}
              <br />
              <strong>별점:</strong> {review.rating} ⭐
              <br />
              <strong>리뷰:</strong> {review.reviewComment}
              <br />
              <strong>좋아요:</strong> {review.likeCount} ❤️
              <br />
            </li>
          ))}
        </ul>
      ) : (
        <p id="review">{storeData.storeName}에 대한 작성된 리뷰가 없습니다.</p>
      )}

      <ul>
        {nearByStationList.length > 0 &&
          nearByStationList.map((item, index) => {
            return (
              <li key={index}>
                {item.place_name}에서 {item.distance}m
                {item?.congestion.map((item, index) => {
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
                })}
              </li>
            );
          })}
      </ul>

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
