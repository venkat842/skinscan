import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Camera, Shield, Heart, ArrowRight, 
  HelpCircle, AlertTriangle, RefreshCcw, BookOpen 
} from "lucide-react";

import { SkinAnalysisResponse, ScanHistoryItem } from "./types";
import { SAMPLE_SCANS } from "./components/SampleScans";
import CameraCapture from "./components/CameraCapture";
import ProcessingAnimation from "./components/ProcessingAnimation";
import ResultsDashboard from "./components/ResultsDashboard";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"landing" | "capture" | "processing" | "results">("landing");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResponse | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Load session history from localStorage on mounting
  useEffect(() => {
    try {
      const stored = localStorage.getItem("skinscan_session_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse skinscan session history:", e);
    }
  }, []);

  // Save history item helper
  const saveToHistory = (analysis: SkinAnalysisResponse, imgUrl: string) => {
    const newItem: ScanHistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: imgUrl,
      analysis
    };
    const updated = [newItem, ...history].slice(0, 5); // Limit to past 5 items
    setHistory(updated);
    try {
      localStorage.setItem("skinscan_session_history", JSON.stringify(updated));
    } catch (e) {
      console.warn("localStorage quota exceeded, skipped persisting history.");
    }
  };

  // Launch live-scanning
  const handleStartScan = () => {
    setUserImage(null);
    setAnalysisResult(null);
    setErrorStatus(null);
    setCurrentScreen("capture");
  };

  // Handle uploaded or captured selfie
  const handleImageReady = async (base64Image: string) => {
    setUserImage(base64Image);
    setCurrentScreen("processing");
    setErrorStatus(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with state ${response.status}`);
      }

      const diagnosticData: SkinAnalysisResponse = await response.json();
      setAnalysisResult(diagnosticData);
      saveToHistory(diagnosticData, base64Image);
      setCurrentScreen("results");
    } catch (err: any) {
      console.error("Analysis process failed:", err);
      setErrorStatus(
        err.message || 
        "Our secure server-side scanning system experienced a networking interruption. Please try again."
      );
      setCurrentScreen("landing");
    }
  };

  // Trigger one of the pre-computed high-fidelity samples
  const handleSelectSample = (sample: typeof SAMPLE_SCANS[number]) => {
    setUserImage(sample.imageUrl);
    setAnalysisResult(sample.analysis);
    setCurrentScreen("results");
    setErrorStatus(null);
  };

  // Restart scan from results
  const handleRestart = () => {
    setUserImage(null);
    setAnalysisResult(null);
    setErrorStatus(null);
    setCurrentScreen("landing");
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col justify-between selection:bg-brand-sage-200">
      
      {/* Visual Navigation Bar */}
      <header className="h-20 px-6 md:px-10 flex items-center justify-between border-b border-brand-sage-100 bg-brand-cream sticky top-0 z-50" id="app-header">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <button 
            onClick={handleRestart}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left"
          >
            <div className="w-8 h-8 bg-brand-sage-500 rounded-full flex items-center justify-center shrink-0">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <span className="text-2xl font-serif italic font-semibold text-brand-dark">SkinScan</span>
              <p className="text-[9px] font-sans font-medium uppercase tracking-widest text-brand-clay-500 -mt-1 block">Studio</p>
            </div>
          </button>

          {/* Navigation links matching Natural Tones header */}
          <div className="hidden md:flex gap-8 text-[11px] font-sans font-semibold uppercase tracking-widest text-brand-dark/60">
            <button onClick={handleRestart} className="text-brand-sage-600 border-b-2 border-brand-sage-500 pb-1">Analysis</button>
            <button onClick={() => { if (history.length > 0) { setUserImage(history[0].imageUrl); setAnalysisResult(history[0].analysis); setCurrentScreen("results"); } else { alert("Scan some images first to generate session history!"); } }} className="hover:text-brand-sage-500 pb-1 transition-colors">History</button>
            <a href="#how-it-works" className="hover:text-brand-sage-500 pb-1 transition-colors">How to Scan</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="btn-trigger-scan-header"
              onClick={handleStartScan}
              className="px-6 py-2 bg-brand-dark text-brand-cream hover:bg-brand-sage-800 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
            >
              New Scan
            </button>
          </div>
        </div>
      </header>

      {/* Primary Container Viewports */}
      <main className="flex-grow py-8 px-4 max-w-6xl w-full mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: LANDING PAGE */}
          {currentScreen === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Marketing Editorial Copy column */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="inline-flex items-center gap-1.5 bg-brand-clay-100 text-brand-clay-800 border border-brand-clay-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-sans shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-brand-clay-500" />
                  Instant Facial Analysis
                </span>

                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-brand-dark leading-tight tracking-tight">
                  Demystify Your Skincare, <br />
                  <span className="italic text-brand-sage-600 font-normal">Backed by AI</span>
                </h2>

                <p className="text-base text-brand-sage-800 max-w-xl leading-relaxed font-sans font-light">
                  Reveal your skin type, flag surface texture indicators, and obtain customized treatment blueprints. Explore commercial ingredient combinations alongside gentle, raw kitchen-safe natural remedies.
                </p>

                {errorStatus && (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 max-w-xl">
                    <AlertTriangle className="w-5 h-5 text-brand-clay-500 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="text-xs font-semibold text-brand-clay-800">Scan Interrupted</p>
                      <p className="text-xs text-brand-clay-800/95 mt-0.5 leading-normal">{errorStatus}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {userImage && errorStatus ? (
                    <button
                      id="btn-retry-same-image"
                      onClick={() => handleImageReady(userImage)}
                      className="bg-brand-clay-500 hover:bg-brand-clay-600 text-brand-cream font-semibold text-sm px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group font-sans cursor-pointer"
                    >
                      <RefreshCcw className="w-4 h-4 text-brand-cream" />
                      Retry Analysis with Photo
                      <ArrowRight className="w-4 h-4 text-brand-cream" />
                    </button>
                  ) : null}

                  <button
                    id="btn-trigger-scan"
                    onClick={handleStartScan}
                    className="bg-brand-sage-800 hover:bg-brand-dark text-brand-cream font-semibold text-sm px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group font-sans cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-brand-clay-100 group-hover:scale-110 transition-transform" />
                    {userImage && errorStatus ? "Take Different Photo" : "Analyze Your Skin Now"}
                    <ArrowRight className="w-4 h-4 text-brand-clay-100 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href="#how-it-works"
                    className="border border-brand-sage-200 hover:bg-brand-sage-50 text-brand-sage-800 font-semibold text-xs px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-1.5 font-sans"
                  >
                    <BookOpen className="w-4 h-4" />
                    How to scan
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-brand-sage-100 max-w-lg">
                  <div>
                    <div className="text-xl font-serif text-brand-dark">Clinical</div>
                    <div className="text-xs text-brand-sage-800 font-sans mt-0.5">Ingredient maps</div>
                  </div>
                  <div>
                    <div className="text-xl font-serif text-brand-dark">Organic</div>
                    <div className="text-xs text-brand-sage-800 font-sans mt-0.5">Home remedies</div>
                  </div>
                  <div>
                    <div className="text-xl font-serif text-brand-dark">Private</div>
                    <div className="text-xs text-brand-sage-800 font-sans mt-0.5">Local analysis</div>
                  </div>
                </div>
              </div>

              {/* Demo Sample Cases Preview selector column */}
              <div className="lg:col-span-5 bg-brand-paper rounded-[32px] p-6 border border-brand-sage-100 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-brand-dark">Try as Guest</h3>
                  <p className="text-xs text-brand-sage-800 mt-1 font-sans">
                    Have no selfie available? Peek at our pre-crafted clinical profiles to instantly experience SkinScan's comprehensive diagnostic breakdown:
                  </p>
                </div>

                <div className="space-y-4">
                  {SAMPLE_SCANS.map((sample, idx) => (
                    <button
                      key={idx}
                      id={`btn-sample-${idx}`}
                      onClick={() => handleSelectSample(sample)}
                      className="w-full text-left p-4 rounded-2xl border border-brand-sage-100 bg-brand-sage-50/20 hover:bg-brand-sage-50 hover:border-brand-sage-500 transition-all flex items-center gap-4 group"
                    >
                      <img
                        src={sample.imageUrl}
                        alt={sample.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-brand-sage-200 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] uppercase font-mono font-bold text-brand-clay-600 block mb-0.5">Sample Profile</span>
                        <h4 className="text-xs font-serif font-bold text-brand-dark tracking-tight line-clamp-1">{sample.title}</h4>
                        <p className="text-[11px] text-brand-sage-800 line-clamp-1 font-sans font-light mt-0.5">{sample.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-sage-200 group-hover:text-brand-sage-600 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>

                {/* Session scan history helper shelf */}
                {history.length > 0 && (
                  <div className="border-t border-brand-sage-100 pt-6 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-sage-800 block">Current Session History</span>
                    <div className="flex flex-wrap gap-2">
                      {history.map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setUserImage(item.imageUrl);
                            setAnalysisResult(item.analysis);
                            setCurrentScreen("results");
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-sage-100 bg-brand-sage-50/20 hover:bg-brand-sage-50 text-[11px] font-sans font-semibold text-brand-sage-800 transition-all"
                        >
                          <img src={item.imageUrl} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                          Scan {item.timestamp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* SCREEN 2: CAMERA VIEWPORT */}
          {currentScreen === "capture" && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex items-center justify-center"
            >
              <CameraCapture onImageReady={handleImageReady} />
            </motion.div>
          )}

          {/* SCREEN 3: PROCESSING STATE (Magic State) */}
          {currentScreen === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-center"
            >
              <ProcessingAnimation userImage={userImage} />
            </motion.div>
          )}

          {/* SCREEN 4: RESULTS DASHBOARD */}
          {currentScreen === "results" && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full"
            >
              <ResultsDashboard 
                analysis={analysisResult} 
                userImage={userImage} 
                onRestart={handleRestart} 
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Guided Instructions and How To Scan Footer segment */}
      {currentScreen === "landing" && (
        <section className="bg-brand-paper py-12 px-6 border-t border-brand-sage-100" id="how-it-works">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <h3 className="font-serif text-3xl text-brand-dark">How to capture a proper scan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2 p-4 rounded-2xl bg-brand-sage-50/35 border border-brand-sage-100/60">
                <span className="w-7 h-7 rounded-full bg-brand-sage-600 text-brand-cream flex items-center justify-center text-xs font-semibold font-serif">1</span>
                <h4 className="text-sm font-semibold text-brand-dark font-sans">Natural Lighting</h4>
                <p className="text-xs text-brand-sage-800 leading-normal font-sans">
                  Stand near a window or well-lit white lamp. Shadows or yellowish lights could distort correct surface pigment evaluations.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-brand-sage-50/35 border border-brand-sage-100/60">
                <span className="w-7 h-7 rounded-full bg-brand-sage-600 text-brand-cream flex items-center justify-center text-xs font-semibold font-serif">2</span>
                <h4 className="text-sm font-semibold text-brand-dark font-sans">Expose Clear Facial Skin</h4>
                <p className="text-xs text-brand-sage-800 leading-normal font-sans">
                  Pull your hair back, remove glasses, and wash heavy cream makeups so target areas are direct and readable.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-brand-sage-50/35 border border-brand-sage-100/60">
                <span className="w-7 h-7 rounded-full bg-brand-sage-600 text-brand-cream flex items-center justify-center text-xs font-semibold font-serif">3</span>
                <h4 className="text-sm font-semibold text-brand-dark font-sans">Align within Frame</h4>
                <p className="text-xs text-brand-sage-800 leading-normal font-sans">
                  Keep your face inside the spherical viewfinder frame and hold still during snapshot captures.
                </p>
              </div>
            </div>
            
            <div className="border border-brand-sage-100 bg-brand-cream/50 rounded-2xl p-4 inline-flex items-center gap-2.5 max-w-xl text-left">
              <Shield className="w-5 h-5 text-brand-sage-500 shrink-0" />
              <span className="text-[11px] text-brand-sage-800 font-sans leading-normal">
                <strong>Your Privacy First:</strong> SkinScan operates locally & server-side only. We process the images to generate diagnostic metrics on the fly and never sell or catalog your photos in commercial cloud databases.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Humble Footer credits */}
      <footer className="border-t border-brand-sage-100/40 bg-brand-cream py-6 text-center text-xs text-brand-sage-800 font-sans">
        <p>&copy; {new Date().getFullYear()} SkinScan Studio. All treatments are experimental, clean suggestions.</p>
      </footer>

    </div>
  );
}
