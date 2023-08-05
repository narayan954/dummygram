import "./index.css";
import "../design.css";

import { Box, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";

import ContributorCard from "./ContributorCard";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import backgroundimg from "../../../assets/contributors.png";
import { useNavigate } from "react-router-dom";

function Contributor() {
  const [currentPage, setCurrentPage] = useState(1);
  const [contributors, setContributors] = useState([]);
  const [searchResult, setSearchResult] = useState("");

  const navigate = useNavigate();

  const getData = async () => {
    const res = await fetch(
      `https://api.github.com/repos/narayan954/dummygram/contributors?page=${currentPage}&&per_page=${
        searchResult.length < 1 ? 10 : ""
      }`,
    );

    const data = await res.json();
    const contributorsData = data.filter(
      (contributor) => !contributor.login.includes("deepsource-autofix[bot]"),
    );
    const value = contributorsData.filter((item) => {
      return `${item.login.toLowerCase()}`.includes(searchResult.toLowerCase());
    });
    if (searchResult.length > 0) {
      setContributors(value);
    } else {
      setContributors(contributorsData);
    }
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    getData();
  }, [currentPage, searchResult]);

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
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="&nbsp;"
          onChange={(e) => setSearchResult(e.target.value)}
        />
        <span className="label">Search Contributor</span>
        <span className="highlight"></span>
      </div>
      <div className="contributors-outer">
        <Box
          className="contributors-container"
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            rowGap: "2rem",
            justifyContent: "center",
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
          {searchResult < 1 && (
            <Pagination
              page={currentPage}
              onChange={handleChange}
              variant="outlined"
              color="primary"
              count={10}
            />
          )}
        </Box>
        {contributors.length == 0 && (
          <h1 className="no-result">Sorry no result matches your query</h1>
        )}
      </div>
    </div>
  );
}

export default Contributor;
