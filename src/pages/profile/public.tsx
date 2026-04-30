import { useState, useEffect } from "react";
// Add these imports for the CV UI
import { 
  Box, Container, Paper, Avatar, Typography, Divider, Stack, 
  TextField, MenuItem, IconButton, InputAdornment, Chip, 
  Button, CircularProgress, Alert, Grid, Tooltip 
} from "@mui/material";
import {
  Person as PersonIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Work as WorkIcon,
  School as SchoolIcon
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { usePublicProfile } from "../../hooks/users/usePublicProfile";

type PublicProfileForm = {
  fullName: string;
  phone: string;
  level?: "intern" | "junior" | "middle" | "senior";
  skills?: string[];
};


export default function PublicCvPage() {
  const { candidateId } = useParams<{ candidateId: string }>(); // 
  const { data, isLoading, refetch } = usePublicProfile(candidateId || '');

  const [form, setForm] = useState<PublicProfileForm>({
    fullName: "",
    phone: "",
    level: undefined,
    skills: [],
  });

  useEffect(() => {
    if (data) {
      setForm({
        fullName: data.fullName ?? "",
        phone: data.phone ?? "",
        level: data.level ?? undefined,
        skills: data.skills ?? [],
      });
    }
  }, [data]);

  if (isLoading) return <CircularProgress />;

  // --- RENDER CV VIEW ---
  const renderCV = () => (
    <Paper elevation={6} sx={{ borderRadius: 4, overflow: "hidden", display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "700px" }}>
      {/* Sidebar */}
      <Box sx={{ width: { xs: "100%", md: "300px" }, bgcolor: "#1a237e", color: "white", p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar sx={{ width: 120, height: 120, mx: "auto", mb: 2, border: "4px solid white" }}>
            {form.fullName.charAt(0)}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{form.fullName}</Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: 1.2, fontSize: "0.8rem", mt: 1 }}>
            {form.level || "Candidate"}
          </Typography>
        </Box>

        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography variant="subtitle2" sx={{ borderBottom: "1px solid rgba(255,255,255,0.3)", pb: 1 }}>CONTACT</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmailIcon fontSize="small" /> <Typography variant="body2">{data?.email}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon fontSize="small" /> <Typography variant="body2">{form.phone || "N/A"}</Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 6 }}>
          <Typography variant="subtitle2" sx={{ borderBottom: "1px solid rgba(255,255,255,0.3)", pb: 1, mb: 2 }}>SKILLS</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {form.skills?.map(skill => (
              <Chip key={skill} label={skill} size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Main Body */}
      <Box sx={{ flex: 1, p: { xs: 3, md: 6 }, bgcolor: "white" }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }} gutterBottom>Professional Summary</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
          Highly motivated {form.level} professional with expertise in {form.skills?.join(", ")}. 
          Looking to contribute to innovative projects and grow within a dynamic team.
        </Typography>

        <Divider sx={{ my: 4 }} />
        
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WorkIcon color="primary" /> Experience
            </Typography>
            <Typography variant="body2" color="text.secondary italic">Detail your work history here...</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SchoolIcon color="primary" /> Education
            </Typography>
            <Typography variant="body2" color="text.secondary italic">Detail your academic background here...</Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {renderCV()}
    </Container>
  );
}
