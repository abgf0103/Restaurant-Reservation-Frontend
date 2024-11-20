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