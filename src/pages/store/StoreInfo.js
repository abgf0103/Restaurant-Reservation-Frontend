import { Link, useLocation } from "react-router-dom";
import Reserve from "../reserve/Reserve";
import { useSelector } from "react-redux";
import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { useMap } from "react-kakao-maps-sdk";
import { getUserInfo } from "../../hooks/userSlice"; // 로그인된 사용자 정보 가져오기
import {
  getAllReservationsByUserId,
  apiStoreViewByStoreId,
} from "../../webapi/webApiList";

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
  const storeId = location.state; // storeId는 useLocation에서 전달된 상태로 받음

  // 가게 정보와 리뷰 상태 설정
  const [storeData, setStoreData] = useState({
    storeName: "",
    latlng: { lat: 0, lng: 0 },
  });
  const [isReady, setIsReady] = useState(false);
  const [reviews, setReviews] = useState([]); // 초기값을 빈 배열로 설정
  const [reservations, setReservations] = useState([]); // 초기값을 빈 배열로 설정
  const [loading, setLoading] = useState(true);

  // 로그인된 사용자 정보 가져오기
  const userInfo = useSelector(getUserInfo); // Redux에서 사용자 정보 가져오기
  const username = userInfo?.username; // 로그인된 사용자의 username

  // 가게 정보 및 리뷰, 예약 데이터 가져오기
  const getData = () => {
    // getAllReservationsByUserId(userInfo.id).then((res) => {
    //   console.log("예약 목록:", res); // 여기서 확인
    //   if (res && Array.isArray(res)) {
    //     setReservations(res); // 배열이 맞으면 상태 업데이트
    //   } else {
    //     setReservations([]); // 데이터가 없으면 빈 배열로 처리
    //   }
    // });

    // 가게 정보 받아오기
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
          } else {
            console.error("Geocoder failed due to:", status);
          }
        });
      }
    });

    // 해당 가게의 리뷰 목록을 가져오기
    instance
      .get(`/review/list`) // 전체 리뷰 목록을 가져오는 API
      .then((res) => {
        const filteredReviews = res.data.data.filter(
          (review) => review.storeId === storeId
        );
        console.log("리뷰 목록:", filteredReviews); // 여기서 확인
        setReviews(filteredReviews);
      })
      .catch((error) => {
        console.error("리뷰 목록 가져오기 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, [storeId]); // storeId가 변경될 때마다 데이터 재요청

  // 예약 목록 표시용 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // 로케일에 맞는 날짜 형식으로 변환
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <h2>{storeData.storeName}</h2>
      <p>별점 : ? 리뷰개수, tel : {storeData.phone}</p>
      <p>{storeData.description}</p>

      {/* 리뷰 작성 페이지 링크 */}
      {reviews.length > 0 && <h3>리뷰 목록</h3>}
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
        <p>{storeData.storeName}에 대한 작성된 리뷰가 없습니다.</p>
      )}

      {/* 예약 목록 표시 */}
      <h3>예약 목록</h3>
      {reservations && reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.reserveId}>
              <strong>예약자:</strong> {reservation.username}
              <br />
              <strong>예약 날짜:</strong> {formatDate(reservation.reserveDate)}
              <br />
              {/* 리뷰 작성 링크 */}
              <Link to={`/writeReview/${storeId}/${reservation.reserveId}`}>
                리뷰 작성
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>예약 목록이 없습니다.</p>
      )}

      {/* 지도 표시 */}
      <p>지도</p>
      <KakaoMap
        center={{ lat: storeData.latlng.lat, lng: storeData.latlng.lng }}
        style={{ width: "1000px", height: "600px" }}
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

      <p>{storeData.storeStatus}</p>
      <p>{storeData.storeHours}</p>
      <Reserve />
    </>
  );
};

export default StoreInfo;
