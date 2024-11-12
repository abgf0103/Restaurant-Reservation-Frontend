import React, { useEffect, useState } from "react";
import { Map as KakaoMap, useMap, MapMarker } from "react-kakao-maps-sdk";
const data = [
  {
    content: <div style={{ color: "#000" }}>맥도날드 서울시청점</div>,
    latlng: { lat: 37.5668136314671, lng: 126.979502322878 },
  },
  {
    content: <div style={{ color: "#000" }}>모수</div>,
    latlng: { lat: 37.5364779881564, lng: 126.999399541156 },
  },
  {
    content: <div style={{ color: "#000" }}>롯데리아 제기역점</div>,
    latlng: { lat: 37.5777504650845, lng: 127.032477193881 },
  },
  {
    content: <div style={{ color: "#000" }}>맥도날드 종로 3가점</div>,
    latlng: { lat: 37.5706083074284, lng: 126.990464570479 },
  },
];

const EventMarkerContainer = ({ position, content }) => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState(false);

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
  return (
    <div>
      <h2>지도 화면</h2>
      <KakaoMap
        center={{ lat: 37.5679554, lng: 126.9829607 }}
        style={{ width: "1000px", height: "600px" }}
        level={3}
      >
        {data.map((value) => (
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
