import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useCreateJob } from "../../../hooks/jobs/useCreateJob";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import {
  AddCircleOutlined as AddCircleOutlinedIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { JobWorkingType } from "../../../constants/jobConfig";
import SkillInput from "../../../component/JobCard/skillInput";

interface MyTokenPayload extends JwtPayload {
  role?: string;
}

export default function CreateJobPage() {
  const navigate = useNavigate();
  const createJob = useCreateJob();

  // Trạng thái Form
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");

  // Trạng thái Kỹ năng (Thay thế cho số lượng tuyển)
  const [currentSkill, setCurrentSkill] = useState("");
  const [jobType, setJobType] = useState<JobWorkingType>('fulltime');
  const [skills, setSkills] = useState<string[]>([]);

  const [successMessage, setSuccessMessage] = useState(false);

  // 🔐 Kiểm tra quyền recruiter
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode<MyTokenPayload>(token);
      if (decoded.role !== "recruiter") {
        navigate("/jobs");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleSkillsChange = (newSkills: string[]) => {
    setSkills(newSkills);
  };

  const handleChange = (value: JobWorkingType) => {
    setJobType(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) {
      return;
    }

    createJob.mutate(
      {
        title,
        company,
        location,
        salaryMin: Number(salaryMin) || 0,
        salaryMax: Number(salaryMax) || 0,
        skills, // Gửi mảng kỹ năng lên backend
        description,
        status: "open",
        jobType
      },
      {
        onSuccess: () => {
          setSuccessMessage(true);
          setTimeout(() => navigate("/jobs"), 1500);
        },
      }
    );
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

        {/* Tiêu đề trang */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ m: 1, bgcolor: "primary.main", width: 45, height: 45, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
            <AddCircleOutlinedIcon sx={{ color: "white" }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              Tạo Tin Tuyển Dụng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điền thông tin chi tiết để đăng tải một công việc mới
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Thông báo thành công */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, width: "100%" }}>
            Tạo công việc thành công! Đang chuyển hướng...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Stack spacing={3}>

            {/* Dòng 1: Tiêu đề & Công ty */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                required
                fullWidth
                label="Tiêu đề công việc"
                placeholder="Ví dụ: Lập trình viên React"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Tên công ty"
                placeholder="Ví dụ: ABC Tech"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </Stack>

            {/* Dòng 2: Địa điểm & Kỹ năng */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Địa điểm"
                placeholder="Ví dụ: Hà Nội / TP.HCM"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{ flex: 1 }}
              />

            </Stack>

            {/* Dòng 3: Mức lương */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Lương tối thiểu"
                type="number"
                placeholder="Ví dụ: 10000000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                slotProps={{ input: { inputProps: { min: 0 } } }}
              />
              <TextField
                fullWidth
                label="Lương tối đa"
                type="number"
                placeholder="Ví dụ: 20000000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                slotProps={{ input: { inputProps: { min: 0 } } }}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  select
                  label="Hình thức làm việc"
                  value={jobType}
                  onChange={(e) => handleChange(e.target.value as JobWorkingType)}
                  fullWidth
                  helperText="Vui lòng chọn loại hình công việc"
                >
                  <MenuItem value="fulltime">Full-time</MenuItem>
                  <MenuItem value="parttime">Part-time</MenuItem>
                  <MenuItem value="contract">Contract (Hợp đồng)</MenuItem>
                </TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                {/* Ô nhập kỹ năng */}
                <SkillInput
                  skills={skills}
                  onChange={handleSkillsChange}
                  label="Kỹ năng yêu cầu (Nhấn Enter để thêm)" // Có thể tùy chỉnh label
                />
              </Box>
            </Stack>


            {/* Mô tả công việc */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả công việc"
              placeholder="Nhập mô tả chi tiết về công việc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Nút submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={createJob.isPending}
              startIcon={createJob.isPending ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ py: 1.2, fontWeight: "600", mt: 1 }}
            >
              {createJob.isPending ? "Đang tạo..." : "Tạo công việc"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
