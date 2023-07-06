import { Box, Button, Typography, useMediaQuery } from "@mui/material";

import { GitHub } from "@mui/icons-material";
import { Link } from "react-router-dom";
import React from "react";

function ContributorCard(props) {
  const { image, title, commits, profile } = props;
  const isNonMobileScreen = useMediaQuery("(max-width: 800px)");

  return (
    <Box
      width={isNonMobileScreen ? "100%" : "25%"}
      padding="2rem"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      sx={{
        border: "2px solid black",
        borderRadius: "20px",
        boxShadow:
          "0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3)",
        ":hover": { scale: "1.03", transition: "ease-in-out" },
      }}
    >
      <Box padding={isNonMobileScreen ? "0" : "0 2.5rem"}>
        <img
          src={`https://images.weserv.nl/?output=webp&url=${image}`}
          alt={title}
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />
      </Box>
      <Typography
        fontSize="1.2rem"
        fontFamily="serif"
        textAlign="center"
        my="1rem"
      >
        {title}
      </Typography>

      <Button
        variant="outlined"
        color="primary"
        fontSize="1.2rem"
        fontFamily="serif"
        textalign="center"
        sx={{ marginBottom: "1rem" }}
      >
        {commits} commits
      </Button>

      <Link to={profile} target="_blank" referrerPolicy="no-referrer">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<GitHub />}
          sx={{ width: "100%" }}
        >
          View Profile
        </Button>
      </Link>
    </Box>
  );
}

export default ContributorCard;
