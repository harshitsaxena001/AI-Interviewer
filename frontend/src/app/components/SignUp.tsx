import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  CheckCircle2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export function SignUp() {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center p-4 md:p-6 font-sans overflow-hidden">
      <div className="max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[720px]">
        {/* Left Side - Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-black flex items-center justify-center rounded-xl">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="font-bold text-xl tracking-tight">
                AI Interviewer
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-1">Create an account</h1>
            <p className="text-gray-500 text-sm">
              Start your journey for free today
            </p>
          </motion.div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-12 h-11 bg-gray-50 border-none rounded-xl focus-visible:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  className="pl-12 h-11 bg-gray-50 border-none rounded-xl focus-visible:ring-black"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-11 bg-gray-50 border-none rounded-xl focus-visible:ring-black"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-1">
              <Checkbox
                id="terms"
                className="rounded-md border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <label
                htmlFor="terms"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
              >
                I agree to the{" "}
                <a href="#" className="text-black hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-black hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button className="w-full h-11 bg-[#1a1a1a] hover:bg-black text-white rounded-xl text-base font-semibold transition-all duration-300 shadow-sm">
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center md:text-left">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-black font-semibold hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Branding/Info Section (Same as SignIn) */}
        <div className="hidden md:flex w-1/2 bg-black m-3 rounded-[1.8rem] relative overflow-hidden flex-col p-10 text-white">
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] border-[1px] border-white/20 rounded-full rotate-45" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] border-[1px] border-white/10 rounded-full" />
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/5 blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-12">
              {/* Large Stylized Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-16 h-16 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/5 rounded-2xl rotate-12 backdrop-blur-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white rounded-lg rotate-45 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
              </motion.div>
              <div className="mt-4">
                <span className="text-xl font-semibold opacity-90 tracking-wide">
                  AI Interviewer
                </span>
              </div>
            </div>

            <div className="flex-grow">
              <h2 className="text-4xl font-bold mb-8 leading-tight">
                Master your next interview.
              </h2>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-[95%] font-medium">
                The all-in-one AI platform for technical hiring and preparation.
              </p>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">
                      For Candidates
                    </h4>
                    <p className="text-gray-500 text-sm mt-1">
                      Practice mock interviews and get hired 3x faster with
                      real-time feedback.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-tight">
                      For Team & HR
                    </h4>
                    <p className="text-gray-500 text-sm mt-1">
                      Automate technical screenings and filter top 1% talent
                      effortlessly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-8">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-bold text-gray-300">
                  Helping candidates prepare and teams hire smarter
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
