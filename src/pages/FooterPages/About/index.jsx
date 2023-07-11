import "./index.css";
import "../design.css";

import { useEffect, useState } from "react";

import logo from "../../../assets/logo.webp";

const About = () => {
  const [forks, setForks] = useState(0);
  const [stars, setStars] = useState(0);
  const [commits, setCommits] = useState(0);
  const [contributors, setContributors] = useState(0);

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
      .then((res) => res.json())
      .then((data) => {
        setForks(data.forks_count);
        setStars(data.stargazers_count);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }, []);

  return (
    <div className="about-container footer-page-para-color">
      <div className="about-sub-container">
        <span className="grad1 grad"></span>
        <span className="grad2 grad"></span>
        <span className="grad3 grad"></span>
        <span className="grad4 grad"></span>
        <div className="about-section glassmorphism-effect">
          <img
            className="about-logo"
            src={logo}
            alt="dummygram"
            id="about-dummygram-logo"
          />
          <p className="about-section-text">
            Welcome to Dummygram, an exciting platform that aims to reimagine
            and revolutionize the way we connect and share moments with others.
            A creative space where you can showcase your unique perspective,
            explore diverse content, and foster meaningful connections with
            like-minded individuals from around the globe.
          </p>
          <h2 className="about-headings footer-page-heading-color">VISION</h2>
          <p className="about-section-text">
            Combine the best features of Instagram while adding a touch of
            innovation and uniqueness. We strive to create a platform that
            encourages creativity, authenticity, and positive interactions.
          </p>
          <h2 className="about-headings footer-page-heading-color">CREATORS</h2>
          <p className="about-section-text">
            Dummygram's development has been started by{" "}
            <a href="https://www.linkedin.com/in/narayan-soni/">Narayan Soni</a>{" "}
            in September 2022 and now has over {contributors} contributors to
            success. Together let's move ahead and make dummygram a huge
            success. Join us today on{" "}
            <a href="https://github.com/narayan954/dummygram">GitHub!</a>
          </p>
          <h2 className="about-headings footer-page-heading-color">STATS</h2>
          <div className="about-section-stats-container">
            <p className="about-section-stats">
              <span className="about-stats">Total Commits:</span> {commits}
            </p>
            <p className="about-section-stats">
              <span className="about-stats">Forks:</span> {forks}
            </p>
            <p className="about-section-stats">
              <span className="about-stats">Stars:</span> {stars}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
