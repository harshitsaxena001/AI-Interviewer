import { motion } from 'motion/react';
import { ArrowRight, Calendar, Mail } from 'lucide-react';

export function CTA() {
  return (
    <section className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-32 px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl mb-6">
            Ready to Transform Your Interviews?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of companies and candidates already using AI-powered interview intelligence
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-white text-black hover:bg-gray-200 transition-colors rounded-lg flex items-center justify-center gap-2 group">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-white/20 hover:bg-white/5 transition-colors rounded-lg flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Demo
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Free tier available
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Setup in 5 minutes
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
