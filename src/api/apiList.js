import instance from "./api";

export const apiTestFindAll = async () => {
  return instance.get("/cmmn/findAll").then((res) => res.data);
};

/**
 * 전체 가계 목록
 * @returns
 */
export const apiAllStoreList = async () => {
  return instance.get("/store/list").then((res) => res.data);
};
