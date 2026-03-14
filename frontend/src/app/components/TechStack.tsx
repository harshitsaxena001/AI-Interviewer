import { motion } from 'motion/react';
import { Database, Cpu, Zap, Lock } from 'lucide-react';

const techFeatures = [
  {
    icon: Cpu,
    title: 'Powered by Gemini & Groq',
    description: 'State-of-the-art LLMs for question generation and answer evaluation',
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Instant feedback with WebSocket connections and async processing',
  },
  {
    icon: Database,
    title: 'Enterprise Ready',
    description: 'PostgreSQL database with Redis caching for production scale',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'JWT authentication, encrypted storage, and GDPR compliant',
  },
];

export function TechStack() {
  return (
    <section className="bg-black text-white py-24 px-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl mb-6">Built for Performance</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Modern tech stack designed for speed, reliability, and scalability
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {techFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm"
            >
              <feature.icon className="w-10 h-10 mb-4" />
              <h4 className="text-xl mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Tech logos/names */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-sm"
        >
          <p className="text-gray-500 text-sm mb-6 text-center">POWERED BY</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {[
              'React',
              'FastAPI',
              'Gemini AI',
              'Groq',
              'PostgreSQL',
              'Redis',
              'Whisper',
              'spaCy',
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="text-center"
              >
                <div className="text-lg text-gray-400 hover:text-white transition-colors">
                  {tech}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
