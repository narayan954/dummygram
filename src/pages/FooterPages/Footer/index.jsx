import "./index.css";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footerpages-footer">
      <ul>
        <li>
          <Link to="/about" className="footer-link">
            About
          </Link>
        </li>
        <li>
          <Link to="/feedback" className="footer-link">
            Feedback
          </Link>
        </li>
        <li>
          <Link to="/contributors" className="footer-link">
            Contributors
          </Link>
        </li>
        <li>
          <Link to="/help-center" className="footer-link">
            Help-center
          </Link>
        </li>
        <li>
          <Link to="/guidelines" className="footer-link">
            Guidelines
          </Link>
        </li>
      </ul>
      <p>&copy; 2023 NARAYAN SONI. All rights reserved.</p>
    </div>
  );
};

export default Footer;
