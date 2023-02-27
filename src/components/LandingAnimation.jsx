import { useState, useEffect } from "react";

export default function LandingAnimation() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [landingHtml, setLandingHtml] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("/landing.html")
      .then((response) => response.text())
      .then((html) => setLandingHtml(html))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      {showAnimation && (
        <div dangerouslySetInnerHTML={{ __html: landingHtml }} />
      )}
    </div>
  );
}
