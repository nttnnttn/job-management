import React, { useEffect, useMemo, useState } from "react";
import { useJobList } from "../../../hooks/jobs/useJobList";
import { useDeleteJob } from "../../../hooks/jobs/useDeleteJob";
import { useNavigate } from "react-router-dom";
import { useApplyJob } from "../../../hooks/job-candidate/useApplyJob";
import { useMyApplications } from "../../../hooks/job-candidate/useMyApplications";
import { useAuth } from "../../../hooks/useAuth";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as EyeIcon,
  Add as AddIcon,
  Send as SendIcon,
  People as GroupIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export default function JobListPage() {
  const [search, setSearch] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const { data, isLoading } = useJobList({ q: search });
  const deleteJob = useDeleteJob();
  const applyJob = useApplyJob();
  const navigate = useNavigate();
  const auth = useAuth();
  const { data: myApplications } = useMyApplications();

  // Dialog & Snackbar states
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [applyJobId, setApplyJobId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({ open: false, message: "", severity: "success" });

  const role = auth?.role;
  const canCreate = role === "recruiter";
  const canEditDelete = role === "recruiter" || role === "admin";
  const canApply = role === "candidate";
  const isAdminMode = role === "admin";

  useEffect(() => {
    if (!myApplications || !Array.isArray(myApplications)) return;
    setAppliedJobs(myApplications);
  }, [myApplications]);

  // Handle Deletion (with MUI Dialog)
  const handleDeleteConfirm = () => {
    if (!deleteJobId || !auth) return;
    deleteJob.mutate(deleteJobId, {
      onSuccess: () => setSnackbar({ open: true, message: "Delete success!", severity: "success" }),
      onError: () => setSnackbar({ open: true, message: "Delete failed", severity: "error" }),
    });
    setDeleteJobId(null);
  };

  // Handle Apply (with MUI Dialog)
  const handleApplyConfirm = () => {
    if (!applyJobId || !auth) return;
    applyJob.mutate(
      { jobId: applyJobId },
      {
        onSuccess: () => {
          setSnackbar({ open: true, message: "Apply success!", severity: "success" });
          setAppliedJobs((prev) => [...prev, applyJobId]);
        },
        onError: (err: any) => {
          const msg = err?.message || "You already applied this job";
          setSnackbar({ open: true, message: msg, severity: "error" });
        },
      }
    );
    setApplyJobId(null);
  };


  const actionButtonSx = {
    minHeight: 34,
    padding: '2px 8px',
    gap: 0.5,
    alignItems: 'center',
    textTransform: 'none',
    '& .MuiButton-startIcon': {
      margin: 0,
    },
  };


  // Columns for Material UI DataGrid
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "title",
        headerName: "Title",
        flex: 1.8,
        minWidth: 150,
      },
      {
        field: "company",
        headerName: "Company",
        flex: 1.2,
        minWidth: 120,
      },
      {
        field: "location",
        headerName: "Location",
        flex: 1.2,
        minWidth: 120,
        renderCell: (p: GridRenderCellParams) => p.value || "N/A",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 100,
        renderCell: (p: GridRenderCellParams) => (
          <Chip
            label={String(p.value).toUpperCase()}
            color={p.value === "open" ? "success" : "error"}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "salary",
        headerName: "Salary",
        flex: 1,
        minWidth: 120,
        valueGetter: (_value: unknown, row: any) =>
          `${row.salaryMin ?? 0} - ${row.salaryMax ?? 0}`,

      },
      {
        field: "updatedAt",
        headerName: "Updated At",
        flex: 1.4,
        minWidth: 180,
        renderCell: (p: GridRenderCellParams) => new Date(p.value).toLocaleString(),
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        flex: 2,
        minWidth: 340,
        align: "center",
        renderCell: (p: GridRenderCellParams) => {
          const job = p.row;
          const isApplied = job.isApplied || appliedJobs.includes(job._id);
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                startIcon={<EyeIcon />}
                 onClick={() => navigate(`/jobs/${job._id}${isApplied ? `?candidateId=${auth?.userId}` : ''}`)} 
                sx={actionButtonSx}
              >
                Detail
              </Button>
              {canEditDelete && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/jobs/update/${job._id}`)}
                    sx={actionButtonSx}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={actionButtonSx}
                    onClick={() => setDeleteJobId(job._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
              {role === "recruiter" && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GroupIcon />}
                  onClick={() => navigate(`/candidates/${job._id}`)}

                  sx={actionButtonSx}

                >
                  Candidates
                </Button>
              )}
              {canApply && (
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<SendIcon />}
                  disabled={isApplied}
                  onClick={() => setApplyJobId(job._id)}
                >
                  {isApplied ? "Applied" : "Apply"}
                </Button>
              )}
              {!auth && (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<SendIcon />}
                  onClick={() => setSnackbar({ open: true, message: "Bạn cần đăng nhập để apply", severity: "warning" })}
                >
                  Apply
                </Button>
              )}
            </Stack>
          );
        },
      },
    ],
    [appliedJobs, auth, canApply, canEditDelete, navigate, role]
  );

  return (
    <Box
    >
      <Stack direction="column" spacing={3}>
        <Box
        >
          <Typography variant="h4"  sx={{ fontWeight: "bold" }}>
            {isAdminMode ? "Quản lý job" : "Job List"}
          </Typography>
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="large"
              sx={{ minWidth: 140 }}
              onClick={() => navigate("/jobs/create")}
            >
              Create Job
            </Button>
          )}
        </Box>
        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} >
              <TextField
                label="Search jobs..."
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // PersonOutlineOutlined ={{
                //   endAdornment: <SearchIcon color="action" sx={{ ml: 1 }} />,
                // }}
                sx={{ width: { xs: "100%", sm: 350 } }}
              />
            </Stack>
            <Box sx={{ width: "100%" }}>
              <DataGrid
                autoHeight
                rows={Array.isArray(data) ? data.map((job: any) => ({ ...job, id: job._id })) : []}
                loading={isLoading}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                      page: 0,
                    },
                  },
                }}
                pageSizeOptions={[8]}
                disableRowSelectionOnClick

                sx={{
                  '& .MuiDataGrid-cell': {
                    alignItems: 'center',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
                  },
                }}

              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
      {/* Delete Dialog */}
      <Dialog
        open={!!deleteJobId}
        onClose={() => setDeleteJobId(null)}
      >
        <DialogTitle>Xóa Job</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xóa job này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>Job List
          <Button onClick={() => setDeleteJobId(null)} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      {/* Apply Dialog */}
      <Dialog
        open={!!applyJobId}
        onClose={() => setApplyJobId(null)}
        aria-labelledby="apply-dialog-title"
      >
        <DialogTitle id="apply-dialog-title" sx={{ fontWeight: 'bold' }}>
          Apply Job
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn ứng tuyển vào vị trí này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setApplyJobId(null)}
            color="inherit"
            disabled={applyJob.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleApplyConfirm}
            variant="contained"
            color="success" // If this errors, use sx={{ bgcolor: 'success.main' }}
            autoFocus
            disabled={applyJob.isPending}
            startIcon={applyJob.isPending && <CircularProgress size={20} color="inherit" />}
          >
            {applyJob.isPending ? "Đang xử lý..." : "Xác nhận Apply"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3200}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        message={snackbar.message}
        action={
          <IconButton size="small" color="inherit" onClick={() => setSnackbar((s) => ({ ...s, open: false }))}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
