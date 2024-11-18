import { Link, useLocation } from "react-router-dom";
import Reserve from "../reserve/Reserve";
import { useSelector } from "react-redux";
import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Map as KakaoMap, MapMarker } from "react-kakao-maps-sdk";
import { useMap } from "react-kakao-maps-sdk";
import { getUserInfo } from "../../hooks/userSlice";
import { apiStoreViewByStoreId } from "../../webapi/webApiList";
import "../../css/SlideUpPanel.css";

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
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const userInfo = useSelector(getUserInfo);

  const getData = () => {
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

  useEffect(() => {
    getData();

    const handleScroll = () => {
      const footer = document.querySelector("footer");
      const reserveButtonHeight = 60;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        footer.style.marginBottom = `${reserveButtonHeight}px`;
      } else {
        footer.style.marginBottom = `0px`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [storeId]);

  // 예약 버튼 클릭 시 패널을 여는 함수
  const handleReserveClick = (storeId) => {
    setSelectedStoreId(storeId);
    setIsPanelOpen(true);
    setTimeout(() => {
      const modalBackground = document.querySelector(".modal-background");
      const slideUpPanel = document.querySelector(".slide-up");
      if (modalBackground && slideUpPanel) {
        modalBackground.classList.add("active");
        slideUpPanel.classList.add("active");
      }
    }, 100); // 약간의 딜레이 후 애니메이션을 위한 클래스 추가
    document.body.style.overflow = "hidden"; // 스크롤 비활성화
  };

  // 모달창 바깥을 클릭했을 때 모달을 닫는 함수
  const handleBackgroundClick = (e) => {
    if (e.target.className.includes("modal-background")) {
      const modalBackground = document.querySelector(".modal-background");
      const slideUpPanel = document.querySelector(".slide-up");
      if (modalBackground && slideUpPanel) {
        modalBackground.classList.remove("active");
        slideUpPanel.classList.remove("active");
      }
      setTimeout(() => {
        setIsPanelOpen(false);
        document.body.style.overflow = "auto"; // 스크롤 다시 활성화
      }, 500); // 모달 애니메이션 시간 후에 스크롤을 다시 활성화
    }
  };

  // 모달이 닫힐 때 스크롤 다시 활성화
  useEffect(() => {
    if (!isPanelOpen) {
      document.body.style.overflow = "auto";
    }
  }, [isPanelOpen]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <h2>{storeData.storeName}</h2>
      <p>별점 : ? 리뷰개수, tel : {storeData.phone}</p>
      <p>{storeData.description}</p>

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

      {/* 예약 버튼 */}
      <button
        className="reserve-button-info"
        onClick={() => handleReserveClick(storeId)}
      >
        예약하기
      </button>

      {/* 슬라이드 업 예약 폼 모달 */}
      {isPanelOpen && (
        <div className="modal-background" onClick={handleBackgroundClick}>
          <div className={`slide-up ${isPanelOpen ? "active" : ""}`}>
            <Reserve
              isPanelOpen={isPanelOpen}
              setIsPanelOpen={setIsPanelOpen}
              selectedStoreId={selectedStoreId}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StoreInfo;
