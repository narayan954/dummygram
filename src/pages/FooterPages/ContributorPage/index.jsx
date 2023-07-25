import "./index.css";
import "../design.css";

import { Box, Pagination, Typography, useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import ContributorCard from "./ContributorCard";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { VscChromeClose } from "react-icons/vsc";
import backgroundimg from "../../../assets/contributors.png";

function Contributor() {
  const [currentPage, setCurrentPage] = useState(1);

  const [contributors, setContributors] = useState([]);
  const isNonMobileScreen = useMediaQuery("(max-width: 800px)");
  const navigate = useNavigate();

  const getData = async () => {
    const res = await fetch(
      `https://api.github.com/repos/narayan954/dummygram/contributors?page=${currentPage}&&per_page=10`,
    );

    const data = await res.json();
    const contributorsData = data.filter(
      (contributor) => !contributor.login.includes("deepsource-autofix[bot]"),
    );
    setContributors(contributorsData);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  return (
    <div className="footer-page-container footer-page-para-color">
      <div className="footer-page-header">
        <div
          className="footer-page-header-img"
          style={{ position: "relative" }}
        >
          <img src={backgroundimg} style={{ objectFit: "cover" }} />
        </div>
      </div>
      <div
        className="back-icon"
        style={{ height: "90px", cursor: "pointer" }}
        onClick={() => navigate("/dummygram/")}
      >
        <KeyboardBackspaceIcon className="icon" /> <span>Back to Home</span>
      </div>
      <div className="footer-page-section">
        <h2 className="footer-page-headings footer-page-heading-color">
          Our Contributors
        </h2>
      </div>
      <div className="contributors-outer">
        <Box
          className="contributors-container"
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            rowGap: "2rem",
            justifyContent: "space-around",
          }}
        >
          {contributors.map((contributor) => (
            <ContributorCard
              key={contributor.id}
              image={contributor.avatar_url}
              title={contributor.login}
              commits={contributor.contributions}
              profile={contributor.html_url}
            />
          ))}
        </Box>
        <Box
          className="navigation"
          display="flex"
          justifyContent="center"
          mt="3rem"
        >
          <Pagination
            page={currentPage}
            onChange={handleChange}
            variant="outlined"
            color="primary"
            count={10}
          />
        </Box>
      </div>
    </div>
  );
}

export default Contributor;
