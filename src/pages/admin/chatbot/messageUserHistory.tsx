import { Box, Typography, Paper } from "@mui/material"
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../../api/admin.api";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface UserChatHistoryProps {
  selectedConverId: string
}

export const MainUserChatHistory: React.FC<UserChatHistoryProps> = ({selectedConverId}) => {
    // 1. Fetch data only when selectedUserId exists
    const { data: currentMessages, isLoading } = useQuery({
        queryKey: ['messages', selectedConverId],
        queryFn: () => adminApi.getConversactionDetail(selectedConverId),
        enabled: !!selectedConverId, // Prevents calling API if no user is clicked
    });
    
    return (
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {currentMessages?.map((msg, idx) => (
            <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'assistant' ? 'flex-start' : 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexDirection: msg.role === 'assistant' ? 'row' : 'row-reverse' }}>
                {msg.role === 'assistant' ? <SmartToyIcon fontSize="small" color="primary" /> : <PersonIcon fontSize="small" color="action" />}
                <Typography variant="caption" color="text.secondary">{msg.role.toUpperCase()} • {msg.createdAt}</Typography>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5, maxWidth: '70%', borderRadius: 2,
                  bgcolor: msg.role === 'assistant' ? '#fff' : '#1976d2',
                  color: msg.role === 'assistant' ? 'text.primary' : '#fff',
                  border: msg.role === 'assistant' ? '1px solid #e0e0e0' : 'none'
                }}
              >
                <Typography variant="body2">{msg.content}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
    )
}