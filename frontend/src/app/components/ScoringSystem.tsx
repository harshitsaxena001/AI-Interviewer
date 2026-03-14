import { motion } from "motion/react";
import { Target, MessageCircle, Lightbulb, Users, Mic } from "lucide-react";

const scoringDimensions = [
  {
    icon: Target,
    name: "Technical Accuracy",
    weight: "30%",
    description: "Evaluates correctness and depth of technical knowledge",
  },
  {
    icon: MessageCircle,
    name: "Communication",
    weight: "20%",
    description: "Clarity, coherence, and professional expression",
  },
  {
    icon: Lightbulb,
    name: "Problem Solving",
    weight: "20%",
    description: "Logical thinking, creativity, and structured approach",
  },
  {
    icon: Users,
    name: "Behavioral (STAR)",
    weight: "15%",
    description: "Real examples using Situation, Task, Action, Result",
  },
  {
    icon: Mic,
    name: "Confidence & Delivery",
    weight: "15%",
    description: "Response quality, pace, and minimal filler words",
  },
];

const scoreBands = [
  {
    range: "91-100",
    label: "Exceptional",
    color: "bg-gray-900",
    text: "Fast-track to offer",
  },
  {
    range: "76-90",
    label: "Strong",
    color: "bg-gray-700",
    text: "Proceed to next round",
  },
  {
    range: "61-75",
    label: "Good",
    color: "bg-gray-500",
    text: "Keep practicing",
  },
  {
    range: "41-60",
    label: "Needs Work",
    color: "bg-gray-400",
    text: "More practice needed",
  },
  {
    range: "0-40",
    label: "Not Ready",
    color: "bg-gray-300",
    text: "Significant gaps",
  },
];

export function ScoringSystem() {
  return (
    <section className="bg-linear-to-b from-gray-50 to-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl mb-6 text-black">
            Multi-Dimensional Scoring
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI evaluates candidates across 5 critical dimensions for
            comprehensive assessment
          </p>
        </motion.div>

        {/* Scoring Dimensions */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {scoringDimensions.map((dimension, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="group relative h-full rounded-2xl p-8 bg-white border border-gray-100 hover:border-black hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 overflow-hidden"
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8 p-3 rounded-xl bg-gray-50 group-hover:bg-black group-hover:text-white transition-all duration-500 self-start">
                    <dimension.icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-bold mb-4 tracking-tighter text-black group-hover:scale-110 origin-left transition-transform duration-500">
                    {dimension.weight}
                  </div>
                  <h4 className="mb-3 text-lg font-bold uppercase tracking-widest text-black">
                    {dimension.name}
                  </h4>
                  <p className="text-sm text-gray-400 group-hover:text-gray-900 leading-relaxed transition-colors duration-500">
                    {dimension.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Score Bands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl mb-8 text-center text-black">
            Score Interpretation
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {scoreBands.map((band, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`${band.color} rounded-xl p-6 text-white`}
              >
                <div className="text-2xl mb-2">{band.range}</div>
                <div className="mb-2 opacity-90">{band.label}</div>
                <div className="text-sm opacity-75">{band.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
