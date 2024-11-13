
// import { apiAllStoreList } from "../../api/apiList";
import { useMap } from 'react-kakao-maps-sdk';
import { useState } from 'react';
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { useEffect } from 'react';
import instance from './../api/instance';

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
    getStoreList();
  }, []);

  return (
    <div>
      <h2>지도 화면</h2>
      <KakaoMap
        center={{ lat: 37.5679554, lng: 126.9829607 }}
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
