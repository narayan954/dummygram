import "./index.css";

import React, { useState } from "react";

import Faq from "../../../assets/preview.webp";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  const accordionData = [
    {
      title: "What is Dummygram ?",
      content:
        "Dummygram is a social media platform that allows users to share photos, videos, and stories with their followers. ",
    },
    {
      title: "How To Upload Images ?",
      content:
        "Click on Post on left side menu and then click on upload Images",
    },
    {
      title: "How To See Other User Profile",
      content: "Click on Post Profile Avatar Image",
    },
    {
      title: "How To Logout",
      content:
        "Click on your profile in side menu you will get DropDown click on logout",
    },
    // Add more sections as needed
  ];

  const Accordion = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    return (
      <>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="accordionTitle">
            {/* <div className="accordion-header" onClick={toggleAccordion}>
            </div> */}
            <button
              class={`accordion ${isOpen == true && "accordionTrue"}`}
              onClick={toggleAccordion}
            >
              {title}
            </button>
            <hr />

            {isOpen && <div className="accordion-content">{content}</div>}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="footer-page-header-img" style={{ position: "relative" }}>
        <img src={Faq} style={{ objectFit: "cover" }} />
      </div>

      <div
        className="back-icon"
        style={{ height: "90px", cursor: "pointer" }}
        onClick={() => navigate("/dummygram")}
      >
        <KeyboardBackspaceIcon className="icon" /> <span>Back to Home</span>
      </div>

      <section className="faq">
        <div>
          <h1 className="faqTitle">Dummygram Frequently Asked Question</h1>
          <p className="faqSubtitle">
            Have a question in mind? We've got the answers!
          </p>
        </div>
      </section>

      <div style={{ marginTop: "60px", marginBottom: "60px" }}>
        {accordionData.map((section, index) => (
          <>
            <Accordion
              key={index}
              title={section.title}
              content={section.content}
            />
          </>
        ))}
      </div>
    </>
  );
}
