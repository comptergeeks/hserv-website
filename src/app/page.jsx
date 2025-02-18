"use client";
import { motion } from "framer-motion";
import TextBlur from "./textblur";
import { DM_Sans } from "next/font/google";
import { useState, useEffect } from "react";
import { BarChart } from "./components/BarChart";
import { ChevronRight, ChevronDown } from "lucide-react";
import { LineChart } from "./components/LineChart";

const dmsans = DM_Sans({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
});

const chartdata = [
  {
    year: 1990,
    "Stress Level": 80,
  },
  {
    year: 1995,
    "Stress Level": 85,
  },
  {
    year: 2000,
    "Stress Level": 90,
  },
  {
    year: 2005,
    "Stress Level": 95,
  },
  {
    year: 2010,
    "Stress Level": 100,
  },
  {
    year: 2015,
    "Stress Level": 110,
  },
  {
    year: 2020,
    "Stress Level": 120,
  },
];

export default function Page() {
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pollResults, setPollResults] = useState({
    yes: 0,
    or: 0,
  });

  useEffect(() => {
    fetch("/api/vote")
      .then((res) => res.json())
      .then((data) => setPollResults(data))
      .catch(console.error);
  }, []);

  const pollData = [
    {
      name: "Yes",
      Responses: pollResults.yes,
    },
    {
      name: "No",
      Responses: pollResults.no,
    },
  ];

  const handleVote = async (choice) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ choice }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }

      const results = await response.json();
      setPollResults(results);
      setHasVoted(true);
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
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

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="mb-20">
            <TextBlur
              text="The Affect of Stress on Early Life"
              styling={`text-white inline-block text-transparent bg-clip-text text-center text-2xl md:text-2xl lg:text-6xl ${dmsans.className}`}
            />
          </div>

          <motion.div className="w-full max-w-4xl">
            {!hasVoted ? (
              <div className="space-y-8">
                <TextBlur
                  text="Do you or does anyone you know want to be a parent?"
                  styling={`text-white inline-block text-center text-2xl md:text-3xl ${dmsans.className}`}
                />
                <motion.div
                  className="flex flex-col gap-4 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {["Yes", "No"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleVote(option.toLowerCase())}
                      disabled={isLoading}
                      className={`w-full py-4 px-6 bg-white/10 hover:bg-white/20
                                rounded-lg transition-colors duration-200 text-lg
                                font-medium text-white backdrop-blur-sm ${dmsans.className}
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div className="relative overflow-hidden">
                <motion.div
                  className="flex"
                  animate={{ x: currentSlide * -100 + "%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50 && currentSlide === 0) {
                      setCurrentSlide(1);
                    } else if (info.offset.x > 50 && currentSlide === 1) {
                      setCurrentSlide(0);
                    }
                  }}
                >
                  <div className="min-w-full">
                    <TextBlur
                      text="Poll Results"
                      styling={`text-white inline-block text-center text-2xl md:text-3xl ${dmsans.className} mb-8`}
                    />
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                      <BarChart
                        className="h-72"
                        data={pollData}
                        index="name"
                        categories={["Responses"]}
                        yAxisWidth={45}
                      />
                    </div>
                    {currentSlide === 0 && (
                      <motion.div
                        className="absolute bottom-0 right-8 text-white flex items-center gap-2"
                        animate={{
                          x: [0, 10, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {" "}
                        <span className="text-sm">Swipe to learn more</span>
                        <ChevronRight className="w-6 h-6" />
                      </motion.div>
                    )}
                  </div>

                  <div className="min-w-full px-6">
                    <div className="flex items-center justify-center h-full">
                      <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm max-w-2xl">
                        <TextBlur
                          text="Critical Early Development"
                          styling={`text-white text-3xl font-bold mb-4 ${dmsans.className}`}
                        />
                        <p
                          className={`text-white/90 text-lg leading-relaxed ${dmsans.className}`}
                        >
                          Research shows that the period from pre-birth to age 5
                          is crucial for child development. During these
                          formative years, the foundation for all future
                          learning, behavior, and health is established, making
                          it one of the most critical periods in human
                          development.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {[0, 1].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentSlide === idx ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {hasVoted && currentSlide === 1 && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-6 h-6 text-white" />
              <ChevronDown className="w-6 h-6 text-white -mt-4" />
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        className="bg-white min-h-screen w-full py-20 px-6 md:px-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-4xl font-bold text-black mb-8 ${dmsans.className}`}
          >
            The Impact of Early Life Stress
          </h2>

          <div className="prose max-w-none">
            <p className={`text-lg text-gray-700 mb-8 ${dmsans.className}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h1>Stress Levels Over Time</h1>
              <p>Measured in relative stress units (RSU)</p>
              <LineChart
                className="mt-6"
                data={chartdata}
                index="year"
                categories={["Stress Level"]}
                colors={["blue"]}
                yAxisWidth={40}
                height="h-80"
              />
            </div>

            <p className={`text-lg text-gray-700 mb-8 ${dmsans.className}`}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>

            <h3
              className={`text-2xl font-bold text-black mb-4 ${dmsans.className}`}
            >
              Long-term Effects
            </h3>

            <p className={`text-lg text-gray-700 mb-8 ${dmsans.className}`}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
