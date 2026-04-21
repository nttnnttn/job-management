import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authControllerSignIn } from "../../api-client";
import { jwtDecode } from "jwt-decode";
import { IUserToken } from "../../hooks/useAuth";

// MUI Imports
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Divider
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  LoginOutlined,
  PersonAddOutlined
} from "@mui/icons-material";

export default function LoginPage() {
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const res = await authControllerSignIn({ body: { email, password } });

      if (res.data?.access_token) {
        const token = res.data.access_token;

        // Save token & user ID
        localStorage.setItem("access_token", token);
        const decoded = jwtDecode<IUserToken>(token);
        localStorage.setItem("user_id", decoded.userId);

        setAlert({ type: "success", message: "Đăng nhập thành công!" });

        setTimeout(() => navigate("/home"), 1500);
      } else {
        setAlert({ type: "error", message: "Sai email hoặc mật khẩu!" });
        setLoading(false);
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      setAlert({ type: "error", message: "Không thể kết nối tới server!" });
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            width: "100%",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            color="primary"
            sx={{ fontWeight: "bold" }} // 🔥 Fixed: Moved style to the sx prop
          >
            Đăng Nhập
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Vui lòng nhập thông tin tài khoản của bạn
          </Typography>

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Địa chỉ Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // 🔥 Fixed for newer MUI versions:
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />


            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // 🔥 Fixed for newer MUI versions:
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />


            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginOutlined />}
              sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: 2, fontSize: "1rem" }}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>

            <Divider sx={{ my: 2 }}>hoặc</Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              color="inherit"
              startIcon={<PersonAddOutlined />}
              onClick={() => navigate("/register")}
              sx={{ py: 1.2, borderRadius: 2, fontSize: "1rem" }}
            >
              Đăng ký tài khoản mới
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Action Toast Notifications */}
      <Snackbar
        open={alert !== null}
        autoHideDuration={4000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {alert ? (
          <Alert onClose={() => setAlert(null)} severity={alert.type} sx={{ width: "100%" }} variant="filled">
            {alert.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Container>
  );
}
