import { 
  Stack, 
  Typography, 
  Chip, 
  List, 
  ListItem, 
  Divider, 
  Card, 
  CardActionArea, 
  CardContent, 
  Box
} from "@mui/material";
import { WorkOutlined as WorkIcon, PersonOutlined as PersonIcon } from '@mui/icons-material';


const renderDataList = (data: any, navigate: any) => {
  if (!data) return null;

  const hasJobs = data.jobdtos && data.jobdtos.length > 0;
  const hasUsers = data.userdtos && data.userdtos.length > 0;

  return (
    <Stack spacing={1.5} sx={{ mt: 1.5, width: '100%' }}>
      
      {/* --- Jobs Section (Card style) --- */}
      {hasJobs && (
        <List disablePadding>
          {data.jobdtos?.map((job: any, i: number) => (
            <ListItem key={`job-${i}`} disableGutters sx={{ mb: 1 }}>
              <Card variant="outlined" sx={{ width: '100%', borderRadius: 2 }}>
                <CardActionArea onClick={() => navigate(`jobs/${job._id}`)}>
                  <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Stack direction="row" spacing={1} sx={{ 
                      alignItems: 'center', 
                      mb: 0.5 
                    }}>
                      <WorkIcon fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {job.title || job.name}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary"  sx= {{display: 'block'}}>
                      {job.company || "Company details not specified"}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </ListItem>
          ))}
        </List>
      )}

      {/* --- Users Section (Chips/List style) --- */}
      {hasUsers && (
        <Box>
          {hasUsers && <Divider sx={{ my: 1, label: "Users" }} />}
          <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block', color: 'text.secondary' }}>
            Suggested Profiles:
          </Typography>
          <Stack direction="row" sx={{ 
              flexWrap: 'wrap', 
              gap: 1 // This handles the spacing/gap logic correctly
            }}>
            {data.userdtos?.map((user: any, i: number) => (
              <Chip
                key={`user-${i}`}
                icon={<PersonIcon />}
                label={user.fullName || user.userName}
                onClick={() => window.open(`/profile/public/${user.id || user._id}`, '_blank')}
                variant="outlined"
                size="small"
                clickable
                sx={{ bgcolor: 'white' }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default renderDataList;