import React, { useEffect, useState } from 'react';
import {
  Box, List, ListItem, ListItemAvatar, ListItemText, Avatar,
  Typography, Divider, Paper, TextField, InputAdornment, Chip, IconButton,
  ListItemButton,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import { ListUserChat } from './chatbot/listUserChat';
import { useAdminAllConversation } from '../../hooks/admins/useAllUserChat';
import { AllUserChatDto } from '../../api-client';
import { MainUserChatHistory } from './chatbot/messageUserHistory';
import { useInView } from 'react-intersection-observer';

const ChatHistoryPage = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,    // Trigger when 10% visible
    rootMargin: '50px', // Trigger 50px BEFORE user reaches bottom
  });
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AllUserChatDto | undefined>(undefined);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useAdminAllConversation(
    20
  );
  const allUsers = data?.pages.flatMap((page) => page?.results || []) || [];

  // Use it to trigger the next page
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  return (
    <Box sx={{ display: 'flex', height: '80vh', bgcolor: '#f5f5f5', borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
      {/* Sidebar - User List */}
      <Paper sx={{ width: 320, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <Box sx={{ p: 2, flexShrink: 0 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Chat Management</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // Change InputProps to slotProps.input
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Divider />
        {/* 3. The Scrollable Wrapper */}
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0, // CRITICAL: Enables scrolling in nested flex
          position: 'relative',
          '&::-webkit-scrollbar': { width: '6px' }, // Optional: prettier scrollbar
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '10px' }
        }}>
          <ListUserChat
            search={search}
            users={allUsers}
            changeSelectedUser={setSelectedUser}
          />

          {/* 4. Improved Trigger Div */}
          <div ref={ref} style={{ height: '20px', width: '100%' }}>
            {isFetchingNextPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </div>
        </Box>
      </Paper>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser &&
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, elevation: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar>{selectedUser?.fullName[0]}</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }} >{selectedUser?.fullName}</Typography>
                <Typography variant="caption" color="success.main">Active Session</Typography>
              </Box>
            </Box>
            <Chip label="Monitoring Mode" color="info" size="small" />
          </Paper>
        }
        {/* Message History */}
        {selectedUser && <MainUserChatHistory selectedConverId={selectedUser.conversationId} />}
        {/* Optional Admin Intervention */}
        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
          <TextField
            fullWidth
            placeholder="Reply as Admin..."
            size="small"
            // Move InputProps into slotProps.input
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton color="primary">
                    <SendIcon />
                  </IconButton>
                ),
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatHistoryPage;
