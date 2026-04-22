import { useNavigate, useParams } from "react-router-dom";
import { Box, Container, Typography, Button, Card, Stack, Chip, CircularProgress, Paper, Divider, Avatar } from "@mui/material";
import { Grid } from "@mui/material";// Sử dụng Grid2 để tránh lỗi "item" property
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationOnIcon,
  Payments as PaymentsIcon,
  Send as SendIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';


import { useJobDetail } from "../../../hooks/jobs/useJobDetail";
import { useApplyJob } from "../../../hooks/job-candidate/useApplyJob";
import { useAuth } from "../../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import JobTypeCard from "../../../component/JobCard/jobWorkingType";
import SkillListDisplay from "../../../component/JobCard/jobRequirementSkills";

export default function JobDetailPage() {
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  // Use this ID to force the "Already Applied" state
  const hasAlreadyApplied = !!candidateId;
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const { data: job, isLoading } = useJobDetail(id || "");
  const applyJob = useApplyJob();

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress size={60} thickness={4} />
    </Box>
  );

  if (!job) return <Typography sx={{ textAlign: 'center', mt: 10 }}>Không tìm thấy công việc</Typography>;

  const handleApply = () => {
    if (!auth) return navigate("/login");
    if (auth.role !== "candidate") return alert("Chỉ ứng viên mới có thể ứng tuyển");
    applyJob.mutate({ jobId: job._id.toString() });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 6 }, mb: 8 }}>
      {/* Nút quay lại tinh gọn */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/jobs")}
        sx={{ mb: 4, textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
      >
        Quay lại tìm kiếm
      </Button>

      <Grid container spacing={4}>
        {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={4}>
            {/* Header Job Info */}
            <Box>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56, borderRadius: 3 }}>
                  <BusinessIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                    {job.title}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {job.company}
                  </Typography>
                </Box>
              </Stack>

              {/* Replace the Stack that had flexWrap with this Box */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2, // This replaces 'spacing'
                  alignItems: 'center'
                }}
              >
                <Chip
                  icon={<LocationOnIcon />}
                  label={job.location || "Toàn quốc"}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
                <Chip
                  icon={<PaymentsIcon />}
                  label={`${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} VND`}
                  color="success"
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                />
                <JobTypeCard key={job.toString()} job={{_id: job._id.toString(), jobType: job.jobType ?? 'fulltime'} } />
              </Box>

            </Box>

            <Divider />

            {/* Chi tiết nội dung */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 4, height: 24, bgcolor: 'primary.main', mr: 2, borderRadius: 1 }} />
                Mô tả công việc
              </Typography>
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4 }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: 'text.secondary', lineHeight: 1.8, fontSize: '1.05rem' }}>
                  {job.description || "Đang cập nhật mô tả chi tiết..."}
                </Typography>
              </Paper>
            </Box>

            {/* Quyền lợi / Yêu cầu (Nếu có data) */}
            <Box>
               <SkillListDisplay title="Yêu cầu kỹ năng ứng viên" skills={job.skills || []}/>
            </Box>
          </Stack>
        </Grid>

        {/* CỘT PHẢI: SIDEBAR (STICKY) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
            <Card sx={{
              borderRadius: 5,
              p: 4,
              boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
              border: '1px solid #eef2f6',
              background: '#fff'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Ứng tuyển ngay</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Gửi CV của bạn để kết nối trực tiếp với nhà tuyển dụng.
              </Typography>

              <Stack spacing={2.5}>
                {(auth?.role === "candidate" || !auth) && (
                  <Button
                    variant={hasAlreadyApplied ? "outlined" : "contained"}
                    size="large"
                    fullWidth
                    // Ẩn icon nếu đang xử lý hoặc đã ứng tuyển
                    startIcon={(!applyJob.isPending && !hasAlreadyApplied) && <SendIcon />}
                    onClick={handleApply}
                    // Disable nếu đang xử lý HOẶC đã ứng tuyển
                    disabled={applyJob.isPending || hasAlreadyApplied}
                    sx={{
                      borderRadius: 3,
                      py: 2,
                      fontWeight: 700,
                      fontSize: '1rem',
                      textTransform: 'none',
                      // Đổi style nếu đã ứng tuyển
                      ...(hasAlreadyApplied ? {
                        borderColor: 'success.main',
                        color: 'success.main',
                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.05),
                        "&.Mui-disabled": {
                          borderColor: 'success.light',
                          color: 'success.main',
                        }
                      } : {
                        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                      })
                    }}
                  >
                    {applyJob.isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : hasAlreadyApplied ? (
                      "Đã ứng tuyển công việc này"
                    ) : auth?.role === "candidate" ? (
                      "Nộp đơn ứng tuyển"
                    ) : (
                      "Đăng nhập để ứng tuyển"
                    )}
                  </Button>

                )}

                <Divider />

                <Box sx={{ bgcolor: '#fff9eb', p: 2, borderRadius: 3, border: '1px solid #ffe8cc' }}>
                  <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 600, display: 'flex', gap: 1 }}>
                    ⚠️ Lưu ý: Luôn kiểm tra kỹ thông tin nhà tuyển dụng trước khi nộp hồ sơ.
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
