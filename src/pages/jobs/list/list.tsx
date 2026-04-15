import React, { useEffect, useMemo, useState } from "react";
import { useJobList } from "../../../hooks/jobs/useJobList";
import { useDeleteJob } from "../../../hooks/jobs/useDeleteJob";
import { useNavigate } from "react-router-dom";
import { useApplyJob } from "../../../hooks/job-candidate/useApplyJob";
import { useMyApplications } from "../../../hooks/job-candidate/useMyApplications";
import { useAuth } from "../../../hooks/useAuth";
import {
  App as AntApp,
  Button,
  Card,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SendOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

export default function JobListPage() {
  const [search, setSearch] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const { data, isLoading } = useJobList({ q: search });
  const deleteJob = useDeleteJob();
  const applyJob = useApplyJob();
  const navigate = useNavigate();
  const auth = useAuth();
  const { message } = AntApp.useApp();
  const { data: myApplications } = useMyApplications();

  const role = auth?.role;
  const canCreate = role === "recruiter";
  const canEditDelete = role === "recruiter" || role === "admin";
  const canApply = role === "candidate";
  const isAdminMode = role === "admin";

  useEffect(() => {
    if (!myApplications || !Array.isArray(myApplications)) return;
    setAppliedJobs(myApplications);
  }, [myApplications]);

  const handleDelete = (jobId: string) => {
    if (!auth) return message.warning("Bạn cần đăng nhập");

    Modal.confirm({
      title: "Bạn có chắc muốn xóa job này?",
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () =>
        deleteJob.mutate(jobId, {
          onSuccess: () => message.success("Delete success!"),
          onError: () => message.error("Delete failed"),
        }),
    });
  };

  const handleApply = (jobId: string) => {
    if (!auth) return message.warning("Bạn cần đăng nhập để apply");
    if (auth.role !== "candidate")
      return message.warning("Chỉ candidate mới được apply");
    if (appliedJobs.includes(jobId))
      return message.warning("You already applied this job");

    Modal.confirm({
      title: "Apply job này?",
      okText: "Apply",
      cancelText: "Hủy",
      onOk: () =>
        applyJob.mutate(
          { jobId },
          {
            onSuccess: () => {
              message.success("Apply success!");
              setAppliedJobs((prev) => [...prev, jobId]);
            },
            onError: (err: any) => {
              const msg = err?.message || "You already applied this job";
              message.error(msg);
            },
          },
        ),
    });
  };

  const columns: ColumnsType<any> = useMemo(
    () => [
      { title: "Title", dataIndex: "title", key: "title" },
      { title: "Company", dataIndex: "company", key: "company" },
      {
        title: "Location",
        dataIndex: "location",
        key: "location",
        render: (value) => value || "N/A",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (value) => (
          <Tag color={value === "open" ? "green" : "red"}>
            {String(value).toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Salary",
        key: "salary",
        render: (_, job) => `${job.salaryMin || 0} - ${job.salaryMax || 0}`,
      },
      {
        title: "Updated At",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (value) => new Date(value).toLocaleString(),
      },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 320,
        render: (_, job) => {
          const isApplied = job.isApplied || appliedJobs.includes(job._id);
          return (
            <Space wrap>
              <Button
                icon={<EyeOutlined />}
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                Detail
              </Button>

              {canEditDelete && (
                <>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/jobs/update/${job._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </Button>
                </>
              )}

              {role === "recruiter" && (
                <Button
                  icon={<TeamOutlined />}
                  onClick={() => navigate(`/candidates/${job._id}`)}
                >
                  Candidates
                </Button>
              )}

              {canApply && (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  disabled={isApplied}
                  onClick={() => handleApply(job._id)}
                >
                  {isApplied ? "Applied" : "Apply"}
                </Button>
              )}

              {!auth && (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => message.warning("Bạn cần đăng nhập để apply")}
                >
                  Apply
                </Button>
              )}
            </Space>
          );
        },
      },
    ],
    [appliedJobs, auth, canApply, canEditDelete, message, navigate, role],
  );

  return (
    <div style={{ maxWidth: isAdminMode ? "100%" : 1280, margin: "40px auto" }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Title level={2} style={{ marginBottom: 6 }}>
              {isAdminMode ? "Quản lý job" : "Job List"}
            </Title>
          </div>
          {canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate("/jobs/create")}
            >
              Create Job
            </Button>
          )}
        </div>

        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
          }}
        >
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Search
              placeholder="Search jobs..."
              allowClear
              enterButton
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={Array.isArray(data) ? data : []}
              loading={isLoading}
              pagination={{ pageSize: 8 }}
              scroll={{ x: 1200 }}
            />
          </Space>
        </Card>
      </Space>
    </div>
  );
}
