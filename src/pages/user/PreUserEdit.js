import { useNavigate } from "react-router-dom";

const PreUserEdit = () => {
  const navigate = useNavigate();

  const gore = () => {
    navigate("/user/signup");
  };

  const gobe = () => {
    navigate("/user/businessSignup");
  };

  return (
    <div>
      <button type="button" onClick={gore}>
        일반 회원
      </button>
      <button type="button" onClick={gobe}>
        사업자 회원
      </button>
    </div>
  );
};

export default PreUserEdit;
