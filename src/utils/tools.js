import moment from "moment";
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

// 영업시간 표준화
export const formatStoreHours = (value) => {
    // 숫자만 남기기
    const cleaned = value.replace(/\D/g, "");

    // 입력값 길이에 따른 처리
    if (cleaned.length <= 2) {
        return cleaned; // 두 자리가 될 때까지 숫자만 반환
    } else if (cleaned.length <= 4) {
        // 첫 번째 시간(2자리) + ':' 추가
        return cleaned.replace(/(\d{2})(\d{0,2})/, "$1:$2");
    } else if (cleaned.length <= 6) {
        // 첫 번째 시간(2자리) + ':' + 두 번째 시간(2자리)까지
        return cleaned.replace(/(\d{2})(\d{2})(\d{0,2})/, "$1:$2~$3");
    } else {
        // 마지막까지 8자리를 다 채우면, 첫 번째 시간(2자리) + ':' + 두 번째 시간(2자리) + '~' + 세 번째 시간(2자리)까지
        return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{0,2})/, "$1:$2~$3:$4");
    }
};

// 영업시간 검증
export const validateStoreHours = (value) => {
    console.log(value);
    const [startTime, endTime] = value.split("~");

    console.log(startTime, endTime);

    // moment로 시작 시간과 종료 시간 생성
    const start = moment(startTime, "HH:mm"); // 시작 시간
    const end = moment(endTime, "HH:mm"); // 종료 시간
    console.log(start, end);
    if (start.isValid() && end.isValid()) {
        // 시작 시간이 종료 시간보다 이전인지를 검증
        if (start.isBefore(end)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

//문자열의 줄바꿈을 찾아 적용시키는 함수
export const convertNewlinesToBr = (text) => {
    if (!text) {
        return null; // 빈 문자열이나 null 또는 undefined일 경우 처리
    }
    return text.split("\n").map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
};