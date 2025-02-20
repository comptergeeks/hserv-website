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
          <source src="/pregnancy-loop.mp4" type="video/mp4" />
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
            Well Being in First Years of Life
          </h2>

          <div className="prose max-w-none">
            <p className={`text-lg text-gray-700 mb-8 ${dmsans.className}`}>
              While the term of a baby's growth between conception to pregnancy
              is very important, there are also clearly other factors within the
              first years of life that make the biggest difference on how
              children's lives can shape out. Generally, the first 1000 days of
              a child's life are when 80% of their cognitive brain is developed.
              Thus, it is proven that everything you pick up and learn at this
              stage of life is extremely important.
            </p>

            <p
              className={`text-center text-xl font-bold italic mb-8  text-black ${dmsans.className}`}
            >
              "It is easier to build strong children than to repair broken men."
              <br />- Frederick Douglass (1817–1895)
            </p>

            <div className="pt-6 rounded-lg mb-8">
              <div className=" mb-3">
                <h3
                  className={`text-2xl font-semibold mb-2 ${dmsans.className}`}
                >
                  <span className="text-gray-900">
                    Have you had an adverse child experience?{" "}
                  </span>
                  <span className="text-red-400">
                    How will we break this cycle?
                  </span>
                </h3>
              </div>
            </div>

            <p className={`text-lg text-gray-700 mb-6 ${dmsans.className}`}>
              Adverse child experiences are traumatic experiences that can
              include, but aren't limited to, emotional or physical neglect,
              violence or abuse, or substance abuse. Not all Adverse child
              experiences were preventable by parents due to wealth
              inequalities, unfair situations, or parental abuse, however of
              course, some are!
            </p>

            <p className={`text-lg text-gray-700 mb-8 ${dmsans.className}`}>
              Although genes and mothers' stress determines the blueprint for a
              baby, the environment determines what outcome this holds.
            </p>

            <div className="flex flex-col items-center justify-center aspect-video rounded-lg mb-8 overflow-hidden">
              <img
                src="/imgs/adverse-experiences.png"
                alt="Placeholder for child development illustration"
                className="w-4/5 h-4/5 object-cover self-center rounded-lg"
              />
            </div>

            <p className={`text-lg text-gray-700 mb-8 ${dmsans.className}`}>
              In study, the correlation between having adverse child experiences
              versus not, is very drastic. There are higher rates of smoking,
              alcohol abuse, suicide attempt, marriage issues, and even job
              problems (The Lifelong Effects of Adverse Childhood Experiences,
              Felliti et al). The study concluded that in these events happening
              during childhood, time does not heal. Instead, time alone can only
              conceal and push unnecessary resilience.
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="flex-1 bg-gray-100 rounded-lg overflow-auto">
                <img
                  src="/imgs/adult-alcohol.png"
                  alt="Graph 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg overflow-auto">
                <img
                  src="/imgs/adult-smoking.png"
                  alt="Graph 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h3
              className={`text-2xl font-bold text-black pr-3 pb-3 ${dmsans.className}`}
            >
              How does this relate to{" "}
              <span className="text-red-400"> YOU? </span>
            </h3>

            <div className="space-y-6">
              <p className={`text-lg text-gray-700 ${dmsans.className}`}>
                While you may not be planning on being a parent just yet, it's
                good to be educated on what having a child means and how much
                our lives make theirs. This, as well as learning to manage
                stress, so as to not push it on to future children with these
                habits learned today.
              </p>

              <p className={`text-lg text-gray-700 ${dmsans.className}`}>
                Even if you never plan on having children, information such as
                this can help you reflect on your own life. If you have had
                adverse childhood experiences or even if you haven't and are
                struggling, it can be noted to ask for help when you need it.
                While there is not nearly enough support and equality to
                eliminate this, if you attend the University of Washington, some
                resources include:
              </p>

              <ul className="space-y-3 pl-6 list-disc">
                <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                  Husky HelpLine: 206-616-7777 or online chat
                </li>
                <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                  LiveWell Confidential advocates
                </li>
                <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                  UW counseling center
                </li>
                <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                  Husky health
                </li>
              </ul>

              <p className={`text-lg text-gray-700 ${dmsans.className}`}>
                For the future, or maybe present for you, the child you have
                needs to be loved and cared for regardless of who they turn out
                to be. Children are a big responsibility, and although they may
                nor remember the first years of their life, it will deeply
                affect the rest of theirs.
              </p>
            </div>

            <div className="mt-12">
              <h2
                className={`text-4xl font-bold text-black mb-8 ${dmsans.className}`}
              >
                How Early Life Stress Shapes Attachment and Relationships
              </h2>

              <div className="flex flex-col items-center justify-center aspect-video rounded-lg mb-8 overflow-hidden">
                <img
                  src="/imgs/baby_mom.png"
                  alt="Early life stress and relationships illustration"
                  className="w-4/5 h-4/5 object-cover self-center rounded-lg"
                />
              </div>

              <p className={`text-lg text-gray-700 mb-8 ${dmsans.className}`}>
                During the first few years of life, children move through
                different
                <span className="font-bold"> stages of attachment </span>
                as they begin to recognize caregivers, seek comfort, and develop
                trust in the world around them. When caregivers respond
                consistently and lovingly, children form a
                <span className="font-bold"> secure attachment</span>, feeling
                safe to explore and connect with others. However, when a child
                experiences neglect, unpredictability, or trauma, different
                <span className="font-bold"> insecure attachment styles </span>
                may emerge.
              </p>

              <h3
                className={`text-2xl font-bold text-black pr-3 pb-3 ${dmsans.className}`}
              >
                Understanding Attachment Styles
              </h3>

              <div className="flex flex-col items-center justify-center aspect-video rounded-lg mb-8 overflow-hidden">
                <img
                  src="/imgs/attachment-styles.png"
                  alt="Attachment styles illustration"
                  className="w-4/5 h-4/5 object-cover self-center rounded-lg"
                />
              </div>

              <div className="space-y-8 mb-8">
                <div>
                  <h4
                    className={`text-xl font-bold text-black mb-3 ${dmsans.className}`}
                  >
                    1. Secure Attachment: A Strong Foundation
                  </h4>
                  <ul className="space-y-2 pl-6 list-disc">
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      Formed when caregivers are consistently responsive and
                      loving.
                    </li>
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      Children feel safe exploring the world, knowing they have
                      a reliable source of comfort.
                    </li>
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      As adults, they tend to build healthy, trusting
                      relationships and manage emotions well.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4
                    className={`text-xl font-bold text-black mb-3 ${dmsans.className}`}
                  >
                    2. Avoidant Attachment: Independence at a Cost
                  </h4>
                  <ul className="space-y-2 pl-6 list-disc">
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      Develops when caregivers are emotionally distant or
                      dismissive of a child's needs.
                    </li>
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      Children learn to rely on themselves, suppressing emotions
                      rather than seeking comfort.
                    </li>
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      This can lead to difficulty expressing feelings and
                      forming close bonds later in life.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4
                    className={`text-xl font-bold text-black mb-3 ${dmsans.className}`}
                  >
                    3. Anxious (Ambivalent) Attachment: Seeking Reassurance
                  </h4>
                  <ul className="space-y-2 pl-6 list-disc">
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      Stems from inconsistent caregiving—sometimes present,
                      sometimes absent.
                    </li>
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      Children may become overly clingy, fearing rejection and
                      craving reassurance.
                    </li>
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      As adults, they might struggle with self-doubt and anxiety
                      in relationships.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4
                    className={`text-xl font-bold text-black mb-3 ${dmsans.className}`}
                  >
                    4. Disorganized Attachment: Fear and Confusion
                  </h4>
                  <ul className="space-y-2 pl-6 list-disc">
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      Often linked to trauma, neglect, or caregivers who are
                      both a source of comfort and fear.
                    </li>
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      Children may show unpredictable behaviors, struggling to
                      feel safe.
                    </li>
                    <li className={`text-lg text-gray-700 ${dmsans.className}`}>
                      This can lead to challenges in emotional regulation and
                      trust as they grow.
                    </li>
                  </ul>
                </div>
              </div>

              <h3
                className={`text-2xl font-bold text-black pr-3 pb-3 ${dmsans.className}`}
              >
                Why It Matters
              </h3>

              <div className="space-y-6 mb-8">
                <p className={`text-lg text-gray-700 ${dmsans.className}`}>
                  Our first relationships shape how we navigate love, trust, and
                  emotional resilience. By understanding attachment styles, we
                  can recognize patterns, heal from early stress, and create
                  stronger, more secure connections for ourselves and future
                  generations. Attachment styles don't just affect childhood,
                  they shape our
                  <span className="font-bold">
                    {" "}
                    relationships, emotional health, and coping skills{" "}
                  </span>
                  throughout life. For those who have experienced adversity,
                  understanding these patterns is the first step in healing and
                  building more secure connections.
                </p>

                <p className={`text-lg text-gray-700 ${dmsans.className}`}>
                  Even if you never plan on having children, this knowledge
                  helps you reflect on your own experiences. If you have
                  struggled with the effects of early life stress, know that
                  <span className="font-bold"> healing is possible</span>.
                  Seeking support, learning about attachment, and breaking
                  unhealthy cycles can help create a better future, for yourself
                  and those around you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
