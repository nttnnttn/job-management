import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useJobDetail } from "../../../hooks/jobs/useJobDetail";
import { useUpdateJob } from "../../../hooks/jobs/useUpdateJob";
import { useDeleteJob } from "../../../hooks/jobs/useDeleteJob";
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

export default function UpdateJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJobDetail(id!);
  const updateJob = useUpdateJob();
  const deleteJobMutation = useDeleteJob();

  // Unified Form State
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    status: "open",
  });

  // UI States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Populate data when API fetches it
  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        salaryMin: job.salaryMin?.toString() || "",
        salaryMax: job.salaryMax?.toString() || "",
        description: job.description || "",
        status: job.status || "open",
      });
    }
  }, [job]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    if (!id) return;
    setSuccessMessage("");
    
    updateJob.mutate(
      {
        jobId: id,
        payload: {
          title: form.title,
          company: form.company,
          location: form.location,
          salaryMin: Number(form.salaryMin),
          salaryMax: Number(form.salaryMax),
          description: form.description,
          status: form.status,
        },
      },
      {
        onSuccess: () => {
          setSuccessMessage("Cập nhật tin tuyển dụng thành công!");
          setTimeout(() =>  navigate("/jobs"), 1000);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!id) return;
    deleteJobMutation.mutate(id, {
      onSuccess: () => {
        setOpenDeleteDialog(false);
        navigate("/jobs"); 
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        
        {/* Header Section */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ m: 1, bgcolor: "success.main", width: 45, height: 45, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
            <EditIcon sx={{ color: "white" }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              Cập Nhật Tin Tuyển Dụng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chỉnh sửa thông tin chi tiết của công việc
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Action Feedback Alerts */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, width: "100%" }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" sx={{ width: "100%" }}>
          <Stack spacing={3}>
            
            {/* Row 1: Title & Company */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                required
                fullWidth
                label="Tiêu đề công việc"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Tên công ty"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </Stack>

            {/* Row 2: Location & Status */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Địa điểm"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                sx={{ flex: 2 }}
              />
              <TextField
                select
                fullWidth
                label="Trạng thái"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                sx={{ flex: 1 }}
              >
                <MenuItem value="open">Đang mở (Open)</MenuItem>
                <MenuItem value="closed">Đã đóng (Closed)</MenuItem>
              </TextField>
            </Stack>

            {/* Row 3: Salaries */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Lương tối thiểu"
                type="number"
                value={form.salaryMin}
                onChange={(e) => handleChange("salaryMin", e.target.value)}
                slotProps={{ input: { inputProps: { min: 0 } } }}
              />
              <TextField
                fullWidth
                label="Lương tối đa"
                type="number"
                value={form.salaryMax}
                onChange={(e) => handleChange("salaryMax", e.target.value)}
                slotProps={{ input: { inputProps: { min: 0 } } }}
              />
            </Stack>

            {/* Description */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả công việc"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            {/* Action Buttons Container */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                onClick={handleUpdate}
                disabled={updateJob.isPending}
                startIcon={updateJob.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ py: 1.2, fontWeight: "600" }}
              >
                {updateJob.isPending ? "Đang lưu..." : "Cập nhật"}
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                color="error"
                size="large"
                onClick={() => setOpenDeleteDialog(true)}
                disabled={deleteJobMutation.isPending}
                startIcon={deleteJobMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                sx={{ py: 1.2, fontWeight: "600" }}
              >
                Xóa công việc
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* Modern Dialog to replace native window.confirm */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận xóa công việc?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa tin tuyển dụng này không? Thao tác này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained" 
            disabled={deleteJobMutation.isPending}
            autoFocus
          >
            {deleteJobMutation.isPending ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
