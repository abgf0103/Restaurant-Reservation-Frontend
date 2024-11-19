import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import instance from '../../api/instance';
import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDaumPostcodePopup } from 'react-daum-postcode';


const MenuEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const storeId = location.state.storeId;
    const menuId = location.state.menuId;


    //유저정보 가져오기
    const [userInfo, setUserInfo] = useState('');
    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
        }
    }, []);

    // 로그인 상태 체크
    // useEffect(() => {
    //     console.log(userInfo);
    //     if (!userInfo.username) {
    //     // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    //     navigate("/user/login");
    //     }
    // }, [navigate, userInfo]);

    // 메뉴 정보 가져오기
    const [menuData, setMenuData] = useState({
        menuName: '',
        description: '',
        price: '',
    });
    useEffect(() => {
        instance.get(`/store/menu/getMenuById?menuId=${menuId}`)
        .then((res) => {
            setMenuData(res.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    console.log(menuData);

    // 메뉴 정보를 입력할때마다 이벤트를 발생시켜 값을 저장
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setMenuData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    }

    //메뉴 수정 API 호출
    const requestStoreRegister = (e) => {
        e.preventDefault();
        

        instance.post("/store/menu/update", {
            menuId: menuId,
            menuName: menuData.menuName,
            description: menuData.description,
            price: menuData.price,
        }).then(() => {
            Swal.fire({
                title: "성공",
                text: "메뉴 수정이 완료되었습니다.",
                icon: "success",
            });
          }).catch((error) => {
            console.error("메뉴 수정 오류:", error);
            Swal.fire({
                title: "실패",
                text: "메뉴 수정에 실패했습니다.",
                icon: "error",
            });
        });
    };
    console.log()


    return (
        <div>
            <Form onSubmit={requestStoreRegister}>
                <Form.Group className="mb-3">
                    <Form.Label><h2>메뉴 수정</h2></Form.Label>
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label>메뉴 이름</Form.Label>
                    <Form.Control placeholder="메뉴 이름을 입력하세요" name='menuName' value={menuData.menuName} onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>메뉴 설명</Form.Label>
                    <Form.Control placeholder="메뉴 설명을 입력하세요" name='description' value={menuData.description} onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가격을 설정하세요</Form.Label>
                    <Form.Control type='number' name='price' placeholder="가격을 설정하세요" value={menuData.price} onChange={onChangeHandler} required/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    메뉴 수정
                </Button>
            </Form>
        </div>
        
    );
};
export default MenuEdit;
