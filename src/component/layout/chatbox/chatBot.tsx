import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { chatbotControllerChat } from "../../../api-client";
import renderDataList from "./chatAIData";
import { useNavigate } from "react-router-dom";

// 1. Updated interface to include timestamp
interface ChatMessage {
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  data?: {
    jobdtos?: any[];
    userdtos?: any[];
  };
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");

  // Helper to get current time string
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      sender: "bot", 
      text: "Xin chào! Tôi có thể giúp gì cho bạn?", 
      timestamp: getCurrentTime() 
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen, isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = message;
    const userTime = getCurrentTime();
    setMessage("");
    
    setChatHistory((prev) => [
      ...prev, 
      { sender: "user", text: userMessage, timestamp: userTime }
    ]);
    
    setIsTyping(true);

    try {
      const chatresponse = await chatbotControllerChat({
        body: {
          content: userMessage,
          conversationId: conversationId
        }
      });

      if (!conversationId) {
        setConversationId(chatresponse.data?.conversationId || "");
      }

      setChatHistory((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: chatresponse.data?.content || "Something went wrong",
          timestamp: getCurrentTime(),
          data: {
            jobdtos: chatresponse.data?.jobDtos,
            userdtos: chatresponse.data?.userDtos,
          }
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [
        ...prev,
        { 
            sender: "bot", 
            text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với máy chủ.", 
            timestamp: getCurrentTime() 
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
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
                    flexDirection: "column",
                    alignItems: chat.sender === "user" ? "flex-end" : "flex-start",
                    mb: 1.5,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: "85%",
                      borderRadius: 2,
                      bgcolor: chat.sender === "user" ? "primary.main" : "white",
                      color: chat.sender === "user" ? "white" : "text.primary",
                      position: "relative"
                    }}
                  >
                    <ListItemText primary={chat.text} sx={{ wordBreak: "break-word" }} />
                    {chat.sender === "bot" && renderDataList(chat.data, navigate)}
                  </Paper>
                  {/* Timestamp label */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                        mt: 0.5, 
                        mx: 0.5, 
                        color: "text.secondary",
                        fontSize: "0.7rem" 
                    }}
                  >
                    {chat.timestamp}
                  </Typography>
                </ListItem>
              ))}

              {isTyping && (
                <ListItem disableGutters sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">Trợ lý đang trả lời</Typography>
                    <CircularProgress size={12} thickness={5} />
                  </Paper>
                </ListItem>
              )}
              
              <div ref={messagesEndRef} />
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
              disabled={isTyping}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleSendMessage} 
                        color="primary" 
                        edge="end"
                        disabled={isTyping || !message.trim()}
                      >
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
