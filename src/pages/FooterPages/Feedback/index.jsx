import "./index.css";
import "../design.css";

import React, { useRef } from "react";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { SideBar } from "../../../components";
import emailjs from "@emailjs/browser";
import { playSuccessSound } from "../../../js/sounds";
import { useSnackbar } from "notistack";
import Footer from "../../../components/Footer/Footer";
import Scroll from "../../../reusableComponents";

export const Feedback = () => {
  const form = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_hg3vdpg",
        "dummygram_feedback",
        form.current,
        "OV1vxF7lxYkw_RRWy",
      )
      .then(
        (result) => {
          playSuccessSound();
          enqueueSnackbar("Thanks For Your Feedback!", {
            variant: "success",
          });
        },
        (error) => {
          console.error("Error:", error);
        },
      );
  };

  return (
    <>
       <div
        className="back-icon"
        style={{ height: "90px", cursor: "pointer", marginTop:'35px' }}
        onClick={() => navigate("/dummygram/")}
      >
        <KeyboardBackspaceIcon className="icon" /> 
      </div>
      <h1 style={{textAlign:'center', color:'#5f85db'}}>Your opinion matters to us !</h1>
      <div className="feedback-form-container footer-page-para-color">
        <span className="grad3 grad"></span>
        <span className="grad4 grad"></span>
        <form
          ref={form}
          onSubmit={sendEmail}
          className="glassmorphism-effect"
          id="feedback_form"
        >
          <label>Name</label>
          <input
            type="text"
            name="user_name"
            placeholder="Enter your Name"
            className="feedback_input"
            maxLength={30}
          />
          <label>Email</label>
          <input
            type="email"
            name="user_email"
            placeholder="Enter your Email"
            className="feedback_input"
            maxLength={320}
          />
          <label>Feedback</label>
          <textarea
            name="message"
            placeholder="Feedback..."
            className="feedback_textarea"
            rows={5}
            maxLength={600}
          />
          <button type="submit" className="feedback_sent_btn button-style">
            Send
          </button>
        </form>
      </div>
      <Scroll/>
      <Footer/>
    </>
  );
};

export default Feedback;
