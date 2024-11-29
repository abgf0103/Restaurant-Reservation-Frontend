import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserInfo } from "../../hooks/userSlice";
import { useEffect, useState } from "react";
import instance from "../../api/instance";
import { Card } from "react-bootstrap";
import { convertToWon } from "../../utils/tools";

const MenuList = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo); // 로그인된 사용자 정보
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const storeId = location.state;

  const [menuList, setMenuList] = useState([]);

  // 가게 메뉴 가져오기
  useEffect(() => {
    instance
      .get("/store/menu/getMenuListByStoreId?storeId=" + storeId)
      .then((res) => {
        console.log(res.data);
        setMenuList(res.data); // 사용자 가게 목록 설정
      })
      .catch((error) => {
        console.error("메뉴 리스트 가져오기 실패:", error);
        Swal.fire({
          title: "실패",
          text: "메뉴 리스트 가져오는 데 실패했습니다.",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <main>
      {menuList.length > 0 ? (
        <ul>
          {menuList.map((item) => (
            <li key={item.menuId}>
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  src={`${process.env.REACT_APP_HOST}/file/view/${item.saveFileName}`}
                />
                <Card.Body>
                  <Card.Title>{item.menuName}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>{convertToWon(item.price)}</Card.Text>
                </Card.Body>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p>메뉴가 없습니다.</p>
      )}
    </main>
  );
};
export default MenuList;
