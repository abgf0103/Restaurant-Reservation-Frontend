import { useSelector } from "react-redux";
import { getUserInfo } from "../hooks/userSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const userInfo = useSelector(getUserInfo);
  const location = useLocation();
  return userInfo?.roles?.find((role) => allowedRoles?.includes(role.id)) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauth" state={{ from: location }} replace />
  );
};

export default RequireAuth;
