import "./index.css";
import "../design.css";

import React, { useRef } from "react";

import { SideBar } from "../../../components";
import emailjs from "@emailjs/browser";
import { playSuccessSound } from "../../../js/sounds";
import { useSnackbar } from "notistack";

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
        "OV1vxF7lxYkw_RRWy"
      )
      .then(
        (result) => {
          playSuccessSound();
          enqueueSnackbar("Thanks For Your Feedback!", {
            variant: "success"
          });
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  };

  return (
    <>
      <SideBar />
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
          />
          <label>Email</label>
          <input
            type="email"
            name="user_email"
            placeholder="Enter your Email"
            className="feedback_input"
          />
          <label>Feedback</label>
          <textarea
            name="message"
            placeholder="Feedback..."
            className="feedback_textarea"
            rows={5}
          />
          <button type="submit" className="feedback_sent_btn button-style">
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default Feedback;
