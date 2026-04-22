import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Stack
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Add as AddIcon,
  LockOutlined as LockOutlinedIcon
} from "@mui/icons-material";
import { authControllerRegister, CreateUserDto } from "../../api-client";
import { UserRole } from "../../types/user";

export default function RegisterPage() {
  const navigate = useNavigate();

  // Basic State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("candidate");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"error" | "success">("error");

  // Add skill to the list
  const handleAddSkill = () => {
    const trimmed = currentSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setCurrentSkill("");
    }
  };

  // Remove skill from the list
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setSeverity("error");
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const body: CreateUserDto = {
        password: password,
        email: email,
        role: role,
        ...(role === "candidate" && { skills }),
      };

      const res = await authControllerRegister({ body });

      if (res.data) {
        navigate("/login", { state: { message: "Đăng ký thành công! Vui lòng đăng nhập." } });
      } else {
        setSeverity("error");
        setMessage("Không thể đăng ký. Hãy thử lại!");
      }
    } catch (error) {
      console.error(error);
      setSeverity("error");
      setMessage("Không thể kết nối tới server!");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={4}
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3
        }}
      >
        {/* Lock Icon Header */}
        <Box sx={{ m: 1, bgcolor: "primary.main", width: 45, height: 45, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LockOutlinedIcon sx={{ color: "white" }} />
        </Box>

        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "600" }}>
          Đăng ký tài khoản
        </Typography>

        {/* Global Feedback Alert */}
        {message && (
          <Alert severity={severity} sx={{ width: "100%", mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister} sx={{ width: "100%" }}>
          <Stack spacing={2.5}>

            {/* Email Field */}
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Field */}
            <TextField
              required
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}

            />

            {/* Confirm Password Field */}
            <TextField
              required
              fullWidth
              label="Xác nhận mật khẩu"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Role Select Field */}
            <TextField
              select
              fullWidth
              label="Vai trò"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <MenuItem value="candidate">Candidate</MenuItem>
              <MenuItem value="recruiter">Recruiter</MenuItem>
            </TextField>

            {/* Dynamic skills input for Candidates only */}
            {role === "candidate" && (
              <Box>
                <TextField
                  fullWidth
                  label="Skills (Press Enter to add)"
                  placeholder="e.g., React, Node.js"
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
                {skills.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                    {skills.map((skill, index) => (
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


            {/* Submit Action Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 1, py: 1.2, fontWeight: "600" }}
            >
              Đăng ký
            </Button>

            {/* Secondary Back To Login Button */}
            <Button
              fullWidth
              variant="text"
              size="small"
              onClick={() => navigate("/login")}
              sx={{ color: "text.secondary" }}
            >
              Quay lại đăng nhập
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
