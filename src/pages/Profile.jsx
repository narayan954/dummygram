import { Avatar, Box, Divider, Typography, useMediaQuery } from "@mui/material";

import { FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function Profile() {
  const { name, email, avatar } = useLocation().state;
  const isNonMobile = useMediaQuery("(min-width: 768px)");

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width={isNonMobile ? "30%" : "80%"}
        paddingY={3}
        sx={{ border: "1px solid gray", borderRadius: "10px" }}
        display="flex"
        justifyContent="center"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box marginX="auto" fontSize="600%">
            {avatar ? (
              <Avatar
                alt={name}
                src={avatar}
                sx={{
                  width: "30vh",
                  height: "30vh",
                  bgcolor: "royalblue",
                  border: "2px solid transparent",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              />
            ) : (
              <FaUserCircle style={{ width: "25vh", height: "25vh" }} />
            )}
          </Box>
          <Divider sx={{ marginTop: "1rem" }} />
          <Typography fontSize="1.3rem" fontWeight="600" fontFamily="serif">
            {name}
          </Typography>
          <Divider />
          <Typography fontSize="1.5rem" fontWeight="600" fontFamily="serif">
            {email && email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
