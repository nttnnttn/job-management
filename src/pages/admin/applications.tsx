import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { adminApi } from "../../api/admin.api";
import { useAuth } from "../../hooks/useAuth";

// MUI Palette mapping
const statusColorMap: Record<string, "info" | "success" | "error" | "warning" | "default"> = {
  applied: "info",     // blue
  approved: "success", // green
  rejected: "error",   // red
  interview: "warning",// gold
};

export default function AdminApplicationsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
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
    adminApi
      .getApplications()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [auth?.role, navigate]);

  if (!auth || auth.role !== "admin") return null;

  const columns: GridColDef[] = [
    {
      field: "candidateName",
      headerName: "Candidate",
      flex: 1,
      valueGetter: (_, record) => record.candidate?.fullName || "N/A",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", height: "100%" }}>
          <Typography variant="body2">{params.row.candidate?.email || "N/A"}</Typography>
          {params.row.candidate?.email && (
            <Tooltip title="Copy Email">
              <IconButton
                size="small"
                onClick={() => navigator.clipboard.writeText(params.row.candidate.email)}
              >
                <ContentCopyIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
    {
      field: "jobTitle",
      headerName: "Job",
      flex: 1,
      valueGetter: (_, record) => record.job?.title || "N/A",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      valueGetter: (_, record) => record.job?.company || "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const status = params.value || "unknown";
        return (
          <Chip
            label={String(status).toUpperCase()}
            color={statusColorMap[status] || "default"}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Applied At",
      width: 180,
      valueFormatter: (value) => new Date(value).toLocaleString(),
    },
  ];

  return (
    // 1. Changed Container to Box, 100% width, and reduced top margin (mt)
    <Box > 
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Applications
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 4, boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)" }}>
          <Box sx={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={items}
              columns={columns}
              getRowId={(row) => row._id}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 8 },
                },
              }}
              // 2. Ensuring pageSizeOptions matches your paginationModel
              pageSizeOptions={[8, 20, 50]} 
              disableRowSelectionOnClick
              sx={{ 
                border: 0,
                // Optional: Ensure the header text is always readable
                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' } 
              }}
            />
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
