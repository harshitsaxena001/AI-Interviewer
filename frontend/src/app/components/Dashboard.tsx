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
  { subject: "Communication", A: 85, fullMark: 100 },
  { subject: "Confidence", A: 78, fullMark: 100 },
  { subject: "Technical", A: 92, fullMark: 100 },
  { subject: "Response Time", A: 70, fullMark: 100 },
];

const TREND_DATA = [
  { name: "Mon", score: 65 },
  { name: "Tue", score: 72 },
  { name: "Wed", score: 68 },
  { name: "Thu", score: 85 },
  { name: "Fri", score: 82 },
  { name: "Sat", score: 91 },
  { name: "Sun", score: 88 },
];

const CANDIDATE_HISTORY: HistoryItem[] = [
  {
    id: "1",
    title: "Google Mock Session",
    role: "Senior Frontend Engineer",
    date: "12 Mar 2026",
    score: 88,
    status: "completed",
    duration: "45 mins",
    aiInsight: "Excellent grasp of system design principles.",
    overallPerformance:
      "The candidate demonstrated high proficiency in React and architectural patterns.",
    strengths: ["React Hooks", "System Design", "Problem Solving"],
    weaknesses: ["Unit Testing", "Performance Optimization"],
  },
];

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
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] font-sans selection:bg-black/5">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 border-r border-border/50 bg-white flex flex-col sticky top-0 h-screen z-40">
        <div className="p-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/10 shrink-0">
            <Zap className="text-white fill-white" size={18} />
          </div>
          <span className="font-black text-lg tracking-tight text-foreground hidden lg:block uppercase">
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

        <div className="p-6 border-t border-border/50 space-y-1">
          <SidebarLink icon={<Settings size={20} />} label="Settings" />
          <SidebarLink
            icon={<LogOut size={20} />}
            label="Logout"
            onClick={() => (window.location.href = "/")}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 lg:px-12 py-10 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Welcome back, {userName || "Adrian"}
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Monitor your progress and refine your skills.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-black transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-9 pr-4 py-2 bg-white border border-border/60 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all font-medium"
              />
            </div>
            <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {(userName || "Adrian").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {activeTab === "overview" ? (
          <div className="space-y-8">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
              <QuickStat
                label="Interviews"
                value="12"
                icon={<MessageSquare className="text-blue-600" size={18} />}
                trend="Total sessions"
                bgColor="bg-blue-50"
              />
              <CircularStat
                label="Avg Score"
                value={84}
                subtext="Top 10% percentile"
                category="PERCENTILE"
              />
              <CircularStat
                label="Accuracy"
                value={91}
                subtext="Improving steadily"
                category="SUCCESS"
              />
              <CircularStat
                label="Readiness"
                value={88}
                subtext="Role: Sr. Frontend"
                category="READINESS"
              />
            </div>

            {/* Skill Radar + Performance Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
                <CardHeader className="px-0 pt-0 border-none">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Activity size={20} className="text-black" />
                    Skill Multi-Dimension
                  </CardTitle>
                </CardHeader>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={SKILL_DATA}
                    >
                      <PolarGrid stroke="#f1f1f1" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: "#94a3b8",
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
                        stroke="#000"
                        fill="#000"
                        fillOpacity={0.05}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
                <CardHeader className="px-0 pt-0 border-none">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp size={20} className="text-black" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TREND_DATA}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f1f1"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                        dy={10}
                      />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#000"
                        strokeWidth={4}
                        dot={{
                          r: 4,
                          fill: "#000",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Strengths/Weaknesses + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent Interviews</h2>
                  <Button
                    variant="outline"
                    className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-black rounded-xl h-8 px-3"
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
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border/60">
                      <p className="font-bold text-foreground">
                        No recent activity
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-none bg-black text-white p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl shadow-black/10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all duration-700" />
                  <div className="relative z-10 space-y-4 text-center py-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <Sparkles className="text-white" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold leading-tight">
                      Ready to excel?
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed font-medium px-4">
                      Start a mock session now to see your latest performance
                      analysis.
                    </p>
                    <Button
                      onClick={() => setShowUploadModal(true)}
                      className="w-full bg-white text-black hover:bg-white/90 rounded-2xl h-14 font-bold text-sm transition-transform active:scale-95 mt-4"
                    >
                      Start Mock Interview
                    </Button>
                  </div>
                </Card>

                {/* Growth Summary View */}
                <Card className="border-none shadow-sm rounded-3xl bg-white p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Quick Insights
                  </h3>
                  <div className="space-y-4 pt-2">
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Strong: Logical Reasoning
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          Consistent 90%+ in high-pressure scenarios.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                        <AlertTriangle size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Weak: System Design Depth
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          Needs focus on scalability edge cases.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Interview Library</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Deep dive into your past performances.
                </p>
              </div>
              {CANDIDATE_HISTORY.length > 0 && (
                <Button
                  variant="outline"
                  className="rounded-xl font-bold text-xs h-10 px-4"
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
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-border/60 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                    <Search size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">
                      Your library is empty
                    </p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      Upload a resume and start practicing to build your
                      library.
                    </p>
                    <Button
                      onClick={() => {
                        setActiveTab("overview");
                        setShowUploadModal(true);
                      }}
                      className="mt-6 bg-black text-white hover:bg-black/90 rounded-xl px-6"
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
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/40"
            >
              <div className="p-10 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-foreground tracking-tight">
                      Setup Session
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                      Let's prepare your interview environment
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      1. Job Role or Description
                    </label>
                    <Textarea
                      placeholder="e.g. Senior Backend Architect at Netflix"
                      className="min-h-[140px] bg-secondary/30 border-none rounded-2xl p-5 focus-visible:ring-black/10 focus-visible:ring-1 resize-none text-sm placeholder:text-muted-foreground/50 transition-all font-medium"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                      2. Resume (.pdf)
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        selectedFile
                          ? "border-black bg-black/5"
                          : "border-border/60 hover:border-black/20 hover:bg-muted/30"
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
                          <FileText className="text-black" size={24} />
                          <div className="text-left">
                            <p className="font-bold text-foreground text-sm truncate max-w-[200px]">
                              {selectedFile.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-bold">
                              READY
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Upload className="text-muted-foreground" size={20} />
                          <span className="text-sm font-bold text-muted-foreground">
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
                      className="flex-1 h-14 bg-black hover:bg-black/90 text-white rounded-2xl font-bold shadow-xl shadow-black/10 flex items-center justify-center gap-2 group transition-all"
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
  subtext: string;
  category: string;
}) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <Card className="border-none shadow-sm rounded-3xl bg-white p-6 transition-transform hover:-translate-y-1 duration-300 flex flex-col items-center justify-center overflow-hidden relative">
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
            className="text-muted/10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="black"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
          <span className="text-2xl font-black tracking-tighter leading-none text-foreground">
            {value}%
          </span>
          <span className="text-[7px] font-black text-muted-foreground tracking-[0.2em] uppercase mt-1 leading-none">
            {category}
          </span>
        </div>
      </div>
      <div className="text-center mt-2 flex flex-col items-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-2">
          {label}
        </p>
        <p className="text-[9px] font-bold text-black/40 uppercase tracking-tighter leading-none">
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
          ? "bg-black text-white shadow-lg shadow-black/5"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      <div
        className={`${active ? "text-white" : "group-hover:text-foreground opacity-70 group-hover:opacity-100"}`}
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
    <Card className="border-none shadow-sm rounded-3xl bg-white p-6 transition-transform hover:-translate-y-1 duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div
            className={`${bgColor} w-9 h-9 rounded-xl flex items-center justify-center`}
          >
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-2">
              {label}
            </p>
            <h3 className="text-2xl font-bold text-foreground tracking-tighter">
              {value}
            </h3>
          </div>
          <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
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
    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden transition-all hover:shadow-md">
      <div
        className="p-5 flex items-center justify-between cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center text-foreground group-hover:bg-black group-hover:text-white transition-all">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="font-bold text-foreground group-hover:text-black transition-colors">
              {item.title}
            </h4>
            <p className="text-xs text-muted-foreground font-medium">
              {item.role} • {item.date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right hidden sm:block">
            <Badge
              variant="outline"
              className="rounded-lg px-2.5 py-1 font-black text-xs border-primary/10 bg-primary/5"
            >
              SCORE: {item.score}%
            </Badge>
          </div>
          <ChevronRight
            size={18}
            className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 bg-muted/5 overflow-hidden"
          >
            <div className="p-8 space-y-8">
              {/* Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-black">
                    <History size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Overall Performance
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium bg-white p-5 rounded-2xl border border-border/40">
                    {item.overallPerformance}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-black">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      AI Summary
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium bg-white p-5 rounded-2xl border border-border/40 italic">
                    "{item.aiInsight}"
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Key Strengths
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.strengths.map((s, i) => (
                      <Badge
                        key={i}
                        className="bg-emerald-50 text-emerald-700 border-none px-3 py-1.5 rounded-lg text-xs font-bold ring-1 ring-emerald-100"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Growth Areas
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.weaknesses.map((w, i) => (
                      <Badge
                        key={i}
                        className="bg-amber-50 text-amber-700 border-none px-3 py-1.5 rounded-lg text-xs font-bold ring-1 ring-amber-100"
                      >
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="rounded-xl h-12 px-8 font-bold text-sm bg-black hover:bg-gray-900">
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
