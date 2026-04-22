import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Box } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

interface SkillListDisplayProps {
    skills: string[];
    title?: string;
}

const SkillListDisplay: React.FC<SkillListDisplayProps> = ({ skills, title }) => {
    if (!skills || skills.length === 0) return null;

    return (
        <Box sx={{ width: '100%' }}>
            {title && (
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 4, height: 24, bgcolor: 'primary.main', mr: 2, borderRadius: 1 }} />
                    {title}
                </Typography>
            )}
            <List sx={{ py: 0 }}>
                {skills.map((skill, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                            <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                <TaskAltIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography
                                    variant="body1"
                                    sx={{ lineHeight: 1.6, color: 'text.primary' }}
                                >
                                    {skill}
                                </Typography>
                            </ListItemText>
                        </ListItem>
                        {index < skills.length - 1 && (
                            <Divider variant="inset" component="li" sx={{ ml: 4, opacity: 0.5 }} />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

export default SkillListDisplay;
