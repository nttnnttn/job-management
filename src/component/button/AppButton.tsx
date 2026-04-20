import { Button, ButtonProps } from "@mui/material";
import React from "react";

const AppButton: React.FC<ButtonProps> = ({
  children,
  ...props
}) => (
  <Button
    {...props}
    style={{
      borderRadius: 8,
      fontWeight: 500,
      ...props.style,
    }}
  >
    {children}
  </Button>
);

export default AppButton;