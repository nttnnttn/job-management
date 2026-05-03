import { List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material"
import { useState } from "react"
import { formatChatTime } from "../../../constants/helper"
import { AllUserChatDto } from "../../../api-client"


interface UserChatProps {
  users: AllUserChatDto[]
  search: string
  changeSelectedUser: (name: AllUserChatDto) => void
}
export const ListUserChat: React.FC<UserChatProps> = ({ users, search, changeSelectedUser: changeSelectedUserName }) => {
  const [selectedUser, setSelectedUser] = useState(users[0]);

  const handleChangeSelectedUser = (selectedUser: AllUserChatDto) => {
    setSelectedUser(selectedUser)
    changeSelectedUserName(selectedUser)
  }

  return (
    <List sx={{ }}>
      {users.filter(u => u.fullName.toLowerCase().includes(search.toLowerCase())).map((user) => (
        // ... inside the .map() function:
        <ListItem
          key={user.conversationId}
          disablePadding // Removes default padding so the button fills the space
          sx={{ borderBottom: '1px solid #f0f0f0' }}
        >
          <ListItemButton
            selected={selectedUser?.conversationId === user.conversationId}
            onClick={() => handleChangeSelectedUser(user)}
            sx={{
              '&.Mui-selected': { bgcolor: '#e3f2fd' },
              px: 2,
              py: 1.5
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                {user.fullName[0]} {/* Using first letter if no image */}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography
                variant="subtitle2"
                sx={{ fontWeight: 700 }} // Move fontWeight here
              >
                {user.fullName}
              </Typography>
              }
              secondary={<Typography variant="body2" color="text.secondary" noWrap>{user.lastMessage}</Typography>}
            />
            <Typography variant="caption" color="text.secondary">{formatChatTime(user.lastActivity)}</Typography>
          </ListItemButton>
        </ListItem>

      ))}
    </List>
  )
};