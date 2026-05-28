import React, { useEffect } from "react";

interface AdComponentProps {
  adSlot: string;
  adFormat?: string;
  adLayout?: string;
}

const AdComponent: React.FC<AdComponentProps> = ({
  adSlot,
  adFormat = "auto",
  adLayout = "",
}) => {
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
        display: "block",
        minHeight: "100px",
      }}
      data-ad-client="ca-pub-3940256099942544"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout={adLayout}
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdComponent;
