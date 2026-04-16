import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  App as AntApp,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { UserDto, usersControllerGetAllUsers } from "../../api-client";
import { adminApi } from "../../api/admin.api";

const { Title, Text } = Typography;

export default function UsersPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { message } = AntApp.useApp();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersControllerGetAllUsers({});
      setUsers(Array.isArray(res.data) ? (res.data as UserDto[]) : []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      navigate("/login", { replace: true });
      return;
    }

    if (auth.role !== "admin") {
      navigate("/jobs", { replace: true });
      return;
    }

    fetchUsers();
  }, [auth?.role, navigate]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await adminApi.createUser(values);
      message.success("Tạo user thành công");
      setOpenCreateModal(false);
      form.resetFields();
      fetchUsers();
    } catch (error: any) {
      if (error?.errorFields) return;
      message.error(error?.message || "Tạo user thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteUser(id);
      message.success("Xóa user thành công");
      fetchUsers();
    } catch (error: any) {
      message.error(error?.message || "Xóa user thất bại");
    }
  };

  if (!auth || auth.role !== "admin") return null;

  const columns: ColumnsType<UserDto> = [
    {
      title: "Email",
      dataIndex: "email",
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (value) => (
        <Tag
          color={
            value === "admin"
              ? "purple"
              : value === "recruiter"
                ? "gold"
                : "blue"
          }
        >
          {String(value).toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Active",
      dataIndex: "active",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      width: 110,
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            Modal.confirm({
              title: "Xóa user này?",
              content: record.email,
              okText: "Xóa",
              okButtonProps: { danger: true },
              cancelText: "Hủy",
              onOk: () => handleDelete(String(record._id)),
            })
          }
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: "100%", margin: "50px auto" }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={2} style={{ marginBottom: 6 }}>
              Quản lý người dùng
            </Title>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setOpenCreateModal(true)}
          >
            Tạo user
          </Button>
        </div>

        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
          }}
        >
          <Table
            rowKey={(record) => String(record._id)}
            columns={columns}
            dataSource={users}
            loading={loading}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 900 }}
          />
        </Card>
      </Space>

      <Modal
        title="Tạo user mới"
        open={openCreateModal}
        onOk={handleCreate}
        onCancel={() => setOpenCreateModal(false)}
        confirmLoading={submitting}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ role: "candidate" }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Nhập password" },
              { min: 6, message: "Ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Chọn role" }]}
          >
            <Select
              options={[
                { value: "candidate", label: "Candidate" },
                { value: "recruiter", label: "Recruiter" },
                { value: "admin", label: "Admin" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
