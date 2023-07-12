import { Row, Col } from "antd";
export default function Footer() {
  return (
    <>
      <Row
        justify={"space-around"}
        align={"middle"}
        style={{ height: 64, color: "primary" }}
      >
        <Col> @Ritesh Sharma</Col>
      </Row>
    </>
  );
}
