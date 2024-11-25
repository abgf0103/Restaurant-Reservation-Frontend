import instance from "../../api/instance";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Style.css";
import { getUserInfo } from "../../hooks/userSlice";
import { useSelector } from "react-redux";
import { isNotLoginSwal } from "../../utils/tools";

const FavoritePage = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState([]);
  const userInfo = useSelector(getUserInfo);
  const [isFavorite, setIsFavorite] = useState({});

  // 가게 정보를 API로 받아서 state에 저장
  const getDefaultStoreList = () => {
    instance
      .get(`/store/getFavoriteStoreList?userId=${userInfo.id}`)
      .then((res) => {
        console.log(res.data);
        setStoreData(res.data);
      });
  };

  // 즐겨찾기 등록 버튼 클릭 핸들러
  const favoriteClickHandler = (storeId) => {
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
  };

  // 즐겨찾기 취소 버튼 클릭 핸들러
  const favoriteCancelClickHandler = (storeId) => {
    instance
      .post(`/favorite/checkFavoriteByUserStore`, {
        userId: userInfo.id,
        storeId: storeId,
      })
      .then((res) => {
        instance
          .delete(`/favorite/deleteFavoriteById?favoriteId=${res.data}`)
          .then(() => {
            setIsFavorite((prevFavorites) => ({
              ...prevFavorites,
              [storeId]: false,
            }));
          });
      });
  };

  // 즐겨찾기 여부 확인
  const checkFavorite = () => {
    console.log(userInfo);
    instance
      .get(`/store/getFavoriteStoreList?userId=${userInfo.id}`)
      .then((res) => {
        console.log(res.data);
        const favorites = res.data.reduce((acc, store) => {
          acc[store.storeId] = true;
          return acc;
        }, {});
        setIsFavorite(favorites); // 즐겨찾기 상태 업데이트
      });
  };

  useEffect(() => {
    getDefaultStoreList();
  }, []);

  // 페이지 로드 시 사용자의 즐겨찾기 정보 불러오기
  useEffect(() => {
    if (userInfo.id) {
      checkFavorite(); // 사용자의 즐겨찾기 목록을 가져옵니다.
    }
  }, [userInfo.id]); // userInfo.id가 바뀔 때마다 실행

  // 로그인 상태 체크
  useEffect(() => {
    if (!userInfo.username) {
      // 로그인 안 되어 있으면 swal출력 후 로그인 페이지로 리다이렉트
      isNotLoginSwal();
      navigate("/user/login");
    }
  }, [navigate, userInfo]);

  return (
    <div>
      <h3>내 즐겨찾기 목록</h3>
      <ul>
        {storeData.length === 0 ? (
          <p>즐겨찾기한 가게가 없습니다.</p>
        ) : (
          storeData.map((item) => (
            <li key={item.storeId}>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Link to={"/store/info"} state={item.storeId}>
                    <Card.Img
                      variant="top"
                      src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                    />
                    <Card.Title>{item.storeName}</Card.Title>
                    <Card.Text>⭐4.5 (Identity)</Card.Text>
                  </Link>
                  {/* isFavorite 상태에 따라 버튼 변경 */}
                  {isFavorite[item.storeId] ? (
                    <Button
                      onClick={() => favoriteCancelClickHandler(item.storeId)}
                    >
                      X
                    </Button>
                  ) : (
                    <Button onClick={() => favoriteClickHandler(item.storeId)}>
                      🔖
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FavoritePage;
