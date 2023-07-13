import "../design.css";
import "./index.css";

import { Box, Pagination, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import {  Button } from "@mui/material";

import ContributorCard from "./ContributorCard";

function Contributor() {
  const [currentPage, setCurrentPage] = useState(1);

  const [contributors, setContributors] = useState([]);
  const isNonMobileScreen = useMediaQuery("(max-width: 800px)");

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
    <div className="contributor-container footer-page-para-color">
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '87%' }}>
      <div className="contributor-sub-container">
        <span className="grad1 grad"></span>
        <span className="grad2 grad"></span>
        <span className="grad3 grad"></span>
        <span className="grad4 grad"></span>
        <span className="grad5 grad"></span>
        <span className="grad6 grad"></span>
        <span className="grad7 grad"></span>
        <span className="grad8 grad"></span>
        <span className="grad9 grad"></span>
        <span className="grad10 grad"></span>
        <span className="grad11 grad"></span>
        <span className="grad12 grad"></span>
        <div className="contributor-section glassmorphism-effect">
          <Box
            margin={isNonMobileScreen ? "1rem 3rem" : "1rem 3rem"}
            position="relative"
          >
            <Typography
              textAlign="center"
              fontFamily="serif"
              fontSize="3.2rem"
              fontWeight="600"
              m="6rem 0 2rem 0"
            >
              Our Contributors
            </Typography>
            <Box
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

            <Box display="flex" justifyContent="center" mt="2rem">
              <Pagination
                page={currentPage}
                onChange={handleChange}
                variant="outlined"
                color="primary"
                count={10}
              />
            </Box>
          </Box>
        </div>
      </div>
      <Link to="/dummygram/">
        <Button variant="contained" style={{ backgroundColor: '#C147E9', color: 'black' ,borderRadius: '0.45rem',  fontWeight: 'bold',}}>
            Back Home
        </Button>
      </Link>
    </div>
    </div>
  );
}

export default Contributor;
