import { Button, Col, Input, Row, Space, Typography, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useContext, useEffect, useState } from "react";
import { post } from "./utils/api";
import AuthContext from "./context/auth-context";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    content: "",
    link: "",
    category: "",
    keyword: "",
    location: "",
  });
  const navigator = useNavigate();

  const [file, setFile] = useState();
  const Auth = useContext(AuthContext);

  useEffect(() => {
    console.log(Auth.user);
    if (!Auth.user?.isAdmin) {
      navigator("/dashboard");
    }
  });
  const handleFormData = (e) => {
    let _formData = { ...formData };
    _formData[e.target.name] = e.target.value;
    setFormData(_formData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let _formData = new FormData();
    for (var x in formData) {
      console.log(x, formData[x]);
      _formData.append(x, formData[x]);
    }

    _formData.append("banner", file);
    await post("/news", _formData, false);
  };

  const handleSelectedFile = async (e) => {
    setFile(e.target.files[0]);
  };
  return (
    <>
      <Row justify={"center"}>
        <Col span={8}>
          <Space direction={"vertical"} style={{ width: "100%" }}>
            <Typography.Title level={3}>Add Your Own News</Typography.Title>
            <Input
              name="title"
              value={formData.title}
              onChange={handleFormData}
              size="large"
              placeholder="title"
            />
            <TextArea
              name="desc"
              value={formData.desc}
              onChange={handleFormData}
              size="large"
              row={4}
              placeholder="Short Description"
            />
            <TextArea
              name="content"
              value={formData.content}
              onChange={handleFormData}
              size="large"
              autoSize={{ minRows: 8, maxRows: 15 }}
              placeholder="Content"
            />
            <Upload size="large" />
            <Input
              name="link"
              value={formData.link}
              onChange={handleFormData}
              size="large"
              placeholder="Link"
            />
            <Input
              name="category"
              value={formData.category}
              onChange={handleFormData}
              size="large"
              placeholder="Category"
            />
            <Input
              name="keyword"
              size="large"
              value={formData.keyword}
              onChange={handleFormData}
              placeholder="; seperated Keywords"
            />
            <Input
              name="location"
              value={formData.location}
              onChange={handleFormData}
              size="large"
              placeholder="Location"
            />
            <Input
              type="file"
              name="banner"
              onChange={handleSelectedFile}
            ></Input>
            <Button
              size="large"
              block
              type="primary"
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}
