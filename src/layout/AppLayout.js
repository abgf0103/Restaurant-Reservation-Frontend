import Footer from "../components/Footer";
import Header from "../components/Header";

const AppLayout = ({ children, activeFooterIcon, onFooterIconClick }) => {
  return (
    <>
      <Header onFooterIconClick={onFooterIconClick}/>
      {children}
      <Footer activeFooterIcon={activeFooterIcon} onFooterIconClick={onFooterIconClick}/>
    </>
  );
};
export default AppLayout;
