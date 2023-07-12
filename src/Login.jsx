import { Row, Col, Input, Button, Space, Typography, Alert } from "antd";
import { useContext, useEffect, useState } from "react";
import { post } from "./utils/api";
import AuthContext from "./context/auth-context";
import { createCookieInHour } from "./utils";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const Auth = useContext(AuthContext);

  let nav = useNavigate();

  useEffect(() => {
    if (Auth.authenticated) {
      nav("/dashboard");
    }
  }, [Auth, nav]);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    let _data = { ...data };
    _data[e.target.name] = e.target.value;
    setData(_data);
  };

  const handleFormSubmit = async () => {
    setErr("");
    try {
      let res = await post("/user/login", data);

      if (res.status) {
        setErr(res.message);
      } else {
        Auth.setAuthenticated(true);
        Auth.setUser(res.user);
        console.log(Auth.user);

        createCookieInHour("token", res.token, 1);
        nav("/dashboard");
      }
      //nav.target("/login");
    } catch (err) {
      setErr(err.message);
    }
  };
  return (
    <>
      <Row justify="center" align="middle" style={{ height: "80vh" }}>
        <Col lg={8}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={2}>Login</Title>

            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={data.email}
              size="large"
              onChange={handleChange}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              size="large"
              value={data.password}
              onChange={handleChange}
            />
            <Button
              onClick={handleFormSubmit}
              size="large"
              block
              type="primary"
            >
              Login
            </Button>

            {err == "" ? "" : <Alert type="error" message={err} />}
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default Login;
