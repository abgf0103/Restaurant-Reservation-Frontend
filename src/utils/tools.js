import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


// 숫자에 3자리마다 쉼표 추가하는 함수
export const convertToWon = (num) => {
    if (num == null) return ""; // null 또는 undefined 처리
    return "₩" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const isNotLoginSwal = () => {

    Swal.fire({
        title: "로그인이 필요합니다",
        text: "로그인 페이지로 이동합니다",
        icon: "warning",
    });
};

//예약 상태를 코멘트로 반환
export const reserveStatus = (status) => {
    switch (status) {
        case 0:
            return "예약대기";
        case 1:
            return "예약확정";
        case 2:
            return "완료";
        case 3:
            return "예약취소";
        default:
            return "";
    }
};

// 전화번호 자동 하이픈 추가
export const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) {
        return cleaned;
    } else if (cleaned.length <= 7) {
        return cleaned.replace(/(\d{3})(\d{0,4})/, "$1-$2");
    } else {
        return cleaned.replace(/(\d{3})(\d{0,4})(\d{0,4})/, "$1-$2-$3");
    }
};