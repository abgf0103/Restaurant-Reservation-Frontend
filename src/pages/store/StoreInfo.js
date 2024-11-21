import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { useMap } from "react-kakao-maps-sdk";
import { getUserInfo } from "../../hooks/userSlice";
import { apiStoreViewByStoreId } from "../../webapi/webApiList";
import SlideUpModal from "../../components/SlideUpModal";
import "../../css/Style.css";
import MenuList from "./MenuList";
import axios from "axios";

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
                let tempData = res.data?.documents;
                let tempArr = [];
                tempData.forEach((item, index) => {
                  if (index <= 1) tempArr.push(item);
                });
                setNearByStationList(tempArr);
              });
          } else {
            console.error("Geocoder failed due to:", status);
          }
        });
      }
    });
  };

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
  }, [storeId]);

  const handleReserveClick = () => {
    setIsPanelOpen(true);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <h2>{storeData.storeName}</h2>
      <p>별점 : ? 리뷰개수, tel : {storeData.phone}</p>
      <p>{storeData.description}</p>

      <MenuList />

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

      <ul>
        {nearByStationList.length > 0 &&
          nearByStationList.map((item, index) => {
            return (
              <li key={index}>
                {item.place_name}에서 {item.distance}m
              </li>
            );
          })}
      </ul>

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
