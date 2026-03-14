import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-white text-xl">
            AI Interviewer
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
          </div>
          
          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="px-6 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-lg">
              Get Started
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 pb-2 border-t border-white/10 mt-4"
          >
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors py-2">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors py-2">
                Pricing
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors py-2">
                About
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <button className="text-left text-gray-300 hover:text-white transition-colors py-2">
                  Sign In
                </button>
                <button className="px-6 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-lg">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
