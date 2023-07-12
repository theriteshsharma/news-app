import { Row, Col, Card, Tag, Typography, Space, Divider, Button } from "antd";
import { useEffect, useState } from "react";
import { get } from "./utils/api";
import { getColor } from "./utils";

function Home() {
  const [shortNews, setShortNews] = useState([]);
  const [color, setColor] = useState([]);
  let idx = 0;
  useEffect(() => {
    let _temp = JSON.parse(localStorage.getItem("shortNews"));
    setShortNews(_temp);
    setColor([getColor(), getColor()]);
    async function fetchData() {
      let news = await get("/news/shortNews");
      if (news && news.length > 0) {
        setShortNews(news);
        localStorage.setItem("shortNews", JSON.stringify(news));
      }
    }
    fetchData();
  }, []);

  return (
    <Row justify={"center"} style={{ minHeight: "80vh", paddingTop: "3rem" }}>
      <Col span={20}>
        <Row>
          <Space direction={"vertical"}>
            <Typography.Title>Welcome to FOX NEWS</Typography.Title>

            <Typography.Text>Your Top Articles for Today are</Typography.Text>
          </Space>
          <Divider />
        </Row>
        <Row gutter={[12, 12]} justify={"center"}>
          {shortNews?.map((news) => {
            return (
              <Col md={8} key={news.id}>
                <Card style={{ backgroundColor: color[idx++ % 2] }}>
                  <Space direction="vertical">
                    <Tag color={"#fff"} style={{ color: "black" }}>
                      {news.category}
                    </Tag>
                    <Typography.Title level={5}>{news.title}</Typography.Title>
                    <Typography.Text>{news.summary}</Typography.Text>

                    <Button
                      type="link"
                      target="_blank"
                      href={news.link}
                      size="small"
                      style={{ padding: 0 }}
                    >
                      Read More
                    </Button>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
}

export default Home;
