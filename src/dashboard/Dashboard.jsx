import {
  Col,
  Layout,
  Row,
  Menu,
  List,
  Typography,
  Divider,
  Tag,
  Button,
  Space,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/auth-context";
import { get } from "../utils/api";
import { titleCase } from "../utils";

const { Sider, Content } = Layout;

function Dashboard() {
  const [activeCategory, setActiveCategory] = useState(-1);
  const [news, setNews] = useState([]);
  const [newsByLocation, setNewsByLocation] = useState([]);
  const [location, setLocation] = useState("");
  const navigator = useNavigate();
  const {
    authenticated,
    category,
    setCategory,
    interest,
    setInterests,
    setBlocked,
  } = useContext(AuthContext);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let location = await fetch("http://ip-api.com/json/?fields=city");
      let city = (await location.json()).city;
      setLocation(city);

      let _newsByLocation = await get(`/news?location=${city.toLowerCase()}`);
      setNewsByLocation(_newsByLocation);

      let category = await get("/allCategories");
      setCategoryList(category);
      let data = await get("/user/interests");
      if (!data.message) {
        setInterests(
          data.interests.map((int) => {
            let cat = category.find((cat) => cat.id == int.categoryId);
            category = category.filter((cat) => cat.id !== int.categoryId);
            return cat;
          })
        );
        setBlocked(
          data.blocked.map((int) => {
            let cat = category.find((cat) => cat.id == int.categoryId);
            category = category.filter((cat) => cat.id !== int.categoryId);
            return cat;
          })
        );
      }
      setCategory(category);

      let news = await get("/news");
      setNews(news);

      setActiveCategory(interest[0]?.id);
    }

    if (authenticated) {
      fetchData();
    } else {
      navigator("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getItem = (arr) => {
    return arr.map((item) => ({ key: item.id, label: titleCase(item.title) }));
  };

  const getCategoryName = (id) =>
    titleCase(
      categoryList.find((ele) => ele.id == id)
        ? categoryList.find((ele) => ele.id == id)?.title
        : "News"
    );

  function saveFile(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement("a");
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    }
  }

  const renderNewsList = () => {
    let _lst = news.filter((news) => news.categoryId == activeCategory);

    return (
      <List
        dataSource={_lst}
        size="large"
        bordered
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        renderItem={(item) => (
          <Link to={`/news/${item.id}`}>
            <List.Item>
              <Row align={"middle"} gutter={12}>
                <Col span={6}>
                  <Typography.Title strong level={5}>
                    {item.title}
                  </Typography.Title>
                  <Tag color="success">
                    {new Date(item.pub_date).getUTCDate() +
                      "-" +
                      new Date(item.pub_date).getUTCFullYear()}
                  </Tag>
                </Col>
                <Col span={16}>
                  <Divider type="vertical" />
                  <Typography.Text>
                    {item.desc?.substring(0, 1200)}...
                  </Typography.Text>
                  {/* {item.image_url && (
                    <Image src={item.image_url} minwidth={"300px"} />
                  )} */}
                </Col>

                <Divider />
              </Row>
            </List.Item>
          </Link>
        )}
      ></List>
    );
  };

  const handleDownloadNews = async () => {
    let res = await fetch(
      `http://localhost:4000/api/v1/news/print-news?category=${activeCategory}`
    );

    var blob = await res.blob({ type: "application/pdf" });
    console.log(blob);

    var url = window.URL.createObjectURL(blob);
    console.log(url);
    saveFile(blob, "news.pdf");
  };

  return (
    <>
      {authenticated ? (
        <Row justify={"center"}>
          <Col span={20}>
            <Layout style={{ minHeight: "80vh", backgroundColor: "white" }}>
              <Sider style={{ backgroundColor: "white" }}>
                <Typography.Title level={3}> Categories</Typography.Title>
                <Divider />
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[`${activeCategory}`]}
                  defaultOpenKeys={["interested", "other"]}
                  onSelect={(e) => setActiveCategory(e.key)}
                  items={[
                    {
                      key: "interested",
                      label: <b>Interested</b>,
                      children: getItem(interest),
                    },
                    {
                      key: "other",
                      label: <b>Other</b>,
                      children: getItem(category),
                    },
                  ]}
                />
              </Sider>
              <Content style={{ padding: "2rem" }}>
                <Space align={"center"}>
                  <Typography.Title>
                    {getCategoryName(activeCategory)}
                  </Typography.Title>
                  <Button onClick={handleDownloadNews} size="small">
                    Download News
                  </Button>
                </Space>
                <Divider />
                {renderNewsList()}
              </Content>
              <Sider style={{ backgroundColor: "white" }}>
                <Typography.Title level={3}>Local News</Typography.Title>
                <Tag color="geekblue">{location}</Tag>

                <List
                  style={{ marginTop: "1rem" }}
                  size="large"
                  bordered
                  dataSource={newsByLocation}
                  renderItem={(item) => {
                    return <List.Item>{item.title}</List.Item>;
                  }}
                />
              </Sider>
            </Layout>
          </Col>
        </Row>
      ) : (
        "Please Authenticated"
      )}
    </>
  );
}

export default Dashboard;
