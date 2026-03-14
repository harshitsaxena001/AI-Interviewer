import { motion } from "motion/react";
import { Building2, User, TrendingUp, Award } from "lucide-react";

const useCases = [
  {
    icon: Building2,
    audience: "Startups & SMBs",
    benefit: "Screen candidates 24/7 without dedicated HR",
    stats: "Save $50K+ annually on recruiting costs",
  },
  {
    icon: TrendingUp,
    audience: "Enterprise Teams",
    benefit: "Scale hiring without compromising quality",
    stats: "Process 10x more candidates in same time",
  },
  {
    icon: User,
    audience: "Job Seekers",
    benefit: "Practice for your dream role with personalized feedback",
    stats: "Improve interview scores by 40% average",
  },
  {
    icon: Award,
    audience: "Bootcamps & Schools",
    benefit: "Prepare students with real interview simulations",
    stats: "Increase placement rates by 35%",
  },
];

export function UseCases() {
  return (
    <section className="bg-white text-black py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl mb-6">Who Benefits?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From Fortune 500 companies to individual job seekers, everyone wins
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative border border-gray-100 rounded-4xl p-10 hover:border-black hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 bg-white"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <useCase.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-semibold tracking-tight">
                    {useCase.audience}
                  </h3>
                  <p className="text-gray-500 text-lg group-hover:text-black transition-colors">
                    {useCase.benefit}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-gray-100 group-hover:border-black transition-colors duration-500">
                <div className="p-1 rounded-full bg-green-500/10 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-black">
                  {useCase.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Problem statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gray-100 rounded-2xl p-12 text-center"
        >
          <h2 className="text-5xl md:text-6xl mb-6">The Problem We Solve</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div>
              <div className="text-5xl md:text-6xl mb-3">15+ hrs</div>
              <p className="text-gray-600 font-medium">
                Wasted per candidate in traditional screening
              </p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl mb-3">75%</div>
              <p className="text-gray-600 font-medium">
                Of candidates receive no feedback on interviews
              </p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl mb-3">$4.1K</div>
              <p className="text-gray-600 font-medium">
                Average cost per bad hire to companies
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
