import instance from "./api";

export const apiTestFindAll = async () => {
  return instance.get("/cmmn/findAll").then((res) => res.data);
};
