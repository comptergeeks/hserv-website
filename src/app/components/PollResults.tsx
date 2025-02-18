import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart } from "../components/BarChart";

const PollAndChart = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const [pollResults, setPollResults] = useState({
    yes: 65,
    or: 25,
  });

  const pollData = [
    {
      name: "Yes",
      Responses: pollResults.yes,
    },
    {
      name: "Or",
      Responses: pollResults.or,
    },
  ];

  const handleVote = (choice: any) => {
    // Here you would typically make an API call to save the vote
    setHasVoted(true);
  };

  // Calculate total responses properly
  const totalResponses = pollResults.yes + pollResults.or;
  console.log("total response " + totalResponses);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {!hasVoted ? (
          <motion.div
            key="poll"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
              Do you or anyone you know want to be a parent?
            </h2>
            <div className="flex flex-col gap-4">
              {["Yes", "Or"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleVote(option.toLowerCase())}
                  className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 rounded-lg
                            transition-colors duration-200 text-lg font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              Poll Results
            </h2>
            <BarChart
              className="h-72"
              data={pollData}
              index="name"
              categories={["Responses"]}
              yAxisWidth={45}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-white mt-4"
            >
              Based on {totalResponses} responses
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PollAndChart;
