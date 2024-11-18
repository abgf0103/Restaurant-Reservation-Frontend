import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import instance from '../../api/instance';
import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useDaumPostcodePopup } from 'react-daum-postcode';


const RegisterMenu = () => {
    const navigate = useNavigate();


    //유저정보 가져오기
    const [userInfo, setUserInfo] = useState('');
    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
        }
    }, []);

    // 메뉴 정보 가져오기
    const [menuData, setMenuData] = useState({
        menuName: '',
        description: '',
        price: '',
    });

    console.log(menuData);

    // const getMenuData = () =>{
    //     instance.get(`/store/view/${storeId}`).then((res) => {
    //         setStoreData(res.data);
    //     });
    // };

    // useEffect(() => {
    //     getStoreData();
    // }, []);


    // 메뉴 정보를 입력할때마다 이벤트를 발생시켜 값을 저장
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setMenuData((prevState) => ({
          ...prevState,
          [name]: value,
        }));

    }




    const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
        let localAddress = data.sido + ' ' + data.sigungu;

        // if (data.addressType === 'R') {
        //     if (data.bname !== '') {
        //         extraAddress += data.bname;
        //     }
        //     if (data.buildingName !== '') {
        //         extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
        //     }
        //     fullAddress = fullAddress.replace(localAddress, '');
        //     fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        //     console.log(fullAddress);
        //     storeData.address = fullAddress;
        //     setAddress(fullAddress);
        // }

         // setAddress를 호출하여 부모 컴포넌트의 상태를 업데이트
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };
    //가게 수정 API 호출
    const requestStoreRegister = (e) => {
        e.preventDefault();
        

        // instance.post("/menu/update", {
        //     storeId: storeData.storeId,
        //     address: storeData.address,
        //     storeHours: storeData.storeHours,
        //     phone: storeData.phone,
        //     description: storeData.description,
        // }).then(() => {
        //     Swal.fire({
        //         title: "성공",
        //         text: "가게 수정이 완료되었습니다.",
        //         icon: "success",
        //     });
        //     navigate(`/store/mystore`);
        //   }).catch((error) => {
        //     console.error("가게 수정 오류:", error);
        //     Swal.fire({
        //         title: "실패",
        //         text: "가게 수정에 실패했습니다.",
        //         icon: "error",
        //     });
        // });
    };
    console.log()


    return (
        <div>
            <h2>메뉴 추가</h2>
            <Form onSubmit={requestStoreRegister}>
                <Form.Group className="mb-3">
                    <Form.Label><h2></h2></Form.Label>
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
export default RegisterMenu;
