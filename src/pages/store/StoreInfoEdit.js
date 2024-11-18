import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import instance from '../../api/instance';
import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useDaumPostcodePopup } from 'react-daum-postcode';


const RegisterStore = () => {
    const navigate = useNavigate();
    const { storeId } = useParams(); // URL에서 storeId를 추출
    const [address, setAddress] = useState([]);


    //유저정보 가져오기
    const [userInfo, setUserInfo] = useState('');
    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
        }
    }, []);

    // 가게 정보 가져오기
    const [storeData, setStoreData] = useState({
        storeHours: '',
        phone: '',
        description: '',
    });
    console.log(storeData);

    const getStoreData = () =>{
        instance.get(`/store/view/${storeId}`).then((res) => {
            setStoreData(res.data);
        });
    };

    useEffect(() => {
        getStoreData();
    }, []);


    // 가게 정보를 입력할때마다 이벤트를 발생시켜 값을 저장
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setStoreData((prevState) => ({
          ...prevState,
          [name]: value,
        }));

    }

    const [isAgrre, setIsAgree] = useState(false);

    const isAgreeHandler = (e) => {
        setIsAgree(e.target.checked);
    }





    const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
        let localAddress = data.sido + ' ' + data.sigungu;

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress = fullAddress.replace(localAddress, '');
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
            console.log(fullAddress);
            storeData.address = fullAddress;
            setAddress(fullAddress);
        }

         // setAddress를 호출하여 부모 컴포넌트의 상태를 업데이트
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };
    //가게 수정 API 호출
    const requestStoreRegister = (e) => {
        e.preventDefault();
        
        if(!isAgrre) {
            Swal.fire({
                title: "약관 확인",
                text: "가게 수정을 진행하려면 약관에 동의하세요.",
                icon: "warning",
            });
            return;
        }

        instance.post("/store/update", {
            storeId: storeData.storeId,
            address: storeData.address,
            storeHours: storeData.storeHours,
            phone: storeData.phone,
            description: storeData.description,
        }).then(() => {
            Swal.fire({
                title: "성공",
                text: "가게 수정이 완료되었습니다.",
                icon: "success",
            });
            navigate(`/store/mystore`);
          }).catch((error) => {
            console.error("가게 수정 오류:", error);
            Swal.fire({
                title: "실패",
                text: "가게 수정에 실패했습니다.",
                icon: "error",
            });
        });
    };

    return (
        <div>
            <h2>가게 수정 페이지</h2>
            <Form onSubmit={requestStoreRegister}>
                <Form.Group className="mb-3">
                    <Form.Label>{storeData.storeName}</Form.Label>
                    
                </Form.Group>

                <Form.Group className="mb-3">
                        <Button variant="primary" type="button" onClick={handleClick}>
                        주소 검색
                        </Button>
                    {/* 주소입력 다음 api 추가해서 도로명 주소 받도록 */}
                    <Form.Control placeholder="주소를 입력하세요" value={storeData.address} onChange={onChangeHandler} required/>
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label>영업시간 (ex/17:00~23:00)</Form.Label>
                    <Form.Control placeholder="영업시간을 입력하세요" name='storeHours' value={storeData.storeHours} onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>연락처</Form.Label>
                    <Form.Control placeholder="연락처를 입력하세요" name='phone' value={storeData.phone} onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가게 소개</Form.Label>
                    <Form.Control as="textarea" rows={4} name='description' placeholder="소개글을 입력하세요" value={storeData.description} onChange={onChangeHandler} required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="약관에 동의합니다" onChange={isAgreeHandler} checked={isAgrre}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                    가게 정보 수정
                </Button>
            </Form>
        </div>
    );
};
export default RegisterStore;
