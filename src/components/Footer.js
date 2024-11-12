import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const Footer = () => {
<<<<<<< HEAD
  return (
    <footer>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="/">메인페이지</Nav.Link>
            <Nav.Link href="/store/search">검색페이지</Nav.Link>
            <Nav.Link href="/reserve/myreserve">나의 예약페이지</Nav.Link>
            <Nav.Link href="/store/edit">가게 정보 수정 페이지</Nav.Link>{" "}
            {/* 사업자 회원만 보이게 */}
            <Nav.Link href="/user/mypage">마이페이지</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </footer>
  );
=======
    return (
        <footer>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link href="/">메인페이지</Nav.Link>
                        <Nav.Link href="/store/search">검색페이지</Nav.Link>
                        <Nav.Link href="/user/myreserve">나의 예약페이지</Nav.Link>
                        <Nav.Link href="/store/mystore">나의 가게 페이지</Nav.Link> {/* 사업자 회원만 보이게 */}
                        <Nav.Link href="/user/mypage">마이페이지</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </footer>
    );
>>>>>>> 909298fb7621cda15af29c18e1a58cf0c4327a52
};
export default Footer;
