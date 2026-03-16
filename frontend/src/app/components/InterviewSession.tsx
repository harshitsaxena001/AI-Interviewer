import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mic,
  Video,
  MicOff,
  VideoOff,
  PhoneOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Waves,
  BrainCircuit,
  MessageSquare,
} from "lucide-react";
import { Button } from "./ui/button";

export function InterviewSession({ onExit }: { onExit: () => void }) {
  const [step, setStep] = useState<"setup" | "interview">("setup");
  const [isReady, setIsReady] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const setupVideoRef = useRef<HTMLVideoElement>(null);
  const interviewVideoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [audioVolume, setAudioVolume] = useState<number[]>(
    new Array(16).fill(0),
  );

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const startAudioVisualizer = (stream: MediaStream) => {
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate a more responsive volume for each bar
      const newVolume = Array.from({ length: 16 }, (_, i) => {
        // Average frequencies and apply a sensitivity boost
        const start = i * 2;
        const avg =
          (dataArray[start] + (dataArray[start + 1] || dataArray[start])) / 2;

        // Use a higher multiplier (3x) and ensure it stays flat if below threshold
        const normalized = (avg / 255) * 350;
        return normalized > 10 ? Math.min(100, normalized) : 0;
      });

      setAudioVolume(newVolume);
      requestAnimationFrame(update);
    };

    update();
  };

  const requestPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setIsReady(true);

      // Give the video ref a moment to be available in the DOM if it just rendered
      setTimeout(() => {
        if (setupVideoRef.current) {
          setupVideoRef.current.srcObject = mediaStream;
          setupVideoRef.current
            .play()
            .catch((e) => console.error("Video play failed", e));
        }
        // Start visualizer after a small delay to ensure stream is active
        startAudioVisualizer(mediaStream);
      }, 200);
    } catch (err) {
      console.error("Error accessing media devices.", err);
      alert("Please allow camera and microphone permissions to proceed.");
    }
  };

  useEffect(() => {
    if (isReady && setupVideoRef.current && stream) {
      setupVideoRef.current.srcObject = stream;
    }
  }, [isReady, stream]);

  useEffect(() => {
    if (step === "interview" && interviewVideoRef.current && stream) {
      interviewVideoRef.current.srcObject = stream;
    }
  }, [step, stream]);

  // Clean up media stream and audio context when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stream]);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = isMuted));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = isVideoOff));
      setIsVideoOff(!isVideoOff);
    }
  };

  const endInterview = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onExit();
  };

  if (step === "setup") {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-white/20 overflow-y-auto">
        {/* Ambient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-black"
        >
          {/* Left Side: Instructions & Permissions */}
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <Camera size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-4">
                Device Setup
              </h2>
              <p className="text-gray-400 font-medium mb-8 leading-relaxed">
                Before we begin your mock interview, we need to ensure your
                camera and microphone are working correctly. The AI will use
                these to analyze your responses and body language.
              </p>

              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl border flex items-center gap-4 transition-colors ${isReady ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-white/5 border-white/10 text-gray-300"}`}
                >
                  {isReady ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <AlertCircle size={24} />
                  )}
                  <div>
                    <p className="font-bold text-sm">Camera & Microphone</p>
                    <p className="text-xs opacity-70">
                      {isReady ? "Permissions granted" : "Awaiting permissions"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              {!isReady ? (
                <Button
                  onClick={requestPermissions}
                  className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-base transition-transform active:scale-95"
                >
                  Enable Camera & Mic
                </Button>
              ) : (
                <Button
                  onClick={() => setStep("interview")}
                  className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-base transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  Join Interview Room
                </Button>
              )}
              <button
                onClick={onExit}
                className="w-full h-14 text-gray-400 hover:text-white font-bold text-sm transition-colors"
              >
                Cancel and Go Back
              </button>
            </div>
          </div>

          {/* Right Side: Video Preview */}
          <div className="p-8 md:p-12 md:w-1/2 bg-black/40 border-l border-white/5 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-full aspect-video bg-black/60 rounded-2xl border border-white/10 overflow-hidden relative shadow-inner">
              {isReady ? (
                <video
                  ref={setupVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: "scaleX(-1)" }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />
                    <Camera size={48} className="relative z-10 opacity-50" />
                  </div>
                  <p className="text-sm font-bold tracking-widest uppercase">
                    Preview Unavailable
                  </p>
                </div>
              )}

              {/* Status overlays on video */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md border ${isReady ? "bg-black/50 border-white/10 text-white" : "bg-red-500/20 border-red-500/30 text-red-100"}`}
                >
                  {isReady ? "Live Preview" : "Camera Off"}
                </div>
              </div>
            </div>

            {/* Audio visualizer (Reacts to real audio) */}
            <AnimatePresence>
              {isReady && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex items-center gap-6 w-full max-w-sm px-6 py-4 bg-white/5 border border-white/10 rounded-2xl"
                >
                  <Mic size={20} className="text-white" />
                  <div className="flex flex-1 justify-between items-end h-8 gap-1.5 overflow-hidden">
                    {audioVolume.map((vol, i) => (
                      <motion.div
                        key={i}
                        className="w-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        animate={{
                          height: vol > 0 ? `${Math.max(15, vol)}%` : "4px",
                          backgroundColor: vol > 40 ? "#6366f1" : "#818cf8",
                          opacity: vol > 0 ? 1 : 0.3,
                        }}
                        transition={{
                          type: "spring",
                          bounce: 0.3,
                          duration: 0.1,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black text-white font-sans overflow-hidden flex flex-col">
      {/* Ambient background for the interview room */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] opacity-50" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full h-20 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-xl border border-white/10">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm">AI Architect Simulation</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Session in progress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* <div className="px-3 py-1.5 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            REC
          </div> */}
          {/* <p className="font-mono text-xl font-light tabular-nums tracking-widest text-gray-300">
            00:14:32
          </p> */}
        </div>
      </header>

      {/* Main Stage */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-6 h-full overflow-hidden">
        {/* AI Caller Display (Center piece) */}
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
          {/* AI Voice visualizer orb */}
          <div className="relative flex items-center justify-center">
            {/* Background Glow Reacts to sound */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                background: audioVolume.some((v) => v > 20)
                  ? "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 70%)"
                  : "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
            />

            <div className="w-32 h-32 bg-black border border-white/10 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center relative z-10 overflow-hidden">
              {/* Sound indicator inside the orb */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 px-4">
                {audioVolume.slice(4, 12).map((vol, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white/40 rounded-full"
                    animate={{
                      height: vol > 0 ? `${Math.max(10, vol)}%` : "10%",
                      backgroundColor:
                        vol > 40
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(255,255,255,0.4)",
                    }}
                  />
                ))}
              </div>
              <Sparkles
                size={40}
                className={`text-white transition-opacity duration-300 ${audioVolume.some((v) => v > 10) ? "opacity-20" : "opacity-100"}`}
              />
            </div>
          </div>

          <div className="mt-12 text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white/90">
              Interview AI
            </h3>
            <p className="text-gray-400 text-sm font-medium flex items-center justify-center gap-2">
              {audioVolume.some((v) => v > 10) ? (
                <>
                  <Waves size={16} className="text-indigo-400 animate-pulse" />
                  <span className="text-indigo-300">Listening to you...</span>
                </>
              ) : (
                <>
                  <Waves size={16} />
                  Waiting for response
                </>
              )}
            </p>
          </div>

          {/* Subtitles / transcript */}
          <div className="absolute bottom-12 left-0 right-0 px-12">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center max-w-3xl mx-auto">
              <p className="text-lg md:text-xl font-medium leading-relaxed text-white">
                <span className="opacity-50">
                  "Could you explain how you would design a highly scalable
                  microservices architecture... "
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* User PIP (Picture in picture) and local controls */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          <div className="w-full aspect-[3/4] lg:aspect-auto lg:h-[400px] bg-black/50 border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
            <video
              ref={interviewVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover mirror ${isVideoOff ? "hidden" : ""}`}
              style={{ transform: "scaleX(-1)" }}
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 border border-white/5">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">C</span>
                </div>
                <p className="text-sm font-bold text-gray-400">Camera Off</p>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-3">
              <span className="flex items-center gap-2 font-black">
                Candidate
              </span>

              {!isMuted && !isVideoOff && (
                <div className="flex items-center gap-1 h-3">
                  {audioVolume.slice(0, 8).map((vol, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-green-400 rounded-full"
                      animate={{
                        height: vol > 0 ? `${Math.max(20, vol)}%` : "20%",
                        opacity: vol > 0 ? 1 : 0.4,
                      }}
                      transition={{ type: "spring", bounce: 0, duration: 0.1 }}
                    />
                  ))}
                </div>
              )}

              {isMuted && <MicOff size={12} className="text-red-400" />}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-4 flex justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            <button
              onClick={endInterview}
              className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              <PhoneOff size={20} />
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <MessageSquare size={18} className="text-gray-400" />
              <span className="font-bold text-sm">Live Analysis</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  Tone
                </p>
                <p className="text-sm font-medium text-green-400">
                  Confident & Clear
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  Pacing
                </p>
                <p className="text-sm font-medium text-white">
                  Optimal (140 wpm)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
