import "./index.css";
import "../design.css";

import React, { useRef } from "react";

import { SideBar } from "../../../components";
import emailjs from "@emailjs/browser";
import { playSuccessSound } from "../../../js/sounds";
import { useSnackbar } from "notistack";
import Footer from "../FooterPagesFooter/Footer";

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
      <SideBar />
      <h1 style={{color:'#5f85db', textAlign:'center', paddingTop:'1rem'}}>Your opinion matter to us !</h1>
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
      <Footer/>
    </>
  );
};

export default Feedback;
