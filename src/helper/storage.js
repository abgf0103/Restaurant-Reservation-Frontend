export const setStorageToken = (token) => {
  localStorage.setItem("token", JSON.stringify(token));
};

export const removeStorageToken = () => {
  localStorage.removeItem("token");
};

export const getStorageToken = () => {
  return JSON.parse(localStorage.getItem("token"));
};
