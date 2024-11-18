import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserInfo } from "../../hooks/userSlice";
import { useEffect, useState } from "react";
import instance from "../../api/instance";
import { Button, Card } from "react-bootstrap";

const MenuEdit = () => {


    return (
        <div>
            <h2>메뉴 관리</h2>
        </div>
    );
};
export default MenuEdit;
