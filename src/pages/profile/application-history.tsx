import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Card, Stack, Chip,
  Button, IconButton, Tooltip, Divider, CircularProgress,
  Paper, Avatar
} from "@mui/material";
import { alpha } from '@mui/material/styles';


// MUI Icons
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { WorkOutlined as WorkOutlineIcon } from '@mui/icons-material';
import { DeleteOutlined as DeleteOutlineIcon } from '@mui/icons-material';

import { useMyApplicationHistory } from "../../hooks/job-candidate/useMyApplicationHistory";

// Status Color Mapping
const statusConfig: Record<string, { color: "success" | "error" | "info" | "warning"; label: string }> = {
  Approved: { color: "success", label: "Đã duyệt" },
  Rejected: { color: "error", label: "Từ chối" },
  Interview: { color: "info", label: "Phỏng vấn" },
  Pending: { color: "warning", label: "Đang chờ" },
};

export default function ProfileApplicationsPage() {
  const { data, isLoading } = useMyApplicationHistory();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 15, textAlign: 'center' }}>
        <Paper sx={{ p: 6, borderRadius: 4, bgcolor: '#f8fafc' }} elevation={0}>
          <WorkOutlineIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Bạn chưa ứng tuyển công việc nào</Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/jobs')}>
            Khám phá việc làm ngay
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 4, md: 12 }, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          📩 Lịch sử ứng tuyển
        </Typography>
        <Typography color="text.secondary">Theo dõi trạng thái các vị trí bạn đã nộp hồ sơ</Typography>
      </Box>

      <Stack spacing={2.5}>
        {data.map((app: any) => {
          const adapted = {
            _id: app.application?.id,
            status: app.application?.status || "Pending",
            createdAt: app.application?.appliedAt,
            job: {
              _id: app.job?._id || app.job?.id,
              title: app.job?.title,
              company: app.job?.company,
            },
          };

          const config = statusConfig[adapted.status] || statusConfig.Pending;

          return (
            <Card
              key={adapted._id}
              sx={{
                borderRadius: 4,
                p: 2.5,
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                border: '1px solid #f1f5f9',
                transition: '0.3s',
                "&:hover": {
                  transform: 'translateY(-2px)',
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  borderColor: 'primary.light'
                }
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>

                {/* Job Info Section */}
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                    <BusinessIcon sx={{ color: 'primary.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                      {adapted.job.title}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BusinessIcon fontSize="inherit" /> {adapted.job.company}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarMonthIcon fontSize="inherit" /> {new Date(adapted.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* Status and Actions */}
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip
                    label={config.label}
                    color={config.color}
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: 1.5, minWidth: 90 }}
                  />

                  <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Xem chi tiết job">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/jobs/${adapted.job._id}?candidateId=${adapted._id}`)}
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                          '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15) }
                        }}
                      >
                        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Hủy ứng tuyển">
                      <IconButton
                        color="error"
                        onClick={() => alert("TODO: Call delete API")}
                        sx={{ bgcolor: 'error.50' }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

              </Stack>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}
