import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App as AntApp, Card, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { adminApi } from "../../api/admin.api";
import { useAuth } from "../../hooks/useAuth";

const { Title, Text } = Typography;

const statusColorMap: Record<string, string> = {
  applied: "blue",
  approved: "green",
  rejected: "red",
  interview: "gold",
};

export default function AdminApplicationsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      navigate("/login");
      return;
    }
    if (auth.role !== "admin") {
      navigate("/jobs");
      return;
    }

    setLoading(true);
    adminApi
      .getApplications()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error(error);
        message.error("Không tải được danh sách apply");
      })
      .finally(() => setLoading(false));
  }, [auth?.role, navigate, message]);

  if (!auth || auth.role !== "admin") return null;

  const columns: ColumnsType<any> = [
    {
      title: "Candidate",
      dataIndex: ["candidate", "fullName"],
      render: (_value, record) => record.candidate?.fullName || "N/A",
    },
    {
      title: "Email",
      dataIndex: ["candidate", "email"],
      render: (value) => <Text copyable>{value}</Text>,
    },
    { title: "Job", dataIndex: ["job", "title"] },
    { title: "Company", dataIndex: ["job", "company"] },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <Tag color={statusColorMap[value] || "default"}>
          {String(value || "unknown").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Applied At",
      dataIndex: "createdAt",
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div style={{ maxWidth: 1240, margin: "80px auto" }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 6 }}>
            Applications
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
            dataSource={items}
            loading={loading}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 900 }}
          />
        </Card>
      </Space>
    </div>
  );
}
