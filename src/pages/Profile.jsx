import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { FaBlackTie, FaUserCircle } from "react-icons/fa";
import { NoEncryptionTwoTone } from "@mui/icons-material";

function Profile() {
  const { name, email, avatar } = useLocation().state;
  const isNonMobile = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dummygram"); // Use navigate function to change the URL
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width={isNonMobile ? "30%" : "80%"}
        backgroundColor="#F4EEFF"
        marginTop={6}
        paddingY={6}
        paddingX={7}
        sx={{ border: "none", boxShadow: "0 0 6px black", }}
        display="flex"
        justifyContent="center"
        textAlign={"center"}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box marginX="auto" fontSize="600%">
            {avatar ? (
              <Avatar
                alt={name}
                src={avatar}
                sx={{
                  width: "23vh",
                  height: "23vh",
                  bgcolor: "black",
                  border: "none",
                  boxShadow: "0 0 4px black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              />
            ) : (
              <FaUserCircle style={{ width: "23vh", height: "23vh" }} />
            )}
          </Box>
          <Divider sx={{ marginTop: "1rem" }} />
          <Typography variant="h5" fontWeight="600" fontFamily="Segoe UI">
            {name}
          </Typography>
          <Divider />
          <Typography variant="h6" fontWeight="400" fontFamily="Segoe UI">
            {email && email}
          </Typography>
          <Button
            onClick={handleBack}
            variant="contained"
            color="primary"
            sx={{ marginTop: "1rem" }}
            fontSize="1.2rem"
          >
            Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
