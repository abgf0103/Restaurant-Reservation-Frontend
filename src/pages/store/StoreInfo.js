import { Link, useLocation, useParams } from "react-router-dom";
import Reserve from "../reserve/Reserve";
import { useSelector } from "react-redux";
import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { useMap } from "react-kakao-maps-sdk";

const { kakao } = window;

const EventMarkerContainer = ({ position, content }) => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState(false);

  console.log(position);
  console.log(content);
  return (
    <MapMarker
      position={position} // 마커를 표시할 위치
      // @ts-ignore
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

  // 가게 정보를 저장하기 위한 state 선언
  const [storeData, setStoreData] = useState({
    storeName: "",
    latlng: {
      lat: 0,
      lng: 0,
    },
  });
  const [isReady, setIsReady] = useState(false);

  // 가게 정보를 API로 받아서 state에 저장
  const getData = () => {
    instance.get(`/store/view/${storeId}`).then((res) => {
      console.log(res.data);
      if (window.kakao && res.data?.address) {
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(res.data.address, function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(
              Number(result[0].y),
              Number(result[0].x)
            );
            console.log("위도:", coords.getLat());
            console.log("경도:", coords.getLng());
            res.data.content = res.data.storeName;

            res.data.latlng = {
              lat: coords.getLat(),
              lng: coords.getLng(),
            };
            console.log(res.data);
            setStoreData(res.data);
            setIsReady(true);
          } else {
            console.error("Geocoder failed due to:", status);
          }
        });
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h2>{storeData.storeName}</h2>
      <p>별점 : ? 리뷰개수, tel : {storeData.phone}</p>
      <p>{storeData.description}</p>
      <Link to="/review">리뷰작성 페이지</Link>
      <p>
        <Link to={`/map/${storeId}`}>지도 자세히 보기</Link>
      </p>
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
