import React, { useEffect } from "react";

interface AdComponentProps {
  adSlot: string;
}

const AdComponent: React.FC<AdComponentProps> = ({ adSlot }) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch (e) {
      console.error("Error loading ads:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "inline-block",
        width: "300px",
        height: "250px",
      }}
      data-ad-client="ca-pub-3940256099942544"
      data-ad-slot={adSlot}
    ></ins>
  );
};

export default AdComponent;
