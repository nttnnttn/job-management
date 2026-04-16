import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  App as AntApp,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  FileTextOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { adminApi } from "../../api/admin.api";
import { useAuth } from "../../hooks/useAuth";

const { Title, Text } = Typography;
const ROLE_COLORS = ["#2563eb", "#16a34a", "#f59e0b"];
const JOB_COLORS = ["#0f172a", "#1d4ed8", "#7c3aed", "#db2777", "#ea580c"];

export default function AdminDashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
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
    Promise.all([
      adminApi.getStats(),
      adminApi.getApplications(),
      fetch(
        `${process.env.REACT_APP_API_BASE || "http://localhost:4000"}/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        },
      ).then((res) => res.json()),
      fetch(
        `${process.env.REACT_APP_API_BASE || "http://localhost:4000"}/jobs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        },
      ).then((res) => res.json()),
    ])
      .then(([statsData, applicationData, usersData, jobsData]) => {
        setStats(statsData);
        setApplications(Array.isArray(applicationData) ? applicationData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      })
      .catch((error) => {
        console.error(error);
        message.error("Không tải được thống kê admin");
      })
      .finally(() => setLoading(false));
  }, [auth?.role, navigate, message]);

  const roleChartData = useMemo(
    () => [
      { name: "Candidate", value: stats?.users?.candidates ?? 0 },
      { name: "Recruiter", value: stats?.users?.recruiters ?? 0 },
      { name: "Admin", value: stats?.users?.admins ?? 0 },
    ],
    [stats],
  );

  const recruiterJobData = useMemo(() => {
    const recruiterMap = new Map<string, { name: string; jobs: number }>();
    jobs.forEach((job: any) => {
      const recruiterId = job.createdBy || "unknown";
      const recruiter = users.find(
        (user: any) => String(user._id) === String(recruiterId),
      );
      const recruiterName =
        recruiter?.fullName || recruiter?.email || "Unknown recruiter";
      const current = recruiterMap.get(recruiterId) || {
        name: recruiterName,
        jobs: 0,
      };
      current.jobs += 1;
      recruiterMap.set(recruiterId, current);
    });
    return Array.from(recruiterMap.values())
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 6);
  }, [jobs, users]);

  const applicationStatusData = useMemo(() => {
    const counts = applications.reduce(
      (acc: Record<string, number>, item: any) => {
        const status = item.status || item.application?.status || "applied";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {},
    );
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  const cards = [
    {
      label: "Tổng tài khoản",
      value: stats?.users?.total ?? 0,
      icon: <UserOutlined />,
      color: "#2563eb",
    },
    {
      label: "Candidate",
      value: stats?.users?.candidates ?? 0,
      icon: <TeamOutlined />,
      color: "#16a34a",
    },
    {
      label: "Recruiter",
      value: stats?.users?.recruiters ?? 0,
      icon: <SolutionOutlined />,
      color: "#f59e0b",
    },
    {
      label: "Bài viết tuyển dụng",
      value: stats?.jobs?.total ?? 0,
      icon: <FileTextOutlined />,
      color: "#7c3aed",
    },
    {
      label: "Lượt apply",
      value: stats?.applications?.total ?? 0,
      icon: <SolutionOutlined />,
      color: "#db2777",
    },
  ];

  if (!auth || auth.role !== "admin") return null;

  return (
    <div style={{ maxWidth: "100%", margin: "80px auto", paddingBottom: 40 }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 6 }}>
            Admin Dashboard
          </Title>
        </div>

        {loading ? (
          <Card style={{ borderRadius: 16, textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </Card>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {cards.map((card) => (
                <Col xs={24} sm={12} lg={8} xl={4.8 as any} key={card.label}>
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 16,
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
                    }}
                  >
                    <Statistic
                      title={card.label}
                      value={card.value}
                      prefix={
                        <span style={{ color: card.color }}>{card.icon}</span>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            <Row gutter={[20, 20]}>
              <Col xs={24} lg={12}>
                <ChartCard
                  title="Tỉ lệ tài khoản theo role"
                  extra={<Tag color="blue">Users</Tag>}
                >
                  {roleChartData.every((item) => item.value === 0) ? (
                    <Empty description="Chưa có dữ liệu user" />
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={roleChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          label
                        >
                          {roleChartData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={ROLE_COLORS[index % ROLE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </Col>

              <Col xs={24} lg={12}>
                <ChartCard
                  title="Top recruiter theo số job đã tạo"
                  extra={<Tag color="purple">Jobs</Tag>}
                >
                  {recruiterJobData.length === 0 ? (
                    <Empty description="Chưa có dữ liệu job" />
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={recruiterJobData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="jobs" radius={[8, 8, 0, 0]}>
                          {recruiterJobData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={JOB_COLORS[index % JOB_COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </Col>

              <Col xs={24}>
                <ChartCard
                  title="Tình trạng applications"
                  extra={<Tag color="green">Applications</Tag>}
                >
                  {applicationStatusData.length === 0 ? (
                    <Empty description="Chưa có dữ liệu ứng tuyển" />
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={applicationStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="#16a34a"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </Col>
            </Row>
          </>
        )}
      </Space>
    </div>
  );
}

function ChartCard({
  title,
  extra,
  children,
}: {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card
      title={
        <Text strong style={{ fontSize: 16 }}>
          {title}
        </Text>
      }
      extra={extra}
      bordered={false}
      style={{
        borderRadius: 16,
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
      }}
      bodyStyle={{ minHeight: 360 }}
    >
      {children}
    </Card>
  );
}
