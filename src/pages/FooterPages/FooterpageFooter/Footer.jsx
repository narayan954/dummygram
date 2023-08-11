
import { Link } from "react-router-dom";
import './Footer.css';
import { Logo } from "../../../reusableComponents";

const Footer = () => {
  return (
    <div className="footerpages-footer">
      <div >
        <Logo/>
      </div>
      <ul >
        <li>
          <Link to="/dummygram/about" className="footer-link">
            About
          </Link>
        </li>
        <li>
          <Link
            to="/dummygram/feedback"
            className="footer-link"
          >
            Feedback
          </Link>
        </li>
        <li>
          <Link to="/dummygram/contributors" className="footer-link">
           Contributors
          </Link>
        </li>
        <li>
          <Link to="/dummygram/help-center" className="footer-link">
           Help-center
          </Link>
        </li>
        <li>
          <Link to="/dummygram/guidelines" className="footer-link">
           Guidelines
          </Link>
        </li>
      </ul>
      <p>&copy; 2023 NARAYAN SONI. All rights reserved.</p>
    </div>
  );
};

export default Footer;