import React, { useState, useEffect } from "react";
import LogoBakti from "../assets/auth/Bakti.svg";

const Loading = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 4 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F6EDDD] z-[9999]">
      <img
        src={LogoBakti}
        alt="BAKTI UNAND Logo"
        className="w-36 h-auto mb-6 animate-bounce"
      />
      <div
        className="text-[#623B1C] text-4xl font-normal font-['Carena'] text-center"
        style={{
          textShadow: `
            -2px -2px 0 #fff,
            2px -2px 0 #fff,
            -2px 2px 0 #fff,
            2px 2px 0 #fff
          `,
        }}
      >
        Loading{dots}
      </div>
    </div>
  );
};

export default Loading;
