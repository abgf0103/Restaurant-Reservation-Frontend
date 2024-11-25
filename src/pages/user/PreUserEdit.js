import { useNavigate } from "react-router-dom";
import "./css/preUserEdit.css";

const PreUserEdit = () => {
  const navigate = useNavigate();

  const gore = () => {
    navigate("/user/signup");
  };

  const gobe = () => {
    navigate("/user/businessSignup");
  };

  return (
    <div className="chooseUser">
      <button type="button" onClick={gore} className="button1">
        일반 회원
      </button>
      <button type="button" onClick={gobe} className="button1">
        사업자 회원
      </button>
    </div>
  );
};

export default PreUserEdit;
