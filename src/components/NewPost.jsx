import React from 'react'
import { auth } from "../lib/firebase";
import { useState } from "react";
import ImgUpload from "../components/ImgUpload";
import { AiOutlineClose } from "react-icons/ai";
import { Dialog } from "@mui/material";

export default function NewPost({ openNewUpload, setOpenNewUpload }) {
    const user = auth.currentUser;
    console.log("I am Happy Today");
    return (
        <Dialog
            PaperProps={{
                className: 'dialogStyle'
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
                    size={18}
                    style={{
                        position: "absolute",
                        right: "1rem",
                        top: "1rem",
                        cursor: "pointer",
                    }}
                />
                <p
                    style={{
                        fontSize: "17px",
                        fontWeight: 500,
                        color: "var(--color)",
                        marginTop: "10px",
                        marginBottom: "8px",
                    }}
                >
                    Create new post
                </p>
                <hr />
                <ImgUpload
                    user={user}
                    onUploadComplete={() => setOpenNewUpload(false)}
                />
            </div>
        </Dialog>
    )
}


