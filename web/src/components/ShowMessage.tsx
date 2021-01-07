import { Box } from "@chakra-ui/react";
import React from "react";

export const ShowMessage: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <Box mt="10%" ml="50%">
      {message || "Loading..."}
    </Box>
  );
};
