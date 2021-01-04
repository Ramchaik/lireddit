import { Box } from "@chakra-ui/react";
import React from "react";

interface LoaderProps {}

export const Loader: React.FC<LoaderProps> = ({}) => {
  return (
    <Box mt="10%" ml="50%">
      Loading...
    </Box>
  );
};
