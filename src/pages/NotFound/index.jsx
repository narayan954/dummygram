import "./index.css"
import { Box, Button, Container, Typography } from "@mui/material";

import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import React from "react";
import img1 from "../../assets/404/404_1.png"
import img2 from "../../assets/404/404_2.png"
import img3 from "../../assets/404/404_3.jpeg"
import img4 from "../../assets/404/404_4.jpeg"

export default function Error() {
  const imagesArr = [img1, img2, img3, img4];
  const randomIdx = Math.floor(Math.random() * 4);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 67px)",
        marginInline: "10px",
      }}
    >
      <Container maxWidth="md">
        <div className="not_found_container">
          <Grid xs={6}>
            <Typography variant="h1" fontSize={150} style={{ color: "var(--text-secondary)" }}>
              404
            </Typography>
            <Typography variant="h3" style={{ color: "var(--text-secondary)", margin: "0" }}>
              Page Not Found
            </Typography>
            <div className="not_found_poem">
              <p>Oops, not here, take a U-turn, no fear,</p>
              <p>Find Dummygram's realm, it's near.</p>
              <p>Click 'Back Home' below, come what may,</p>
              <p>Brighter times just a click away!"</p>
            </div>
            <Link to="/dummygram/">
              <Button
                variant="contained"
                className="not_found_btn"
                style={{color: "black", fontWeight: "600"}}
              >
                Back To Home
              </Button>
            </Link>
          </Grid>
          <Grid xs={6}>
            <img
              src={imagesArr[randomIdx]}
              alt="error image"
              style={{ borderRadius: "12px", aspectRatio: "initial", maxHeight: "300px" }}
            />
          </Grid>
        </div>
      </Container>
    </Box>
  );
}
