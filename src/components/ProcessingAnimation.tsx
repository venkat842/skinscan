import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

interface ProcessingProps {
  userImage: string | null;
}

const STEPS = [
  "Initializing clinical database and secure network...",
  "Running facial profile detection & lighting alignments...",
  "Analyzing stratum corneum moisture and sebum indexes...",
  "Mapping surface irregularities, fine lines, and active pores...",
  "Cross-referencing dermal concerns with safe active ingredients...",
  "Formulating kitchen-safe holistic natural remedies..."
];

export default function ProcessingAnimation({ userImage }: ProcessingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    // Staggered intervals so steps advance sequentially
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2500);

    // Continuous progress percentage slider simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 98) {
          // Accelerates initially, decelerates towards the end to await API response
          const increment = prev < 50 ? Math.floor(Math.random() * 8) + 4 : Math.floor(Math.random() * 3) + 1;
          return Math.min(prev + increment, 98);
        }
        return prev;
      });
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto bg-brand-paper rounded-3xl p-6 shadow-sm border border-brand-sage-100 flex flex-col items-center text-center" id="processing-animation">
      {/* Visual Scanning Card */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-brand-sage-200 shadow-sm bg-brand-sage-50 flex items-center justify-center">
        {userImage ? (
          <>
            <img
              src={userImage}
              alt="Scanning Target"
              className="w-full h-full object-cover opacity-80"
            />
            {/* Horizontal Glowing Scanning laser */}
            <div className="absolute left-0 right-0 h-1 bg-brand-clay-500/80 shadow-[0_0_8px_var(--color-brand-clay-500)] animate-scan pointer-events-none" />
          </>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-brand-sage-500 animate-spin" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 justify-center mb-1 bg-brand-sage-50 text-brand-sage-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-mono">
        <Sparkles className="w-3.5 h-3.5 text-brand-clay-500 animate-pulse" />
        Skincare Diagnostic Active
      </div>

      <div className="text-xl font-serif text-brand-dark mb-4">
        Analyzing Tissue Profile
      </div>

      {/* Retro clinical linear slider progress */}
      <div className="w-full bg-brand-sage-50 h-2 rounded-full overflow-hidden mb-6 border border-brand-sage-100">
        <motion.div 
          className="h-full bg-brand-sage-600 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>

      {/* Dynamic current status statement */}
      <div className="w-full h-12 flex items-center justify-center mb-4 px-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-brand-sage-800 font-sans leading-relaxed tracking-normal"
          >
            {STEPS[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Small clinical checklist ticks */}
      <div className="w-full space-y-2.5 text-left border-t border-brand-sage-100 pt-5 self-stretch">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div key={idx} className="flex items-center gap-2">
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-brand-sage-500 fill-brand-sage-50" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-brand-clay-500 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-brand-sage-200 bg-brand-sage-50/50" />
                )}
              </div>
              <span className={`text-[11px] font-sans transition-colors duration-300 ${isDone ? 'text-brand-sage-800 line-through decoration-brand-sage-200' : isActive ? 'font-semibold text-brand-dark' : 'text-brand-sage-500'}`}>
                {step.split("...")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
