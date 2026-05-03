import React, { useState } from 'react';
import {
  Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, 
  Typography, Divider, Paper, TextField, InputAdornment, Chip, IconButton,
  ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';

// Mock Data
const users = [
  { id: 1, name: 'Nguyen Van A', lastMsg: 'I need help with my CV', time: '10:30 AM', status: 'online' },
  { id: 2, name: 'Tran Thi B', lastMsg: 'Job status update?', time: 'Yesterday', status: 'offline' },
  { id: 3, name: 'Le Van C', lastMsg: 'Thank you!', time: 'Monday', status: 'offline' },
];

const mockMessages = {
  1: [
    { sender: 'user', text: 'Hi, I need help with my CV for the Developer position.', time: '10:25 AM' },
    { sender: 'ai', text: 'Hello! I can help with that. What specifically do you need?', time: '10:26 AM' },
    { sender: 'user', text: 'I need help with my CV', time: '10:30 AM' },
  ],
};

const ChatHistoryPage = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [search, setSearch] = useState('');

  const currentMessages = mockMessages[1] || [];

  return (
    <Box sx={{ display: 'flex', height: '80vh', bgcolor: '#f5f5f5', borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
      {/* Sidebar - User List */}
      <Paper sx={{ width: 320, display: 'flex', flexDirection: 'column', borderRadius: 0, borderRight: '1px solid #ddd' }}>
        <Box sx={{ p: 2 }}>
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
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map((user) => (
            // ... inside the .map() function:
            <ListItem 
              key={user.id} 
              disablePadding // Removes default padding so the button fills the space
              sx={{ borderBottom: '1px solid #f0f0f0' }}
            >
              <ListItemButton
                selected={selectedUser?.id === user.id}
                onClick={() => setSelectedUser(user)}
                sx={{ 
                  '&.Mui-selected': { bgcolor: '#e3f2fd' }, 
                  px: 2, 
                  py: 1.5 
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: user.status === 'online' ? 'success.main' : 'grey.400' }}>
                    {user.name[0]} {/* Using first letter if no image */}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography 
                    variant="subtitle2" 
                    sx={{ fontWeight: 700 }} // Move fontWeight here
                  >
                    {user.name}
                  </Typography>
                  }
                  secondary={<Typography variant="body2" color="text.secondary" noWrap>{user.lastMsg}</Typography>}
                />
                <Typography variant="caption" color="text.secondary">{user.time}</Typography>
              </ListItemButton>
            </ListItem>
            
          ))}
        </List>
      </Paper>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, elevation: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar>{selectedUser.name[0]}</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{fontWeight: "bold"}} >{selectedUser.name}</Typography>
              <Typography variant="caption" color="success.main">Active Session</Typography>
            </Box>
          </Box>
          <Chip label="Monitoring Mode" color="info" size="small" />
        </Paper>

        {/* Message History */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {currentMessages.map((msg, idx) => (
            <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'ai' ? 'flex-start' : 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexDirection: msg.sender === 'ai' ? 'row' : 'row-reverse' }}>
                {msg.sender === 'ai' ? <SmartToyIcon fontSize="small" color="primary" /> : <PersonIcon fontSize="small" color="action" />}
                <Typography variant="caption" color="text.secondary">{msg.sender.toUpperCase()} • {msg.time}</Typography>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5, maxWidth: '70%', borderRadius: 2,
                  bgcolor: msg.sender === 'ai' ? '#fff' : '#1976d2',
                  color: msg.sender === 'ai' ? 'text.primary' : '#fff',
                  border: msg.sender === 'ai' ? '1px solid #e0e0e0' : 'none'
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>

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
