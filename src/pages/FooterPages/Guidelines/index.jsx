import "./index.css";
import "../design.css";

import { Link } from "react-router-dom";

const Guidelines = () => {
  return (
    <div className="guidlines-container footer-page-para-color">
      <span className="grad1 grad"></span>
      <span className="grad2 grad"></span>
      <span className="grad3 grad about-grad"></span>
      <span className="grad4 grad"></span>
      <div className="glassmorphism-effect guidelines-sub-container">
        <h1 className="guidelines-heading footer-page-heading-color">
          GUIDELINES
        </h1>
        <div className="guidelines">
          <h2 className="guidelines-sub-heading footer-page-heading-color">
            Account Creation
          </h2>
          <ul className="guidelines-box">
            <li>Users must be at least 13 years old to create an account.</li>
            <li>
              Users must provide accurate and verifiable information during the
              registration process.
            </li>
            <li>
              Each user can create multiple account but having only one account
              is prescribed.
            </li>
          </ul>
        </div>
        <div className="guidelines">
          <h2 className="guidelines-sub-heading footer-page-heading-color">
            User Conduct
          </h2>
          <ul className="guidelines-box">
            <li>
              <span>Respect for Others:</span> Users must treat others with
              respect, refrain from harassment, hate speech, or any form of
              bullying.
            </li>
            <li>
              <span>Prohibited Content:</span> Users should not post or share
              explicit, offensive, violent, or illegal content. This includes
              nudity, hate speech, graphic violence, or content that infringes
              on intellectual property rights.
            </li>
            <li>
              <span>Privacy and Consent:</span> Users must respect the privacy
              and consent of others, and not share private or sensitive
              information without permission.
            </li>
            <li>
              <span>Impersonation:</span> Users must not impersonate other
              individuals or organizations.
            </li>
          </ul>
        </div>
        <div className="guidelines">
          <h2 className="guidelines-sub-heading footer-page-heading-color">
            Intellectual Property
          </h2>
          <ul className="guidelines-box">
            <li>
              Users should not post or share copyrighted material without the
              necessary permissions or licenses.
            </li>
            <li>
              User can report about any copyright infringement to our{" "}
              <Link to={"/dummygram/report"} className="guideline-link">
                report
              </Link>{" "}
              page.
            </li>
          </ul>
        </div>
        <div className="guidelines">
          <h2 className="guidelines-sub-heading footer-page-heading-color">
            Safety and Security
          </h2>
          <ul className="guidelines-box">
            <li>
              <span>Account Security:</span> Users should choose a strong,
              unique password and safeguard their login credentials.
            </li>
            <li>
              <span>Reporting Inappropriate Behavior:</span> Users is encouraged
              to report any abusive, offensive, or inappropriate behavior they
              encounter on the platform to the{" "}
              <Link to={"/dummygram/report"} className="guideline-link">
                report
              </Link>{" "}
              page.
            </li>
            <li>
              <span>Privacy Settings:</span> Users should have control over
              their privacy settings and the visibility of their content.
            </li>
          </ul>
        </div>
        <div className="guidelines">
          <h2 className="guidelines-sub-heading footer-page-heading-color">
            Moderation and Enforcement
          </h2>
          <ul className="guidelines-box">
            <li>
              <span>Content Moderation:</span> The platform have a system in
              place to monitor and moderate user-generated content to ensure
              compliance with guidelines.
            </li>
            <li>
              <span>Reporting System:</span> Users can easily report to
              violations or inappropriate behavior through our{" "}
              <Link to={"/dummygram/report"} className="guideline-link">
                report
              </Link>{" "}
              page.
            </li>
            <li>
              <span>Enforcement Actions:</span> The platform should outline the
              consequences for violating the guidelines, which may include
              warnings, temporary suspensions, or permanent account bans.
            </li>
          </ul>
        </div>
        <div className="guidelines">
          <h2 className="guidelines-sub-heading footer-page-heading-color">
            Data Privacy and Security
          </h2>
          <ul className="guidelines-box">
            <li>
              <span>User Data Protection:</span> Users' personal information is
              protected and handled in accordance with applicable data
              protection laws.
            </li>
            <li>
              <span>Transparency:</span> The platform clearly communicate its
              data collection and usage practices to users.
            </li>
          </ul>
        </div>
        <div className="guidelines">
          <h2 className="guidelines-sub-heading footer-page-heading-color">
            Legal Compliance
          </h2>
          <ul className="guidelines-box">
            <li>
              Users should comply with all applicable laws and regulations while
              using the platform.
            </li>
            <li>
              The platform should cooperate with law enforcement agencies, when
              required, to ensure the safety and security of its users.
            </li>
          </ul>
        </div>
        <div className="guidelines">
          <h2 className="guidelines-sub-heading footer-page-heading-color">
            Updates to Guidelines
          </h2>
          <ul className="guidelines-box">
            <li>
              The platform reserve the right to update the guidelines as needed
              and communicate changes to its users
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
