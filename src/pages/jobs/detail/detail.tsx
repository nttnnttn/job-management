import { useNavigate, useParams } from "react-router-dom";
import {
  App as AntApp,
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useJobDetail } from "../../../hooks/jobs/useJobDetail";
import { useApplyJob } from "../../../hooks/job-candidate/useApplyJob";
import { useAuth } from "../../../hooks/useAuth";

const { Title, Paragraph, Text } = Typography;

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const { message } = AntApp.useApp();
  const { data: job, isLoading } = useJobDetail(id || "");
  const applyJob = useApplyJob();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 120 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!job)
    return <p style={{ textAlign: "center", marginTop: 80 }}>Job not found</p>;

  const handleApply = () => {
    if (!auth) return message.warning("Bạn cần đăng nhập để apply job");
    if (auth.role !== "candidate")
      return message.warning("Chỉ candidate mới có thể apply job");

    applyJob.mutate(
      { jobId: job._id },
      {
        onSuccess: () => message.success("Apply thành công!"),
        onError: (error: any) =>
          message.error(error?.message || "Apply thất bại"),
      },
    );
  };

  return (
    <div style={{ maxWidth: 1100, margin: "90px auto" }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/jobs")}
          style={{ width: "fit-content" }}
        >
          Quay lại
        </Button>
        <Card
          bordered={false}
          style={{
            borderRadius: 20,
            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
          }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Tag color="blue" style={{ marginBottom: 12 }}>
                    {String(job.status).toUpperCase()}
                  </Tag>
                  <Title level={2} style={{ margin: 0 }}>
                    {job.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    {job.company}
                  </Text>
                </div>
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Địa điểm">
                    <Space>
                      <EnvironmentOutlined /> {job.location || "N/A"}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Mức lương">
                    {job.salaryMin || 0} - {job.salaryMax || 0}
                  </Descriptions.Item>
                </Descriptions>
                <div>
                  <Title level={4}>Mô tả công việc</Title>
                  <Paragraph
                    style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}
                  >
                    {job.description || "Chưa có mô tả"}
                  </Paragraph>
                </div>
              </Space>
            </Col>
            <Col xs={24} lg={8}>
              <Card style={{ borderRadius: 16, background: "#f8fafc" }}>
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Title level={4} style={{ margin: 0 }}>
                    Apply nhanh
                  </Title>
                  {(auth?.role === "candidate" || !auth) && (
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      size="large"
                      block
                      loading={applyJob.isPending}
                      onClick={handleApply}
                    >
                      {auth?.role === "candidate"
                        ? "Ứng tuyển ngay"
                        : "Đăng nhập để ứng tuyển"}
                    </Button>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
}
