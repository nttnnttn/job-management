import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCandidatesByJob } from "../../hooks/job-candidate/useCandidatesByJob";
import { updateApplicationStatus } from "../../api/jobCandidate.api";
import {
  App as AntApp,
  Button,
  Card,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Title, Text } = Typography;

export default function CandidatesPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const { message } = AntApp.useApp();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (auth?.role !== "recruiter") {
    return <p style={{ textAlign: "center", marginTop: 80 }}>Access denied</p>;
  }

  const { data, isLoading, error, refetch } = useCandidatesByJob(jobId!);
  const candidates = Array.isArray(data) ? data : [];

  const handleStatus = async (
    applicationId: string,
    status: "approved" | "rejected",
  ) => {
    try {
      setLoadingId(applicationId + status);
      await updateApplicationStatus(applicationId, status);
      await refetch();
      message.success(
        status === "approved" ? "Đã duyệt ứng viên" : "Đã từ chối ứng viên",
      );
    } catch (error: any) {
      message.error(error?.message || "Cập nhật thất bại");
    } finally {
      setLoadingId(null);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Full name",
      dataIndex: ["candidate", "fullName"],
      render: (_v, r) => r.candidate?.fullName || "N/A",
    },
    { title: "Email", dataIndex: ["candidate", "email"] },
    {
      title: "Skills",
      dataIndex: ["candidate", "skills"],
      render: (skills) =>
        Array.isArray(skills) && skills.length > 0
          ? skills.map((skill: string) => <Tag key={skill}>{skill}</Tag>)
          : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <Tag
          color={
            value === "approved"
              ? "green"
              : value === "rejected"
                ? "red"
                : "blue"
          }
        >
          {String(value).toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Applied At",
      dataIndex: "createdAt",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, item) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            disabled={loadingId !== null || item.status === "approved"}
            loading={loadingId === item._id + "approved"}
            onClick={() => handleStatus(item._id, "approved")}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            disabled={loadingId !== null || item.status === "rejected"}
            loading={loadingId === item._id + "rejected"}
            onClick={() => handleStatus(item._id, "rejected")}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  if (error)
    return (
      <p style={{ textAlign: "center", marginTop: 80 }}>
        Error loading candidates
      </p>
    );

  return (
    <div style={{ maxWidth: 1240, margin: "80px auto" }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/jobs")}
          style={{ width: "fit-content" }}
        >
          Back to Jobs
        </Button>
        <div>
          <Title level={2} style={{ marginBottom: 6 }}>
            Candidates
          </Title>
        </div>
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
          }}
        >
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={candidates}
            loading={isLoading}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1000 }}
          />
        </Card>
      </Space>
    </div>
  );
}
