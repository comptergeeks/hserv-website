"use client";
import React from "react";
import { motion } from "framer-motion";

const transition = { duration: 1, ease: [0.25, 0.1, 0.25, 1] };
const variants = {
  hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
  visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

// Changed to receive props as an object
function TextBlur({ text, styling }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ staggerChildren: 0.04 }}
      className="flex"
    >
      <motion.h1
        transition={transition}
        variants={variants}
        className={styling}
      >
        {text}
      </motion.h1>
    </motion.div>
  );
}

export default TextBlur;
