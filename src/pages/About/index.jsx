import "./index.css"
import appLogo from "../../assets/app-logo.png"
import { useEffect, useState } from "react"

const About = () => {
  const [forks, setForks] = useState(0)
  const [stars, setStars] = useState(0)

  useEffect(() => {
    fetch("https://api.github.com/repos/narayan954/dummygram")
      .then(res => res.json())
      .then(data => {
        setForks(data.forks_count)
        setStars(data.stargazers_count)
      })
  }, [])

  return (
    <div className="about-container">
      <div className="about-sub-container">
        <span className="grad1 grad"></span>
        <span className="grad2 grad"></span>
        <span className="grad3 grad"></span>
        <span className="grad grad4"></span>
        <div className="about-section">
          <img src={appLogo} alt="dummygram" id="about-dummygram-logo" />
          <p className="about-section-text">Welcome to Dummygram, an exciting platform that aims to reimagine and revolutionize the way we connect and share moments with others. A creative space where you can showcase your unique perspective, explore diverse content, and foster meaningful connections with like-minded individuals from around the globe.</p>
          <h2 className="about-headings">VISION</h2>
          <p className="about-section-text">Combine the best features of Instagram while adding a touch of innovation and uniqueness. We strive to create a platform that encourages creativity, authenticity, and positive interactions.</p>
          <h2 className="about-headings">CREATORS</h2>
          <p className="about-section-text">Dummygram's development has been started by <a href="https://www.linkedin.com/in/narayan-soni/">Narayan Soni</a> in September 2022 and now has over 80 contributors to success. Together let's move ahead and make dummygram a huge success. Join us today on <a href="https://github.com/narayan954/dummygram">GitHub!</a></p>
          <h2 className="about-headings">STATS</h2>
          <div className="about-section-stats-container">
            <p className="about-section-stats"><span className="about-stats">Total Commits:</span> 800+</p>
            <p className="about-section-stats"><span className="about-stats">Forks:</span> {forks}</p>
            <p className="about-section-stats"><span className="about-stats">Stars:</span> {stars}</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default About