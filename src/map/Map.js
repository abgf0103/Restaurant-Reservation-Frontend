// import { apiAllStoreList } from "../../api/apiList";
import { useMap } from "react-kakao-maps-sdk";
import { useState } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { useEffect } from "react";
import instance from "./../api/instance";
import { useParams } from "react-router-dom";

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

const Map = () => {
  const [storeList, setStoreList] = useState([]);
  const [isReady, setIsReady] = useState(false);
  // 파라미터로 넘어온 가계 id 확인
  const params = useParams();
  const [selectedStoreInfo, setSelectedStoreInfo] = useState({
    lat: 0,
    lng: 0,
  });

  const getStoreList = () => {
    instance.get("/store/list").then((res) => {
      console.log(res.data);
      let i = 0;
      let datas = [];
      res.data.forEach((item, index) => {
        console.log(item.address);
        if (window.kakao) {
          const geocoder = new kakao.maps.services.Geocoder();

          geocoder.addressSearch(item.address, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(
                Number(result[0].y),
                Number(result[0].x)
              );
              console.log("위도:", coords.getLat());
              console.log("경도:", coords.getLng());
              const dataItem = {};
              dataItem.latlng = {
                lat: coords.getLat(),
                lng: coords.getLng(),
              };
              dataItem.content = item.storeName;
              datas.push(dataItem);

              // 파라미터로 넘어온 가계 id가 비동기통신으로 가져온 항목의 id와 같으면
              // 아래의 코드 실행
              if (Number(params.storeId) === item.storeId) {
                {
                  console.log(datas);
                  console.log(datas[0]);
                  console.log(datas[item.storeId]);
                  console.log(Number(params.storeId));
                  console.log(item.storeId);
                  setSelectedStoreInfo(coords.getLat(), coords.getLng());
                  // setSelectedStoreInfo에 좌표값을 넣어준다.
                }
              }

              if (i === res.data.length - 1) {
                console.log(datas);
                setStoreList(datas);
                setIsReady(true);
              } else {
                setIsReady(false);
              }
              i++;
            } else {
              console.error("Geocoder failed due to:", status);
            }
          });
        }
      });
    });
  };

  useEffect(() => {
    console.log(params.storeId);
    getStoreList();
  }, []);

  return (
    <div>
      <h2>지도 화면</h2>
      <KakaoMap
        center={{ lat: selectedStoreInfo.lat, lng: selectedStoreInfo.lng }}
        style={{ width: "1000px", height: "600px" }}
        level={3}
      >
        {isReady &&
          storeList.map((value) => (
            <EventMarkerContainer
              key={`EventMarkerContainer-${value.latlng.lat}-${value.latlng.lng}`}
              position={value.latlng}
              content={value.content}
            />
          ))}
      </KakaoMap>
    </div>
  );
};
export default Map;
