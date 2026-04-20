import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// MUI Components
import {
  Box, Container, Grid, Typography, Card, CardContent, CardHeader,
  CircularProgress, Chip, Paper, Divider
} from "@mui/material";

// MUI Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import DescriptionIcon from '@mui/icons-material/Description';

import { adminApi } from "../../api/admin.api";
import { useAuth } from "../../hooks/useAuth";

const ROLE_COLORS = ["#2563eb", "#16a34a", "#f59e0b"];
const JOB_COLORS = ["#0f172a", "#1d4ed8", "#7c3aed", "#db2777", "#ea580c"];

export default function AdminDashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { navigate("/login"); return; }
    if (auth.role !== "admin") { navigate("/jobs"); return; }

    setLoading(true);
    Promise.all([
      adminApi.getStats(),
      adminApi.getApplications(),
      fetch(`${process.env.REACT_APP_API_BASE || "http://localhost:4000"}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token") || ""}` },
      }).then((res) => res.json()),
      fetch(`${process.env.REACT_APP_API_BASE || "http://localhost:4000"}/jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token") || ""}` },
      }).then((res) => res.json()),
    ])
      .then(([statsData, applicationData, usersData, jobsData]) => {
        setStats(statsData);
        setApplications(Array.isArray(applicationData) ? applicationData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      })
      .catch((err) => console.error("Error loading stats:", err))
      .finally(() => setLoading(false));
  }, [auth?.role, navigate]);

  // Data Memoization (kept same logic)
  const roleChartData = useMemo(() => [
    { name: "Candidate", value: stats?.users?.candidates ?? 0 },
    { name: "Recruiter", value: stats?.users?.recruiters ?? 0 },
    { name: "Admin", value: stats?.users?.admins ?? 0 },
  ], [stats]);

  const recruiterJobData = useMemo(() => {
    const recruiterMap = new Map<string, { name: string; jobs: number }>();
    jobs.forEach((job: any) => {
      const recruiterId = job.createdBy || "unknown";
      const recruiter = users.find((user: any) => String(user._id) === String(recruiterId));
      const recruiterName = recruiter?.fullName || recruiter?.email || "Unknown";
      const current = recruiterMap.get(recruiterId) || { name: recruiterName, jobs: 0 };
      current.jobs += 1;
      recruiterMap.set(recruiterId, current);
    });
    return Array.from(recruiterMap.values()).sort((a, b) => b.jobs - a.jobs).slice(0, 6);
  }, [jobs, users]);

  const applicationStatusData = useMemo(() => {
    const counts = applications.reduce((acc: any, item: any) => {
      const status = item.status || item.application?.status || "applied";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  const statCards = [
    { label: "Tổng tài khoản", value: stats?.users?.total ?? 0, icon: <PeopleAltIcon />, color: "#2563eb" },
    { label: "Candidate", value: stats?.users?.candidates ?? 0, icon: <GroupsIcon />, color: "#16a34a" },
    { label: "Recruiter", value: stats?.users?.recruiters ?? 0, icon: <ContactPageIcon />, color: "#f59e0b" },
    { label: "Bài viết tuyển dụng", value: stats?.jobs?.total ?? 0, icon: <DescriptionIcon />, color: "#7c3aed" },
    { label: "Lượt apply", value: stats?.applications?.total ?? 0, icon: <ContactPageIcon />, color: "#db2777" },
  ];

  if (!auth || auth.role !== "admin") return null;
  return (
    <Box sx={{ width: "100%", mt: 2, mb: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          Admin Dashboard
        </Typography>
      </Box>

      {loading ? (
        <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 4 }}>
          <CircularProgress size={60} />
        </Paper>
      ) : (
        <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
          {/* Stat Cards - Stays in 1 row (lg=2.4) */}
          <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
            {statCards.map((card) => (
              <Grid
                key={card.label}
                // This is the magic part: 
                // On mobile (xs): 100% width
                // On desktop (md): exactly 20% width (1/5th)
                sx={{
                  flexBasis: { xs: '100%', md: '20%' },
                  maxWidth: { xs: '100%', md: '20%' }
                }}
              >
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
                  height: '100%'
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${card.color}15`,
                      color: card.color,
                      mr: 2,
                      display: 'flex'
                    }}>
                      {card.icon}
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {card.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>




          {/* --- FULL WIDTH CHARTS --- */}

{/* Grid container cha phải có width: '100%' và m: 0 để không bị tràn viền */}
<Grid container spacing={3} sx={{ width: '100%', m: 0 }}> 
  
  {/* Phần 1: Chiếm 6/12 cột (tức 50%) trên màn hình desktop (md) */}
  <Grid size={{ xs: 12, md: 6 }}> 
    <ChartCard title="Tỉ lệ tài khoản theo role" tagLabel="Users" tagColor="primary">
      <ResponsiveContainer width="100%" height={350}>
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
              <Cell key={entry.name} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  </Grid>

  {/* Phần 2: Tương tự chiếm 6/12 cột (tức 50%) */}
  <Grid size={{ xs: 12, md: 6 }}>
    <ChartCard title="Top recruiter theo số job đã tạo" tagLabel="Jobs" tagColor="secondary">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={recruiterJobData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} height={40} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="jobs" radius={[4, 4, 0, 0]} barSize={60}>
            {recruiterJobData.map((entry, index) => (
              <Cell key={entry.name} fill={JOB_COLORS[index % JOB_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </Grid>

</Grid>



          {/* Applications Status Chart - FULL WIDTH */}
          <Grid sx={{ width: '100%', margin: 0 }}>
            <ChartCard title="Tình trạng applications" tagLabel="Applications" tagColor="success">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={applicationStatusData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={80} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

// Sub-component for Chart Containers
function ChartCard({ title, tagLabel, tagColor, children }: any) {
  return (
    <Card sx={{ borderRadius: 4, boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)", height: '100%' }}>
      <CardHeader
        title={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>}
        action={
          <Chip
            label={tagLabel}
            color={tagColor}
            size="small"
            variant="filled" // or "outlined"
            sx={{ borderRadius: 1 }}
          />

        }
      />
      <Divider />
      <CardContent sx={{ minHeight: 340 }}>
        {children}
      </CardContent>
    </Card>
  );
}
