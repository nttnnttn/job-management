import React, { useState } from "react";
import { Box, TextField, InputAdornment, IconButton, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface SkillInputProps {
  label?: string;
  placeholder?: string;
  skills: string[];
  onChange: (updatedSkills: string[]) => void;
}

const SkillInput: React.FC<SkillInputProps> = ({
  label = "Kỹ năng yêu cầu",
  placeholder = "Ví dụ: React, Node.js",
  skills,
  onChange,
}) => {
  const [currentSkill, setCurrentSkill] = useState("");

  const handleAddSkill = () => {
    const trimmedSkill = currentSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onChange([...skills, trimmedSkill]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <Box sx={{ flex: 1 }}>
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
        value={currentSkill}
        onChange={(e) => setCurrentSkill(e.target.value)}
        onKeyDown={(e) => { // Dùng onKeyDown thay cho onKeyPress (deprecated)
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill();
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleAddSkill} edge="end" color="primary">
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {skills.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
          {skills.map((skill, index) => (
            <Chip
              key={`${skill}-${index}`}
              label={skill}
              onDelete={() => handleRemoveSkill(skill)}
              color="secondary"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SkillInput;
