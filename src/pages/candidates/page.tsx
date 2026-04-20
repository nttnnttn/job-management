import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  Stack, 
  Button, 
  Alert,
  CircularProgress 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useAuth } from "../../hooks/useAuth";
import { useCandidatesByJob } from "../../hooks/job-candidate/useCandidatesByJob";
import { updateApplicationStatus } from "../../api/jobCandidate.api";
import CandidateTable from "../../component/table/CandidateTable";

export default function CandidatesPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Use simple alerts or a custom Snackbar hook if you have one
  if (auth?.role !== "recruiter") {
    return (
      <Typography sx={{ textAlign: "center", mt: 10 }}>
        Access denied
      </Typography>
    );
  }

  const { data, isLoading, error, refetch } = useCandidatesByJob(jobId!);
  const candidates = Array.isArray(data) ? data : [];

  const handleStatus = async (
    applicationId: string,
    status: "approved" | "rejected",
  ) => {
    try {
      setLoadingId(applicationId + status);
      await updateApplicationStatus(applicationId, status);
      await refetch();
      // Replace with your snackbar/toast logic
      console.log(status === "approved" ? "Đã duyệt ứng viên" : "Đã từ chối ứng viên");
    } catch (err: any) {
      console.error(err?.message || "Cập nhật thất bại");
    } finally {
      setLoadingId(null);
    }
  };

  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error">Error loading candidates</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 5 }}>
      <Stack spacing={3}>
        {/* Back Button */}
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/jobs")}
          sx={{ width: "fit-content", textTransform: "none" }}
        >
          Back to Jobs
        </Button>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Candidates
          </Typography>
        </Box>

        <Card 
          sx={{ 
            borderRadius: 5, 
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
            overflow: "hidden" // Keeps table corners rounded
          }}
        >
          <CandidateTable 
            data={candidates} 
            loadingId={loadingId} 
            isLoading={isLoading} 
            onApprove={(id) => handleStatus(id, "approved")} 
            onReject={(id) => handleStatus(id, "rejected")} 
          />
        </Card>
      </Stack>
    </Container>
  );
}
