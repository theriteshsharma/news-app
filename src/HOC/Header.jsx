import { Row, Col, Button, Space, Image } from "antd";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/auth-context";
import logo from "../assets/logo.png";
import { deleteCookie } from "../utils";
export default function Header() {
  const Auth = useContext(AuthContext);
  const nav = useNavigate();
  return (
    <>
      <Row
        justify={"space-around"}
        align={"middle"}
        style={{
          height: 64,
          color: "primary",
          paddingBottom: "5rem",
          paddingTop: "1rem",
        }}
      >
        <Col>
          <Image src={logo} height={50} />
          {/* <Typography.Title level={3}>FOX NEWS</Typography.Title> */}
        </Col>
        <Col>
          {Auth.authenticated ? (
            <Space>
              <Link to={"/"}>
                <Button type="text">Home</Button>
              </Link>
              <Link to={"/dashboard"}>
                <Button type="text">Dashboard</Button>
              </Link>
              {Auth.user?.isAdmin ? (
                <Link to={"/admin"}>
                  <Button>Admin</Button>
                </Link>
              ) : (
                ""
              )}
              <Link to={"/categories"}>
                <Button>Categories</Button>
              </Link>
              <Button
                danger
                onClick={() => {
                  document.cookie = "";
                  deleteCookie("token");
                  Auth.setAuthenticated(false);
                  nav("/");
                }}
              >
                Logout
              </Button>
            </Space>
          ) : (
            <Space>
              <Link to={"login"}>
                <Button>Login</Button>
              </Link>
              <Link to={"register"}>
                <Button type={"primary"}>Register</Button>
              </Link>
            </Space>
          )}
        </Col>
      </Row>
    </>
  );
}
