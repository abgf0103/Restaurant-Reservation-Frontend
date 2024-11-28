import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Login from "./pages/user/Login";
import NotFound from "./pages/error/NotFound";
import UnAuth from "./pages/error/UnAuth";
import RequireAuth from "./components/RequireAuth";
import Test from "./pages/test/Test";
import Review from "./pages/review/Review";
import Signup from "./pages/user/Signup";
import StoreInfo from "./pages/store/StoreInfo";
import StoreInfoEdit from "./pages/store/StoreInfoEdit";
import PreUserEdit from "./pages/user/PreUserEdit";
import BusinessSignup from "./pages/user/BusinessSignup";
import ReviewEdit from "./pages/review/ReviewEdit";
import ReviewList from "./pages/review/ReviewList";
import UserEdit from "./pages/user/UserEdit";
import CheckUserEdit from "./pages/user/CheckUserEdit";
import DeleteUser from "./pages/user/deleteUser";
import FindPasswordForm from "./pages/user/findPassword";
import FavoritePage from "./pages/user/favoritePage";
import FindIdForm from "./pages/user/findID";
import Mypage from "./pages/user/Mypage";
import MyReview from "./pages/review/MyReview";
import { Provider } from "react-redux";
import store from "./hooks/store";
import MyStore from "./pages/store/MyStore";
import Reserve from "./pages/reserve/Reserve";
import MyReserve from "./pages/reserve/MyReserve";
import RegisterStore from "./pages/store/RegisterStore";
import Map from "./map/Map";
import Landing from "./Landing";
import StoreList from "./pages/store/StoreList";
import UserReviewPage from "./pages/review/UserReviewPage";
import FileTest from "./pages/file/FileTest";
import MenuEdit from "./pages/store/MenuEdit";
import RegisterMenu from "./pages/store/RegisterMenu";
import StoreReserve from "./pages/reserve/StoreReserve";
import MenuManagement from "./pages/store/MenuManagement";
import Admin from "./pages/Admin";
import FindIdResult from "./pages/user/findIdResult";
import FindPasswordResult from "./pages/user/findPasswordResult";
import { useState } from 'react';

const ROLES = {
  ROLE_USER: 1,
  ROLE_ADMIN: 2,
  ROLE_SYSTEM: 3,
};

function App() {
      // 로컬 스토리지에서 상태를 가져와 초기값 설정
  const storedActiveFooterIcon = localStorage.getItem("activeFooterIcon");
  const [activeFooterIcon, setActiveFooterIcon] = useState(storedActiveFooterIcon || "home");

  // 아이콘 클릭 시 상태 변경
  const handleFooterIconClick = (iconName) => {
    setActiveFooterIcon(iconName);
    localStorage.setItem("activeFooterIcon", iconName); // 로컬 스토리지에 상태 저장
  };

  return (
    <Provider store={store}>
      <AppLayout activeFooterIcon={activeFooterIcon} onFooterIconClick={handleFooterIconClick}>
        <Routes>
          <Route path="/writeReview/:storeId/:reserveId" element={<Review />} />{" "}
          {/* storeId를 URL 파라미터로 전달 */}
          {/* review 부분 */}
          <Route path="/review/list" element={<ReviewList />} />
          <Route path="/review/edit/:reviewId" element={<ReviewEdit />} />
          <Route path="/review/myreview" element={<MyReview />} />
          <Route path="/review/:username" element={<UserReviewPage />} />
          {/* user 부분 */}
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/signup" element={<Signup />} />
          <Route path="/user/edit" element={<UserEdit />} />
          <Route path="/user/CheckUserEdit" element={<CheckUserEdit />} />
          <Route path="/user/findPassword" element={<FindPasswordForm />} />
          <Route path="/user/findID" element={<FindIdForm />} />
          <Route path="/user/mypage" element={<Mypage />} />
          <Route path="/user/reserve" element={<Reserve />} />
          <Route path="/user/MyReserve" element={<MyReserve />} />
          <Route path="/user/deleteuser" element={<DeleteUser />} />
          <Route path="/user/PreUserEdit" element={<PreUserEdit />} />
          <Route path="/user/BusinessSignup" element={<BusinessSignup />} />
          <Route path="/user/FavoritePage" element={<FavoritePage />} />
          <Route path="/user/FindIdResult" element={<FindIdResult />} />
          <Route
            path="/user/FindPasswordResult"
            element={<FindPasswordResult />}
          />
          {/* store 부분 */}
          <Route path="/store/info/*" element={<StoreInfo />} />
          <Route path="/store/info/*" element={<StoreInfo />} />
          <Route path="/store/list" element={<StoreList />} />
          <Route path="/store/mystore" element={<MyStore />} />
          <Route path="/store/edit/:storeId" element={<StoreInfoEdit />} />
          <Route path="/store/register" element={<RegisterStore />} />
          <Route path="/store/menu/edit" element={<MenuEdit />} />
          <Route
            path="/store/menu/management/:storeId"
            element={<MenuManagement />}
          />
          <Route path="/store/menu/register" element={<RegisterMenu />} />
          {/* reserve 부분 */}
          <Route path="/store/reserve/:storeId" element={<StoreReserve />} />
          {/* 기타 */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/fileTest" element={<FileTest />} />
          <Route path="/map/:storeId" element={<Map />} />
          <Route path="/test" element={<Test />} />
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauth" element={<UnAuth />} />
          <Route
            path="/admin"
            element={
              <RequireAuth
                allowedRoles={[ROLES.ROLE_SYSTEM, ROLES.ROLE_ADMIN]}
              />
            }
          >
            <Route path="/admin/board" element={<div>board</div>} />
          </Route>
        </Routes>
      </AppLayout>
    </Provider>
  );
}

export default App;
