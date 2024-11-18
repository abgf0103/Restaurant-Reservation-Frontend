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
import ReviewEdit from "./pages/review/ReviewEdit";
import ReviewList from "./pages/review/ReviewList";
import UserEdit from "./pages/user/UserEdit";
import Mypage from "./pages/user/Mypage";
import StoreSearch from "./pages/store/StoreSearch";
import MyReview from "./pages/review/MyReview";
import { Provider } from "react-redux";
import store from "./hooks/store";
import MyStore from "./pages/store/MyStore";
import SearchResult from "./pages/store/SearchResult";
import Reserve from "./pages/reserve/Reserve";
import MyReserve from "./pages/reserve/MyReserve";
import RegisterStore from "./pages/store/RegisterStore";
import Map from "./map/Map";
import Landing from "./Landing";
import StoreList from "./pages/store/StoreList";
import UserReviewPage from "./pages/review/UserReviewPage";
import FileTest from "./pages/file/FileTest";
//import MenuEdit from "./pages/store/MenuEdit";

const ROLES = {
  ROLE_USER: 1,
  ROLE_ADMIN: 2,
  ROLE_SYSTEM: 3,
};

function App() {
  return (
    <Provider store={store}>
      <AppLayout>
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
          <Route path="/user/mypage" element={<Mypage />} />
          <Route path="/user/searchresult" element={<SearchResult />} />
          <Route path="/user/reserve" element={<Reserve />} />
          <Route path="/user/MyReserve" element={<MyReserve />} />
          {/* store 부분 */}
          <Route path="/store/info/*" element={<StoreInfo />} />
          <Route path="/store/info/*" element={<StoreInfo />} />
          <Route path="/store/list" element={<StoreList />} />
          <Route path="/store/mystore" element={<MyStore />} />
          <Route path="/store/edit/:storeId" element={<StoreInfoEdit />} />
          <Route path="/store/search" element={<StoreSearch />} />
          <Route path="/store/register" element={<RegisterStore />} />
          {/*<Route path="/store/menu/edit/:storeId" element={<MenuEdit />} />*}
            
            {/* 기타 */}
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
