import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Target, BarChart3, Brain, Zap } from 'lucide-react';

const features = [
  {
    icon: Briefcase,
    title: 'Live Interview Mode',
    description: 'HR teams can create AI-powered interviews tailored to job descriptions. Automated screening that saves 15+ hours per candidate.',
    tag: 'For Recruiters',
  },
  {
    icon: GraduationCap,
    title: 'Practice Mode',
    description: 'Upload your resume, select your target role, and get personalized mock interviews targeting your specific skill gaps.',
    tag: 'For Candidates',
  },
  {
    icon: Target,
    title: 'Resume Gap Analysis',
    description: 'AI identifies missing skills and experience gaps, then generates questions designed to help you improve in those areas.',
    tag: 'Personalized',
  },
  {
    icon: BarChart3,
    title: 'Multi-Dimensional Scoring',
    description: 'Evaluate technical accuracy, communication clarity, problem-solving, behavioral responses, and confidence delivery.',
    tag: 'Comprehensive',
  },
  {
    icon: Brain,
    title: 'Adaptive Questions',
    description: 'AI asks intelligent follow-up questions when answers are vague, ensuring deeper evaluation and better learning.',
    tag: 'Smart AI',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get detailed reports with strengths, weaknesses, and actionable recommendations for improvement immediately.',
    tag: 'Real-time',
  },
];

export function Features() {
  return (
    <section className="bg-gray-100 text-black py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl mb-6">Two Modes. Infinite Possibilities.</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're hiring the best talent or becoming the best candidate, 
            our AI adapts to your needs.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative border border-gray-100 rounded-2xl p-8 hover:border-black hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 bg-white"
            >
              <div className="mb-6 flex justify-between items-start">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">{feature.description}</p>
              
              {/* Decorative element */}
              <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-1 bg-black rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
