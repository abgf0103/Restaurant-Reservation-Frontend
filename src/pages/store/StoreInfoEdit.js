import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserInfo } from "../../hooks/userSlice";
import { useEffect, useState } from "react";
import instance from "../../api/instance";
import { Button, Card } from "react-bootstrap";

const StoreInfoEdit = (props) => {
    console.log(props);
    return (
        <div>
            <h2>가게 정보 수정 페이지</h2>
        </div>
    );
};
export default StoreInfoEdit;
