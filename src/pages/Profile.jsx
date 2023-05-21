import { Box, Divider, Typography, useMediaQuery } from "@mui/material";

import { FaUserCircle } from "react-icons/fa";

function Profile({ curUser }) {
  const isNonMobile = useMediaQuery("(min-width: 768px)");

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width={isNonMobile ? "20%" : "80%"}
        paddingY={3}
        sx={{ border: "1px solid gray", borderRadius: "10px" }}
        display="flex"
        justifyContent="center"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box marginX="auto" fontSize="600%">
            <FaUserCircle />
            <Divider />
          </Box>
          <Typography fontSize="1.3rem" fontWeight="600" fontFamily="serif">
            {curUser.displayName}
          </Typography>
          <Divider />
          <Typography fontSize="1.5rem" fontWeight="600" fontFamily="serif">
            {curUser.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
