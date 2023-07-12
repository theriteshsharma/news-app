import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "./utils/api";
import { Col, Row, Image, Typography, Space } from "antd";
import Speech from "react-speech";

export default function News() {
  const params = useParams();

  const [news, setNews] = useState();
  useEffect(() => {
    async function fetchData(id) {
      let news = await get(`/news/${id}`);
      if (!news.message) setNews(news);
    }
    fetchData(params.id);
  }, []);

  const style = {
    play: {
      button: {
        width: "28",
        height: "28",
        cursor: "pointer",
        pointerEvents: "none",
        outline: "none",
        backgroundColor: "yellow",
        border: "solid 1px rgba(255,255,255,1)",
        borderRadius: 6,
      },
    },
  };
  return news ? (
    <Row justify={"center"}>
      <Col span={16}>
        <Space direction="vertical">
          <Typography.Title level={2}>{news.title}</Typography.Title>
          <Image src={news.image_url} height={"40vh"} width={"60vw"} />
          <Speech style={style} text={news.content} />
          <Typography.Text>{news.desc}</Typography.Text>
          <Typography.Text>{news.content}</Typography.Text>
          {/* <TweetEmbed id="692527862369357824" placeholder={"loading"} /> */}
        </Space>
      </Col>
    </Row>
  ) : (
    ""
  );
}
