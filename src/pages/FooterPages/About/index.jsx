import "./index.css";
import "../design.css";

import { useEffect, useState } from "react";

import Footer from "../../../components/Footer/Footer";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import about from "../../../assets/about-us.webp";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [forks, setForks] = useState(0);
  const [stars, setStars] = useState(0);
  const [commits, setCommits] = useState(0);
  const [contributors, setContributors] = useState(0);
  const navigate = useNavigate();

  const getCount = (url) => {
    return fetch(url)
      .then((response) => {
        const linkHeader = response.headers.get("link");
        const regex = /<([^>]*)>; rel="last"/;
        const match = regex.exec(linkHeader);
        if (match) {
          const lastPageUrl = match[1];
          const pageCount = new URLSearchParams(
            new URL(lastPageUrl).search,
          ).get("page");
          return parseInt(pageCount);
        } else {
          throw new Error("Unable to retrieve the link header");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getCount(
      "https://api.github.com/repos/narayan954/dummygram/commits?sha=master&per_page=1&page=1",
    ).then((count) => {
      setCommits(count);
    });
    getCount(
      "https://api.github.com/repos/narayan954/dummygram/contributors?per_page=1&anon=true",
    ).then((count) => {
      setContributors(count);
    });
  }, []);

  useEffect(() => {
    fetch("https://api.github.com/repos/narayan954/dummygram")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setForks(data.forks_count);
        setStars(data.stargazers_count);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle the error or display an error message to the user
      });
  }, []);

  return (
    <div className="footer-page-container footer-page-para-color">
      <div className="footer-page-header">
        <div
          className="footer-page-header-img"
          style={{ position: "relative" }}
        >
          <img src={about} style={{ objectFit: "cover" }} />
        </div>
      </div>
      <div
        className="back-icon"
        style={{ height: "90px", cursor: "pointer" }}
        onClick={() => navigate("/dummygram")}
      >
        <KeyboardBackspaceIcon className="icon" /> <span>Back to Home</span>
      </div>
      <div className="footer-page-section">
        <div className="about-us">
          <h2 className="footer-page-headings footer-page-heading-color">
            Who we are?
          </h2>
          <p>
            Welcome to Dummygram, an exciting platform that aims to reimagine
            and revolutionize the way we connect and share moments with others.
            A creative space where you can showcase your unique perspective,
            explore diverse content, and foster meaningful connections with
            like-minded individuals from around the globe.
          </p>
        </div>
        <div className="vision">
          <h2 className="footer-page-headings footer-page-heading-color">
            Vision
          </h2>
          <p>
            Combine the best features of Instagram while adding a touch of
            innovation and uniqueness. We strive to create a platform that
            encourages creativity, authenticity, and positive interactions.
          </p>
        </div>
        <div className="creators">
          <h2 className="footer-page-headings footer-page-heading-color">
            Creators
          </h2>
          <p>
            Dummygram's development has been started by{" "}
            <a
              href="https://www.linkedin.com/in/narayan-soni/"
              style={{ color: "var(--link-color) " }}
            >
              Narayan Soni
            </a>{" "}
            in September 2022 and now has over {contributors} contributors to
            success. Together let's move ahead and make dummygram a huge
            success. Join us today on{" "}
            <a
              href="https://github.com/narayan954/dummygram"
              style={{ color: "var(--link-color) " }}
            >
              GitHub!
            </a>
          </p>
        </div>
        <div className="stats">
          <h2
            className="footer-page-headings footer-page-heading-color"
            style={{ marginBottom: "1.5rem" }}
          >
            Stats
          </h2>
          <div className="stat-btns">
            <div className="btn1">
              <div className="btn-content">
                <span style={{ fontWeight: "800" }}>{commits}</span>
                <span className="stats-headings" style={{ fontWeight: "600" }}>
                  Total Commits
                </span>
              </div>
            </div>
            <div className="btn2">
              <div className="btn-content">
                <span style={{ fontWeight: "800" }}>{forks}</span>
                <span className="stats-headings" style={{ fontWeight: "600" }}>
                  Forks
                </span>
              </div>
            </div>
            <div className="btn3">
              <div className="btn-content">
                <span style={{ fontWeight: "800" }}>{stars}</span>
                <span className="stats-headings" style={{ fontWeight: "600" }}>
                  Stars
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
