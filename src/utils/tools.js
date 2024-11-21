import Swal from "sweetalert2";

// 숫자에 3자리마다 쉼표 추가하는 함수
export const convertToWon = (num) => {
  if (num == null) return ''; // null 또는 undefined 처리
  return '₩' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const isNotLoginSwal = () => {
    Swal.fire({
    title: "권한 없음",
    text: "로그인이 필요합니다. 로그인 페이지로 이동합니다.",
    icon: "warning",
    });
};

//예약 상태를 코멘트로 반환
export const reserveStatus = (status) => {
  switch (status) {
    case '0':
      return "예약대기";
    case '1':
      return "예약확정";
    case '2':
      return "완료";
    case '3':
      return "예약취소";
    default:
      return "";
  }
}