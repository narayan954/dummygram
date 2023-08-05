import { Box, Button, Typography, useMediaQuery } from "@mui/material";

import { GitHub } from "@mui/icons-material";
import { Link } from "react-router-dom";
import React from "react";

function ContributorCard(props) {
  const { image, title, commits, profile } = props;
  const isNonMobileScreen = useMediaQuery("(max-width: 800px)");

  return (
    <Box
      className="contributors-card"
      // width={isNonMobileScreen ? "100%" : "25%"}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        border: "2px solid black",
        borderRadius: "20px",
        boxShadow:
          "0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3)",
        ":hover": { scale: "1.03", transition: "ease-in-out" },
      }}
    >
      <Box
        padding={isNonMobileScreen ? "0" : "0 2.5rem"}
        style={{ textAlign: "center" }}
      >
        <img
          src={`https://images.weserv.nl/?output=webp&url=${image}`}
          alt={title}
          style={{ width: "10rem", height: "10rem", borderRadius: "50%" }}
        />
      </Box>
      <Link
        to={profile}
        style={{ textDecoration: "none" }}
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              marginRight: "10px",
              display: "flex",
              alignItems: "center",
              color: "var(--link-color)",
            }}
          >
            <GitHub />
          </span>
          <Typography
            fontSize="1.3rem"
            fontFamily="serif"
            textAlign="center"
            my="1rem"
            fontWeight="600"
            color="var(--link-color)"
          >
            {title}
          </Typography>
        </div>
      </Link>

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
    </Box>
  );
}

export default ContributorCard;
