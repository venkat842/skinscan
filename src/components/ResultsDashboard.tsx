import { useState } from "react";
import { SkinAnalysisResponse, Severity, CommercialProduct, NaturalRemedy } from "../types";
import { 
  Sparkles, Check, AlertCircle, ExternalLink, Calendar, 
  Droplets, Smile, RotateCcw, Info, Heart, ShieldAlert,
  ListOrdered, FlaskConical, MapPin
} from "lucide-react";

interface ResultsDashboardProps {
  analysis: SkinAnalysisResponse;
  userImage: string | null;
  onRestart: () => void;
}

export default function ResultsDashboard({ analysis, userImage, onRestart }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"commercial" | "natural">("commercial");

  const getSeverityBadgeClass = (severity: Severity) => {
    switch (severity) {
      case Severity.Mild:
        return "bg-green-50 text-green-700 border-green-100";
      case Severity.Moderate:
        return "bg-amber-50 text-amber-700 border-amber-100";
      case Severity.Severe:
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-brand-sage-50 text-brand-sage-800 border-brand-sage-100";
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-emerald-700 border-emerald-200 bg-emerald-50/50";
    if (score >= 60) return "text-amber-700 border-amber-200 bg-amber-50/50";
    return "text-rose-700 border-rose-200 bg-rose-50/50";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in" id="results-dashboard">
      
      {/* Top Banner Cards: Split Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Image snapshot & skin type stats */}
        <div className="bg-brand-paper rounded-3xl p-6 border border-brand-sage-100 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full">
            <h4 className="text-xs font-mono text-brand-sage-800 uppercase tracking-widest mb-3 text-left">Your Profile Photo</h4>
            <div className="relative w-36 h-36 rounded-full overflow-hidden mx-auto border-2 border-brand-sage-200 shadow-2xs mb-4">
              {userImage ? (
                <img
                  src={userImage}
                  alt="Scanned Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-brand-sage-50 flex items-center justify-center">
                  <Smile className="w-10 h-10 text-brand-sage-500" />
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-brand-sage-800 text-brand-cream text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase">
                Front Shot
              </div>
            </div>
            
            <div className="space-y-1 mt-4">
              <span className="text-xs text-brand-sage-800 uppercase tracking-widest font-mono">Apparent Skin Type</span>
              <div className="text-2xl font-serif text-brand-dark font-medium">{analysis.skinType}</div>
            </div>
          </div>

          <button
            id="btn-scan-again-summary"
            onClick={onRestart}
            className="mt-6 w-full py-2 px-4 rounded-xl border border-brand-sage-200 text-xs font-semibold text-brand-sage-800 bg-brand-sage-50/50 hover:bg-brand-sage-50 hover:text-brand-dark transition-all flex items-center justify-center gap-1 font-sans"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Scan New Photo
          </button>
        </div>

        {/* Center & Right Column: Diagnostic assessment summary */}
        <div className="md:col-span-2 bg-brand-paper rounded-3xl p-6 border border-brand-sage-100 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-brand-sage-800 uppercase tracking-widest">Clinical AI Assessment</span>
              
              {/* Overall barrier state score gauge */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold font-mono ${getScoreColorClass(analysis.overallScore)}`}>
                <Droplets className="w-4 h-4" />
                Skin Score: {analysis.overallScore}/100
              </div>
            </div>

            <h3 className="text-3xl font-serif text-brand-dark font-medium">Diagnostic Insights</h3>
            <p className="text-sm text-brand-dark/90 leading-relaxed font-sans font-light">
              {analysis.assessment}
            </p>
          </div>

          <div className="mt-6 bg-brand-sage-50/70 border border-brand-sage-100 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-sage-600 shrink-0 mt-0.5" />
            <div className="text-xs text-brand-sage-800 leading-normal font-sans">
              <strong>Educational Disclaimer:</strong> SkinScan matches superficial patterns to academic skincare datasets. This recommendation is for educational reference only and does not represent professional medical diagnosis or prescription.
            </div>
          </div>
        </div>
      </div>

      {/* Main Body: Detected concerns listing */}
      <div className="bg-brand-paper rounded-3xl p-6 md:p-8 border border-brand-sage-100 shadow-xs">
        <h4 className="text-xs font-mono text-brand-sage-800 uppercase tracking-widest mb-5">Detected Skin Indicators ({analysis.detectedConcerns.length})</h4>
        
        {analysis.detectedConcerns.length === 0 ? (
          <div className="py-6 text-center text-brand-sage-500 text-sm font-sans">
            No severe visual concerns identified. Maintain your current protective routine!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.detectedConcerns.map((item, idx) => (
              <div key={idx} className="bg-brand-sage-50/40 hover:bg-brand-sage-50 transition-colors p-5 rounded-2xl border border-brand-sage-100/60 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-lg font-serif font-semibold text-brand-dark">{item.concern}</span>
                    <span className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border ${getSeverityBadgeClass(item.severity)}`}>
                      {item.severity} Intensity
                    </span>
                  </div>
                  <p className="text-xs text-brand-sage-800 italic leading-relaxed font-sans">
                    <strong>Markers Seen:</strong> &ldquo;{item.visualEvidence}&rdquo;
                  </p>
                  <p className="text-xs text-brand-dark/80 leading-relaxed font-sans font-light">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Solutions: Tabs selector and detail lists */}
      <div className="space-y-4">
        
        {/* Tab Headers */}
        <div className="flex border-b border-brand-sage-100 bg-brand-paper/50 p-1 rounded-2xl border max-w-md mx-auto">
          <button
            id="tab-commercial"
            onClick={() => setActiveTab("commercial")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "commercial"
                ? "bg-brand-sage-600 text-brand-cream shadow-xs"
                : "text-brand-sage-800 hover:text-brand-dark hover:bg-brand-sage-50/50"
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Clinical Formulations
          </button>
          <button
            id="tab-natural"
            onClick={() => setActiveTab("natural")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "natural"
                ? "bg-brand-sage-600 text-brand-cream shadow-xs"
                : "text-brand-sage-800 hover:text-brand-dark hover:bg-brand-sage-50/50"
            }`}
          >
            <Heart className="w-4 h-4 text-brand-clay-100" />
            Kitchen Remedies
          </button>
        </div>

        {/* Tab Content 1: Commercial Ingredient Matches */}
        {activeTab === "commercial" && (
          <div className="bg-brand-paper rounded-[32px] p-6 md:p-8 border border-brand-sage-100 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-brand-sage-100 pb-4">
              <h3 className="text-2xl font-serif text-brand-dark font-medium flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-brand-sage-500" />
                Dermatologist-Approved Ingredients
              </h3>
              <p className="text-xs text-brand-sage-800 mt-1 font-sans">
                These generic formulation components are academically mapped to target and restore detected skin concerns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.commercialRecommendations.map((product, idx) => {
                // Determine cute category emoji based on user request layout
                let categoryEmoji = "💧";
                if (product.category.toLowerCase().includes("cleanse")) categoryEmoji = "🧼";
                else if (product.category.toLowerCase().includes("sun") || product.category.toLowerCase().includes("spf")) categoryEmoji = "☀️";
                else if (product.category.toLowerCase().includes("moisturize") || product.category.toLowerCase().includes("cream")) categoryEmoji = "🧴";
                else if (product.category.toLowerCase().includes("mask")) categoryEmoji = "💆";
                else if (product.category.toLowerCase().includes("toner")) categoryEmoji = "💦";

                return (
                  <div key={idx} className="bg-white p-5 rounded-[28px] border border-brand-sage-100 flex gap-4 items-start hover:border-brand-sage-500 hover:shadow-2xs transition-all">
                    <div className="w-14 h-14 bg-brand-cream rounded-2xl border border-brand-sage-100 flex items-center justify-center text-2xl shrink-0 mt-0.5">
                      {categoryEmoji}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-brand-clay-500 font-bold block">
                          {product.category}
                        </span>
                        <h4 className="font-bold text-sm text-brand-dark font-sans leading-tight mt-0.5">{product.name}</h4>
                        <p className="text-[11px] text-brand-sage-800 font-medium font-sans mt-0.5">Actives: {product.activeIngredients.join(", ")}</p>
                      </div>

                      <p className="text-xs text-brand-dark/85 leading-relaxed font-sans font-light">
                        {product.purpose}
                      </p>

                      <div className="text-[10px] text-brand-sage-800 bg-brand-cream/80 p-2 rounded-lg border border-brand-sage-50/50 font-sans font-medium">
                        <strong>Plan:</strong> {product.howToUse}
                      </div>

                      <div className="pt-1">
                        <a 
                          id={`link-amazon-${idx}`}
                          href={`https://www.amazon.com/s?k=${encodeURIComponent(product.searchQuery)}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] inline-flex items-center gap-1 font-bold text-brand-sage-500 hover:text-brand-sage-800 uppercase tracking-widest border-b border-brand-sage-500/30 transition-colors"
                        >
                          Shop Retailers
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2: Holistic / Natural Remedies */}
        {activeTab === "natural" && (
          <div className="bg-brand-paper rounded-[32px] p-6 md:p-8 border border-brand-sage-100 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-brand-sage-100 pb-4">
              <h3 className="text-2xl font-serif text-brand-dark font-medium flex items-center gap-2">
                <Heart className="w-6 h-6 text-brand-clay-500" />
                Home & Organic Remedies
              </h3>
              <p className="text-xs text-brand-sage-800 mt-1 font-sans">
                Gentle kitchen-safe DIY formulations to calm, soothe, and support epidermal recovery.
              </p>
            </div>

            <div className="space-y-6">
              {analysis.naturalRecommendations.map((remedy, idx) => (
                <div key={idx} className="bg-brand-sage-500 text-white p-6 md:p-8 rounded-[32px] relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-xs">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl shrink-0">
                    🌿
                  </div>
                  
                  <div className="flex-1 space-y-3 z-10 w-full text-left">
                    <div>
                      <h4 className="text-xl md:text-2xl font-serif mb-1">{remedy.name}</h4>
                      <p className="text-xs text-brand-cream/80 leading-relaxed max-w-2xl font-sans font-light">
                        {remedy.purpose}
                      </p>
                    </div>

                    <div className="space-y-1.5 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-3xs">
                      <div className="text-xs font-semibold text-brand-cream flex items-center gap-1 font-sans">
                        <ListOrdered className="w-3.5 h-3.5" />
                        Preparation Instructions:
                      </div>
                      <ol className="list-decimal pl-4 space-y-1">
                        {remedy.instructions.map((step, i) => (
                          <li key={i} className="text-[11px] text-brand-cream/90 font-sans font-light leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 items-center">
                      <span className="text-[10px] px-2.5 py-1 bg-white/20 rounded-md border border-white/10 uppercase tracking-tighter shrink-0 font-sans">
                        Ingredients: {remedy.ingredients.join(", ")}
                      </span>
                      <span className="text-[10px] px-2.5 py-1 bg-brand-clay-800 text-brand-clay-100 rounded-md border border-brand-clay-600/35 uppercase tracking-tighter shrink-0 font-mono flex items-center gap-1 font-semibold">
                        <ShieldAlert className="w-3 h-3 text-brand-clay-100" />
                        Test: {remedy.precautions.split(" ")[0]}..
                      </span>
                    </div>

                    <div className="text-[10px] text-brand-cream/70 italic font-sans leading-normal pt-1 max-w-xl">
                      * <strong>Allergy Precaution:</strong> {remedy.precautions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start Over Button Footing */}
      <div className="flex justify-center pt-4">
        <button
          id="btn-restart-scan-foot"
          onClick={onRestart}
          className="bg-brand-sage-800 hover:bg-brand-dark text-brand-cream py-3.5 px-8 rounded-2xl text-sm font-semibold transition-all shadow-xs flex items-center gap-2 font-sans"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Camera Scan
        </button>
      </div>

    </div>
  );
}
