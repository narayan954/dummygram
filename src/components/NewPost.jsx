import { AiOutlineClose } from "react-icons/ai";
import { Dialog } from "@mui/material";
import ImgUpload from "../components/ImgUpload";
import React from "react";
import { auth } from "../lib/firebase";

export default function NewPost({ openNewUpload, setOpenNewUpload }) {
  const user = auth.currentUser;
  return (
    <Dialog
      PaperProps={{
        className: "dialogStyle",
      }}
      open={openNewUpload}
      onClose={() => setOpenNewUpload(false)}
    >
      <div
        style={{
          backgroundColor: "var(--bg-color)",
          textAlign: "center",
          color: "var(--color)",
        }}
      >
        <AiOutlineClose
          onClick={() => {
            setOpenNewUpload(false);
          }}
          size={"1rem"}
          className="crossIcon"
        />
        <p className="createNewPost">Create new post</p>
        <hr />
        <ImgUpload
          user={user}
          onUploadComplete={() => setOpenNewUpload(false)}
        />
      </div>
    </Dialog>
  );
}
