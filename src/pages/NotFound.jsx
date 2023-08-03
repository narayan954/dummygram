import { Box, Button, Container, Typography } from "@mui/material";

import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import React from "react";

export default function Error() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography variant="h1" style={{ color: "var(--text-secondary)" }}>
              404
            </Typography>
            <Typography variant="h6" style={{ color: "var(--text-secondary)" }}>
              The page you're looking for doesn't exist.
            </Typography>
            <Link to="/dummygram/">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "var(--btn-hover)",
                  color: "black",
                  borderRadius: "0.45rem",
                  marginTop: "15px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#2d5dc9",
                    color: "black",
                  },
                }}
                // style={{ backgroundColor: "var(--btn-hover)"}}
              >
                Back Home
              </Button>
            </Link>
          </Grid>
          <Grid xs={6}>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt="error image"
              width={500}
              height={250}
              style={{ borderRadius: "12px" }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
