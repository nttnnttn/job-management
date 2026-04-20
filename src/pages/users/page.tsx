import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Button, Card, Stack, Chip,
  IconButton, Tooltip, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, CircularProgress,
  Paper, Snackbar, Alert
} from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import PlusIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useAuth } from "../../hooks/useAuth";
import { UserDto, usersControllerGetAllUsers } from "../../api-client";
import { adminApi } from "../../api/admin.api";

export default function UsersPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  // States
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", role: "candidate" });

  // Feedback States (Replacing antd message)
  const [snackbar, setSnackbar] = useState<{ open: boolean, msg: string, severity: 'success' | 'error' }>({
    open: false, msg: "", severity: 'success'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersControllerGetAllUsers({});
      setUsers(Array.isArray(res.data) ? (res.data as UserDto[]) : []);
    } catch (err) {
      setSnackbar({ open: true, msg: "Không thể tải danh sách người dùng", severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) { navigate("/login", { replace: true }); return; }
    if (auth.role !== "admin") { navigate("/jobs", { replace: true }); return; }
    fetchUsers();
  }, [auth?.role, navigate]);

  const handleCreate = async () => {
    if (!formData.email || !formData.password) return;
    try {
      setSubmitting(true);
      await adminApi.createUser(formData);
      setSnackbar({ open: true, msg: "Tạo user thành công", severity: 'success' });
      setOpenCreateModal(false);
      setFormData({ email: "", password: "", role: "candidate" });
      fetchUsers();
    } catch (error: any) {
      setSnackbar({ open: true, msg: error?.message || "Tạo user thất bại", severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (window.confirm(`Xóa user này?\n${email}`)) {
      try {
        await adminApi.deleteUser(id);
        setSnackbar({ open: true, msg: "Xóa user thành công", severity: 'success' });
        fetchUsers();
      } catch (error: any) {
        setSnackbar({ open: true, msg: error?.message || "Xóa user thất bại", severity: 'error' });
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', height: '100%' }} // alignItems moved here
        >
          <Typography variant="body2">{params.value}</Typography>
          <IconButton size="small" onClick={() => navigator.clipboard.writeText(params.value)}>
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      renderCell: (params) => {
        const val = String(params.value);
        const color = val === "admin" ? "secondary" : val === "recruiter" ? "warning" : "primary";
        return <Chip label={val.toUpperCase()} color={color} size="small" sx={{ fontWeight: 'bold' }} />;
      },
    },
    {
      field: "active",
      headerName: "Active",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "ACTIVE" : "INACTIVE"}
          color={params.value ? "success" : "error"}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 180,
      valueFormatter: (value) => new Date(value).toLocaleString(),
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(String(params.row._id), params.row.email)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (!auth || auth.role !== "admin") return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4
        }}
      >

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Quản lý người dùng
          </Typography>

        </Box>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          size="large"
          onClick={() => setOpenCreateModal(true)}
          sx={{ borderRadius: 2 }}
        >
          Tạo user
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 4, boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)" }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => String(row._id)}
            loading={loading}
            initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
            pageSizeOptions={[8, 20, 50]}
            disableRowSelectionOnClick
            sx={{ border: 0 }}
          />
        </Box>
      </Card>

      {/* Create User Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Tạo user mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Email"
              placeholder="example@gmail.com"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <TextField
              select
              label="Role"
              fullWidth
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="candidate">Candidate</MenuItem>
              <MenuItem value="recruiter">Recruiter</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCreateModal(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
