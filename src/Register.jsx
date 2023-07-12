import { Row, Col, Input, Button, Space, Typography, Alert } from "antd";
import { useState } from "react";
import { post } from "./utils/api";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

function Register() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  let nav = useNavigate();
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    let _data = { ...data };
    _data[e.target.name] = e.target.value;
    setData(_data);
  };

  const handleFormSubmit = async () => {
    setErr("");
    setIsLoading(true);
    try {
      let res = await post("/user/register", data);

      if (res.message) {
        setErr(res.message);
      } else {
        nav("/login");
      }
      //nav.target("/login");
    } catch (err) {
      setErr(err.message);
    }
    setIsLoading(false);
  };
  return (
    <>
      <Row justify="center" align="middle" style={{ height: "80vh" }}>
        <Col lg={8}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={2}>Register</Title>

            <Input
              value={data.username}
              placeholder="Username"
              name="username"
              onChange={handleChange}
              size="large"
            />
            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              size="large"
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              size="large"
            />
            <Button
              onClick={handleFormSubmit}
              size="large"
              block
              type="primary"
              disabled={isLoading}
            >
              Register
            </Button>
            {err == "" ? "" : <Alert type="error" message={err} />}
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default Register;
