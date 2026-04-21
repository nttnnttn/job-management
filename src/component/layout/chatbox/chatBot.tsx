import React, { useState } from "react";
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message to history
    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
    setMessage("");

    // Simulate a bot response (Replace this with your API call)
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Cảm ơn bạn. Tôi đang xử lý câu hỏi này!" },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => setIsOpen(true)}
          sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 350,
            height: 450,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Trợ lý ảo
            </Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: "#f5f5f5" }}>
            <List disablePadding>
              {chatHistory.map((chat, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  sx={{
                    display: "flex",
                    justifyContent: chat.sender === "user" ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: "75%",
                      borderRadius: 2,
                      bgcolor: chat.sender === "user" ? "primary.main" : "white",
                      color: chat.sender === "user" ? "white" : "text.primary",
                    }}
                  >
                    <ListItemText primary={chat.text} />
                  </Paper>
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider />

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: "white" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSendMessage} color="primary" edge="end">
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
}
