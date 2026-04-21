import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile, UpdateProfilePayload } from "../../api/users.api";
import { useProfile } from "../../hooks/users/useProfile";
import { useUpdateProfile } from "../../hooks/users/useUpdateProfile";
import { useMyApplications } from "../../hooks/job-candidate/useMyApplications";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Chip,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  Stack,
  Avatar,
  Divider,
  CircularProgress
} from "@mui/material";
import {
  Add as AddIcon,
  Person as PersonIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

type ProfileForm = {
  fullName: string;
  phone: string;
  level?: "intern" | "junior" | "middle" | "senior";
  skills?: string[];
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { data, isLoading, refetch } = useProfile();
  const updateMutation = useUpdateProfile();
  const { data: myApplications, isLoading: loadingApps } = useMyApplications();
  const role = auth?.role?.toLowerCase();

  // Unified Form State
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    phone: "",
    level: undefined,
    skills: [],
  });

  // UI States
  const [currentSkill, setCurrentSkill] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"error" | "success">("error");

  // 🔥 check login
  useEffect(() => {
    if (auth === null) return;
    if (!auth) {
      navigate("/login", { replace: true });
    }
  }, [auth, navigate]);

  // 🔥 load profile
  useEffect(() => {
    if (data) {
      setForm({
        fullName: data.fullName ?? "",
        phone: data.phone ?? "",
        level: data.level ?? undefined,
        // Fallback to empty array if backend doesn't support skills yet
        // skills: data.skills ?? [], 
      });
    }
  }, [data]);

  // Handle generic changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "level" ? (value || undefined) : value,
    }));
  };

  // Skill Add Handler
  const handleAddSkill = () => {
    const trimmed = currentSkill.trim();
    const currentSkills = form.skills || [];
    if (trimmed && !currentSkills.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        skills: [...currentSkills, trimmed],
      }));
      setCurrentSkill("");
    }
  };

  // Skill Remove Handler
  const handleRemoveSkill = (skillToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((skill) => skill !== skillToRemove),
    }));
  };

  // Check if form has changed from source data
  const isChanged =
    form.fullName !== (data?.fullName || "") ||
    form.phone !== (data?.phone || "") ||
    form.level !== data?.level
  // todo
  // ||
  // JSON.stringify(form.skills) !== JSON.stringify(data?.skills || []);

  // Submit profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChanged) return;

    if (form.phone && form.phone.length < 9) {
      setSeverity("error");
      setMessage("Số điện thoại phải >= 9 ký tự");
      return;
    }

    setMessage("");

    // Casting includes skills which will be ignored by backend until implemented
    updateMutation.mutate(form as UpdateProfilePayload & { skills?: string[] }, {
      onSuccess: () => {
        setSeverity("success");
        setMessage("Cập nhật thành công");
        refetch();
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message?.[0] || "Cập nhật thất bại";
        setSeverity("error");
        setMessage(msg);
      },
    });
  };

  if (!auth) return null;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải thông tin...</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="warning">Không có dữ liệu</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

        {/* Header Section */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mr: 2 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              Thông tin cá nhân
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý thông tin tài khoản của bạn
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Global Feedback Alert */}
        {message && (
          <Alert severity={severity} sx={{ width: "100%", mb: 3 }}>
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Stack spacing={3}>

            {/* Read-Only Email */}
            <TextField
              fullWidth
              label="Email"
              value={data.email}
              disabled
              variant="filled"
            />

            {/* Read-Only Role */}
            <TextField
              fullWidth
              label="Quyền hạn (Role)"
              value={data.role}
              disabled
              variant="filled"
            />

            {/* Full Name */}
            <TextField
              required
              fullWidth
              label="Họ tên"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nhập họ tên..."
            />

            {/* Phone */}
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
            />

            {/* Level */}
            {role === "candidate" && (<TextField
              select
              fullWidth
              label="Level"
              name="level"
              value={form.level || ""}
              onChange={handleChange}
            >
              <MenuItem value="">-- Chọn level --</MenuItem>
              <MenuItem value="intern">Intern</MenuItem>
              <MenuItem value="junior">Junior</MenuItem>
              <MenuItem value="middle">Middle</MenuItem>
              <MenuItem value="senior">Senior</MenuItem>
            </TextField>)}

            {/* Dynamic skills input for Candidates only */}
            {role === "candidate" && (
              <Box>
                <TextField
                  fullWidth
                  label="Kỹ năng (Enter để thêm)"
                  placeholder="Ví dụ: React, Node.js"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleAddSkill} edge="end" color="primary">
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {/* Chip Container */}
                {(form.skills || []).length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                    {form.skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* Action Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isChanged || updateMutation.isPending}
              startIcon={updateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ py: 1.2, fontWeight: "600", mt: 1 }}
            >
              {updateMutation.isPending ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
