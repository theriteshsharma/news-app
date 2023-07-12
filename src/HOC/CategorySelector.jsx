import { useContext, useEffect } from "react";
import { titleCase } from "../utils";
import { post } from "../utils/api";
import { Button, Col, List, Row, Space, Typography } from "antd";
import AuthContext from "../context/auth-context";

export default function CategorySelector() {
  const { category, setCategory, interest, setInterests, blocked, setBlocked } =
    useContext(AuthContext);
  // const [category, setCategory] = useState([]);
  // const [interest, setInterests] = useState([]);
  // const [blocked, setBlocked] = useState([]);
  useEffect(() => {
    async function fetchData() {}
    fetchData();
  }, []);

  const swapInterets = (
    elementId,
    source,
    destination,
    sourceName,
    destinationName
  ) => {
    const elementIndex = source.findIndex((obj) => obj.id === elementId);

    if (elementIndex !== -1) {
      const element = source.splice(elementIndex, 1)[0];

      destination.push(element);
    }

    const updater = {
      category: (data) => setCategory(data),
      interest: (data) => setInterests(data),
      blocked: (data) => setBlocked(data),
    };

    updater[destinationName](destination);
    updater[sourceName](source);
  };

  const handleSave = async () => {
    post("/user/interests", {
      selected: interest.map((int) => int.id),
      blocked: blocked.map((int) => int.id),
    });
  };
  return (
    <>
      <Row justify={"center"}>
        <Col span={18}>
          <Row style={{ width: "100%" }} gutter={16}>
            <Col lg={8}>
              <Typography.Title level={3}>Interested</Typography.Title>
              {interest && (
                <List
                  dataSource={interest}
                  renderItem={(item) => (
                    <List.Item>
                      <Row justify={"space-between"} style={{ width: "100%" }}>
                        <Col>{titleCase(item.title)}</Col>
                        <Col>
                          <Button
                            danger
                            onClick={() =>
                              swapInterets(
                                item.id,
                                [...interest],
                                [...category],
                                "interest",
                                "category"
                              )
                            }
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              )}
            </Col>
            <Col lg={8}>
              <Typography.Title level={3}>All</Typography.Title>
              <List
                dataSource={category}
                renderItem={(item) => (
                  <List.Item>
                    <Row justify={"space-between"} style={{ width: "100%" }}>
                      <Col>{titleCase(item.title)}</Col>
                      <Col>
                        <Space>
                          <Button
                            onClick={() =>
                              swapInterets(
                                item.id,
                                [...category],
                                [...interest],
                                "category",
                                "interest"
                              )
                            }
                          >
                            Interest
                          </Button>
                          <Button
                            danger
                            onClick={() =>
                              swapInterets(
                                item.id,
                                [...category],
                                [...blocked],
                                "category",
                                "blocked"
                              )
                            }
                          >
                            Block
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            </Col>
            <Col lg={8}>
              <Typography.Title level={3}>Blocked</Typography.Title>
              {
                <List
                  dataSource={blocked}
                  renderItem={(item) => (
                    <List.Item>
                      <Row justify={"space-between"} style={{ width: "100%" }}>
                        <Col>{titleCase(item.title)}</Col>
                        <Col>
                          <Button
                            onClick={() =>
                              swapInterets(
                                item.id,
                                [...blocked],
                                [...category],
                                "blocked",
                                "category"
                              )
                            }
                          >
                            Unblock
                          </Button>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              }
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Button onClick={handleSave}>Save</Button>
      </Row>
    </>
  );
}
