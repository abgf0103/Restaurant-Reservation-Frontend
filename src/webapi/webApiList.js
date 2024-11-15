import instance from "../api/instance";

export const apiTestFindAll = async () => {
  return instance.get("/cmmn/findAll").then((res) => res.data);
};

/**
 * =======================================================
 * 목차
 * 1. 가계 데이터
 * 2. 사용자 데이터
 *
 *
 *
 *
 *
 */

/** 1. 가계 데이터 시작 */

/**
 * 전체 가계 목록
 * @returns
 */
export const apiAllStoreList = async () => {
  return instance.get("/store/list").then((res) => res.data);
};

/**
 * 사용자 id로 예약 목록 전체 조회
 * @param {*} userId
 * @returns
 */
export const getAllReservationsByUserId = async (userId) => {
  return await instance
    .get(`/reservations/user/${userId}`)
    .then((res) => res.data);
};

/**
 * 가계의 리뷰 데이터
 * @param {*} storeId
 * @returns
 */
export const apiStoreViewByStoreId = async (storeId) => {
  return await instance.get(`/store/view/${storeId}`).then((res) => res.data);
};

/** 1. 가계 데이터 끝 */
