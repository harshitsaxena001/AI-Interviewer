import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  Trophy,
  X,
  Upload,
  FileText,
  Target,
  Sparkles,
  Zap,
  Brain,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { InterviewSession } from "./InterviewSession";

type UserRole = "hr" | "candidate";

interface HistoryItem {
  id: string;
  title: string;
  role: string;
  date: string;
  score: number;
  status: "completed" | "in-review" | "failed";
  duration: string;
  aiInsight: string;
  strengths: string[];
  weaknesses: string[];
  overallPerformance: string;
}

// Mock Data for Charts
const SKILL_DATA = [
  { subject: "Communication", A: 0, fullMark: 100 },
  { subject: "Confidence", A: 0, fullMark: 100 },
  { subject: "Technical", A: 0, fullMark: 100 },
  { subject: "Response Time", A: 0, fullMark: 100 },
];

const TREND_DATA = [
  { name: "Mon", score: 0 },
  { name: "Tue", score: 0 },
  { name: "Wed", score: 0 },
  { name: "Thu", score: 0 },
  { name: "Fri", score: 0 },
  { name: "Sat", score: 0 },
  { name: "Sun", score: 0 },
];

const CANDIDATE_HISTORY: HistoryItem[] = [];

export function Dashboard({
  role: initialRole,
  userName,
}: {
  role?: UserRole;
  userName?: string;
}) {
  const [role, setRole] = useState<UserRole>(initialRole || "candidate");
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const startInterview = () => {
    setShowUploadModal(false);
    setIsInterviewActive(true);
  };

  if (isInterviewActive) {
    return <InterviewSession onExit={() => setIsInterviewActive(false)} />;
  }

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-white/20">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside className="w-20 lg:w-72 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col sticky top-0 h-screen z-40">
        <div className="p-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5 shrink-0">
            <Zap className="text-black fill-black" size={18} />
          </div>
          <span className="font-black text-lg tracking-tight text-white hidden lg:block uppercase">
            Interview AI
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <SidebarLink
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SidebarLink
            icon={<History size={20} />}
            label="Prev. Interviews"
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          />
        </nav>

        <div className="p-6 border-t border-white/10 space-y-1">
          <SidebarLink icon={<Settings size={20} />} label="Settings" />
          <SidebarLink
            icon={<LogOut size={20} />}
            label="Logout"
            onClick={() => (window.location.href = "/")}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 lg:px-12 py-10 overflow-y-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back, {userName || "Candidate"}
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Monitor your progress and refine your skills.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-white text-black hover:bg-gray-200 rounded-xl font-bold px-6 h-12 flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-white/5"
            >
              <Plus size={18} />
              New Interview
            </Button>
            <div className="h-12 w-12 rounded-full border border-white/20 shadow-sm bg-white/10 hidden sm:flex items-center justify-center text-white font-bold text-lg">
              {userName ? userName.charAt(0).toUpperCase() : "C"}
            </div>
          </div>
        </header>

        {activeTab === "overview" ? (
          <div className="space-y-8">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              <QuickStat
                label="Interviews"
                value="0"
                icon={<MessageSquare className="text-blue-400" size={18} />}
                trend="Total sessions"
                bgColor="bg-blue-500/10"
              />
              <CircularStat label="Avg Score" value={0} />
              <CircularStat label="Accuracy" value={0} />
              <CircularStat label="Readiness" value={0} />
            </div>

            {/* Skill Radar + Performance Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-8">
                <CardHeader className="px-0 pt-0 border-none">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                    <Activity size={20} className="text-gray-400" />
                    Skill Multi-Dimension
                  </CardTitle>
                </CardHeader>
                <div className="h-[300px] w-full mt-4 text-white">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={SKILL_DATA}
                    >
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: "#9ca3af",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#fff"
                        fill="#fff"
                        fillOpacity={0.1}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-8">
                <CardHeader className="px-0 pt-0 border-none">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                    <TrendingUp size={20} className="text-gray-400" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={TREND_DATA}
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        padding={{ left: 20, right: 20 }}
                        tick={{
                          fill: "#9ca3af",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                        dy={10}
                      />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(0,0,0,0.8)",
                          color: "#fff",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#fff"
                        strokeWidth={4}
                        dot={{
                          r: 4,
                          fill: "#fff",
                          strokeWidth: 2,
                          stroke: "#000",
                        }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Strengths/Weaknesses + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent Interviews</h2>
                  <Button
                    variant="outline"
                    className="text-[10px] font-bold text-gray-400 border-white/10 uppercase tracking-widest hover:text-white hover:bg-white/10 rounded-xl h-8 px-3"
                    onClick={() => setActiveTab("history")}
                  >
                    View All <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {CANDIDATE_HISTORY.length > 0 ? (
                    CANDIDATE_HISTORY.map((item) => (
                      <HistoryCard key={item.id} item={item} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-dashed border-white/20">
                      <p className="font-bold text-gray-400">
                        No recent activity
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border border-white/10 bg-white/5 backdrop-blur-md text-white p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl shadow-black/10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all duration-700" />
                  <div className="relative z-10 space-y-4 text-center py-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
                      <Sparkles className="text-white" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold leading-tight">
                      Ready to excel?
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-medium px-4">
                      Start a mock session now to see your latest performance
                      analysis.
                    </p>
                    <Button
                      onClick={() => setShowUploadModal(true)}
                      className="w-full bg-white text-black hover:bg-gray-200 rounded-2xl h-14 font-bold text-sm transition-transform active:scale-95 mt-4"
                    >
                      Start Mock Interview
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Interview Library</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Deep dive into your past performances.
                </p>
              </div>
              {CANDIDATE_HISTORY.length > 0 && (
                <Button
                  variant="outline"
                  className="rounded-xl font-bold text-xs h-10 px-4 border-white/10 hover:bg-white/10 hover:text-white text-gray-400"
                >
                  Export Reports
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {CANDIDATE_HISTORY.length > 0 ? (
                CANDIDATE_HISTORY.map((item) => (
                  <HistoryCard key={item.id} item={item} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-3xl border border-dashed border-white/20 space-y-4 text-white">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <Search size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">Your library is empty</p>
                    <p className="text-sm text-gray-400 font-medium mt-1">
                      Upload a resume and start practicing to build your
                      library.
                    </p>
                    <Button
                      onClick={() => {
                        setActiveTab("overview");
                        setShowUploadModal(true);
                      }}
                      className="mt-6 bg-white text-black hover:bg-gray-200 rounded-xl px-6 font-bold"
                    >
                      Start First Interview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Upload/Interview Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-xl bg-black/90 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl"
            >
              <div className="p-10 md:p-12 text-white">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight">
                      Setup Session
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">
                      Let's prepare your interview environment
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                      1. Job Role or Description
                    </label>
                    <Textarea
                      placeholder="e.g. Senior Backend Architect at Netflix"
                      className="min-h-[140px] bg-white/5 border border-white/10 rounded-2xl p-5 focus-visible:ring-white/20 focus-visible:ring-1 resize-none text-sm placeholder:text-gray-600 transition-all font-medium text-white"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                      2. Resume (.pdf)
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        selectedFile
                          ? "border-green-500/50 bg-green-500/5"
                          : "border-white/20 hover:border-white/40 hover:bg-white/5"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf"
                      />
                      {selectedFile ? (
                        <div className="flex items-center gap-4">
                          <FileText className="text-green-400" size={24} />
                          <div className="text-left">
                            <p className="font-bold text-white text-sm truncate max-w-[200px]">
                              {selectedFile.name}
                            </p>
                            <p className="text-[10px] text-green-400/80 font-bold">
                              READY
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Upload className="text-gray-400" size={20} />
                          <span className="text-sm font-bold text-gray-400">
                            Select File
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      disabled={!selectedFile || !jobDescription}
                      onClick={startInterview}
                      className="flex-1 h-14 bg-white hover:bg-gray-200 text-black rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 group transition-all"
                    >
                      Launch Simulation
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Specialized Helper Components ---

function CircularStat({
  label,
  value,
  subtext,
  category,
}: {
  label: string;
  value: number;
  subtext?: string;
  category?: string;
}) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <Card className="border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-6 transition-transform hover:-translate-y-1 duration-300 flex flex-col items-center justify-center overflow-hidden relative">
      <div className="relative w-24 h-24 flex items-center justify-center mb-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${circumference} ${circumference}`}
            fill="transparent"
            className="text-white/10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="white"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 text-white">
          <span className="text-2xl font-black tracking-tighter leading-none">
            {value}%
          </span>
          <span className="text-[7px] font-black text-gray-400 tracking-[0.2em] uppercase mt-1 leading-none">
            {category}
          </span>
        </div>
      </div>
      <div className="text-center mt-2 flex flex-col items-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">
          {label}
        </p>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-tighter leading-none">
          {subtext}
        </p>
      </div>
    </Card>
  );
}

function SidebarLink({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-white/10 text-white shadow-lg shadow-black/5"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div
        className={`${active ? "text-white" : "group-hover:text-white opacity-70 group-hover:opacity-100"}`}
      >
        {icon}
      </div>
      <span
        className={`font-bold text-sm hidden lg:block ${active ? "text-white" : ""}`}
      >
        {label}
      </span>
    </button>
  );
}

function QuickStat({
  label,
  value,
  icon,
  trend,
  bgColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  bgColor: string;
}) {
  return (
    <Card className="border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-6 transition-transform hover:-translate-y-1 duration-300">
      <div className="flex items-start justify-between text-white">
        <div className="space-y-3">
          <div
            className={`${bgColor} w-9 h-9 rounded-xl flex items-center justify-center bg-opacity-20 backdrop-blur-sm`}
          >
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">
              {label}
            </p>
            <h3 className="text-2xl font-bold tracking-tighter">{value}</h3>
          </div>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
            {trend}
          </p>
        </div>
      </div>
    </Card>
  );
}

function HistoryCard({ item }: { item: HistoryItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border border-white/10 shadow-sm rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden transition-all hover:bg-white/10">
      <div
        className="p-5 flex items-center justify-between cursor-pointer group text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 group-hover:text-white transition-all">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="font-bold group-hover:text-gray-200 transition-colors">
              {item.title}
            </h4>
            <p className="text-xs text-gray-400 font-medium">
              {item.role} • {item.date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right hidden sm:block">
            <Badge
              variant="outline"
              className="rounded-lg px-2.5 py-1 font-black text-xs border-green-500/20 bg-green-500/10 text-green-400"
            >
              SCORE: {item.score}%
            </Badge>
          </div>
          <ChevronRight
            size={18}
            className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-black/20 overflow-hidden"
          >
            <div className="p-8 space-y-8 text-white">
              {/* Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-gray-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Overall Performance
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed font-medium bg-white/5 p-5 rounded-2xl border border-white/10">
                    {item.overallPerformance}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      AI Summary
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed font-medium bg-white/5 p-5 rounded-2xl border border-white/10 italic">
                    "{item.aiInsight}"
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Key Strengths
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.strengths.map((s, i) => (
                      <Badge
                        key={i}
                        className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1.5 rounded-lg text-xs font-bold ring-1 ring-emerald-500/20"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Growth Areas
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.weaknesses.map((w, i) => (
                      <Badge
                        key={i}
                        className="bg-amber-500/10 text-amber-400 border-none px-3 py-1.5 rounded-lg text-xs font-bold ring-1 ring-amber-500/20"
                      >
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <Button className="rounded-xl h-12 px-8 font-bold text-sm bg-white text-black hover:bg-gray-200">
                  Full Interview Replay
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
