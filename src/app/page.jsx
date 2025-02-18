"use client"; // Add this at the top

import { motion } from "framer-motion";
import TextBlur from "./textblur";
import { DM_Sans } from "next/font/google";

const dmsans = DM_Sans({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  // Changed from Home to Page
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 min-h-full min-w-full object-cover opacity-60"
      >
        <source src="/looping-bear.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Content Overlay */}
      <div className="relative z-10 flex h-screen items-center justify-center">
        <TextBlur
          text="The Affect of Stress on Early Life"
          styling={`
          text-white inline-block text-transparent bg-clip-text text-center text-6xl md:text-8xl lg:text-3xl
          ${dmsans.className} `}
        />
      </div>
    </div>
  );
}
