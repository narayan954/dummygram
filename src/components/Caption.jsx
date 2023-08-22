import React from "react";

/**
 * Renders a caption with clickable links for URLs.
 * @param {string} caption - The input caption string.
 * @returns {JSX.Element}
 */
export default function Caption({ caption }) {
  const urlRegex = /(https?:\/\/\S+(?<![\s.,!?]))/g;

  // Split the caption into parts, separating URLs
  const parts = caption.split(urlRegex);

  // Function to check if a part URL
  /**
   *
   * @param {Array} part - The part of the caption to check.
   * @returns {boolean}
   */
  const isUrl = (part) => urlRegex.test(part);

  // Render each part of the caption
  const RenderCaptionParts = () => {
    return parts.map((part, index) => {
      if (isUrl(part)) {
        // If the part is a URL, render it as a clickable link.
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      } else {
        // If the part is not a URL, render it as plain text.
        return <span key={index}>{part}</span>;
      }
    });
  };

  return <RenderCaptionParts />;
}
