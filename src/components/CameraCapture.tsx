import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Upload, AlertCircle, RefreshCcw, Check, Sparkles } from "lucide-react";

interface CameraCaptureProps {
  onImageReady: (base64Image: string) => void;
}

export default function CameraCapture({ onImageReady }: CameraCaptureProps) {
  const [mode, setMode] = useState<"choose" | "camera" | "upload">("choose");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera feed when component unmounts or mode changes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    setMode("camera");

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1080 },
          height: { ideal: 1080 },
          aspectRatio: 1,
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError(
        "Could not access front camera. Please check browser permissions or switch to photo upload."
      );
      setMode("choose");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      // Use square dimensions for skin framing
      const size = Math.min(video.videoWidth, video.videoHeight) || 640;
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");
      if (context) {
        // Crop a center square from the video feed
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;
        
        // Horizontal flip for mirror selfie look
        context.translate(size, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG or PNG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCapturedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onImageReady(capturedImage);
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
    if (mode === "camera") {
      startCamera();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-brand-paper rounded-3xl p-6 shadow-sm border border-brand-sage-100" id="capture-module">
      <AnimatePresence mode="wait">
        
        {/* State A: Mode Chooser */}
        {mode === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center py-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-sage-50 flex items-center justify-center text-brand-sage-600 mb-4 border border-brand-sage-200">
              <Camera className="w-8 h-8" />
            </div>
            
            <h3 className="font-serif text-2xl text-brand-dark mb-2">Capture Your Skin Profile</h3>
            <p className="text-sm text-brand-sage-800 font-sans max-w-md mb-8 leading-relaxed">
              Take a front selfie or upload a well-lit close-up. For optimal AI diagnostics, ensure minimal shadows and remove obstacles like spectacles or heavy makeup.
            </p>

            {cameraError && (
              <div className="w-full bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-start gap-2.5 text-left mb-6">
                <AlertCircle className="w-5 h-5 text-brand-clay-500 shrink-0 mt-0.5" />
                <span className="text-xs text-brand-clay-800 font-sans">{cameraError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <button
                id="btn-use-cam"
                onClick={startCamera}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-brand-sage-200 hover:border-brand-sage-500 bg-brand-sage-50/50 hover:bg-brand-sage-50 transition-all text-center"
              >
                <Camera className="w-6 h-6 text-brand-sage-500 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-sm font-semibold text-brand-dark font-sans">Use Live Camera</span>
                <span className="text-xs text-brand-sage-800 mt-1 font-sans">Immediate selfie snapshot</span>
              </button>

              <button
                id="btn-upload"
                onClick={() => setMode("upload")}
                className="group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-brand-sage-200 hover:border-brand-sage-500 bg-brand-clay-50/40 hover:bg-brand-clay-50 transition-all text-center"
              >
                <Upload className="w-6 h-6 text-brand-clay-500 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-sm font-semibold text-brand-dark font-sans">Upload Photo</span>
                <span className="text-xs text-brand-sage-800 mt-1 font-sans">JPEG or PNG from gallery</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* State B: Live Viewfinder */}
        {mode === "camera" && !capturedImage && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-brand-sage-200 shadow-md mb-6 bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />
              
              {/* Elliptical Overlay Guides */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-brand-sage-100/40 pointer-events-none flex items-center justify-center">
                <div className="absolute top-1/4 bottom-1/4 left-1/3 right-1/3 border border-dashed border-brand-sage-200/50 rounded-full" />
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-brand-dark/70 text-[10px] text-brand-cream font-mono px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                Align Face
              </div>
            </div>

            <div className="flex items-center gap-3 w-full max-w-sm">
              <button
                id="btn-capture"
                onClick={capturePhoto}
                className="flex-1 bg-brand-sage-600 hover:bg-brand-sage-800 text-brand-cream font-medium text-sm py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 font-sans"
              >
                <Sparkles className="w-4 h-4" />
                Capture Scan
              </button>
              
              <button
                id="btn-back-chooser"
                onClick={() => {
                  stopCamera();
                  setMode("choose");
                }}
                className="bg-brand-sage-50 text-brand-sage-800 hover:bg-brand-sage-100 font-medium text-sm py-3 px-4 rounded-xl border border-brand-sage-200 transition-all font-sans"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* State C: Drag and Drop Upload */}
        {mode === "upload" && !capturedImage && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${
                isDragOver
                  ? "border-brand-sage-500 bg-brand-sage-50/50 text-brand-sage-600"
                  : "border-brand-sage-200 hover:border-brand-sage-500 bg-brand-sage-50/20 hover:bg-brand-sage-50/40 text-brand-sage-800"
              }`}
            >
              <Upload className="w-10 h-10 mb-3 text-brand-sage-500" />
              <p className="text-sm font-semibold text-brand-dark mb-1 font-sans">
                Drag & drop your skin photo here
              </p>
              <p className="text-xs text-brand-sage-800 mb-4 font-sans text-center">
                Supports JPG, JPEG, and PNG files up to 10MB
              </p>
              
              <button
                type="button"
                className="bg-brand-sage-600 hover:bg-brand-sage-800 text-brand-cream text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs transition-all font-sans"
              >
                Select manually
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
              />
            </div>

            <button
              id="btn-upload-cancel"
              onClick={() => setMode("choose")}
              className="mt-4 text-xs font-medium text-brand-clay-500 hover:text-brand-clay-800 hover:underline transition-all font-sans"
            >
              Back to options
            </button>
          </motion.div>
        )}

        {/* State D: Preview & Confirm Photo */}
        {capturedImage && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-brand-sage-200 shadow-xs mb-6">
              <img
                src={capturedImage}
                alt="Capture Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-brand-sage-600 text-brand-cream p-1.5 rounded-full shadow-md">
                <Check className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-brand-sage-800 text-center max-w-sm mb-6 leading-normal font-sans">
              Ensure your photo has good, natural lighting with zero extreme glare or shadows. Once ready, click Proceed to activate the SkinScan AI engine.
            </p>

            <div className="flex gap-3 w-full max-w-xs">
              <button
                id="btn-analyze-proceed"
                onClick={handleConfirm}
                className="flex-1 bg-brand-sage-800 hover:bg-brand-dark text-brand-cream text-sm font-semibold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 font-sans"
              >
                <Sparkles className="w-4 h-4 text-brand-clay-100" />
                Proceed to Scan
              </button>
              
              <button
                id="btn-retry-capture"
                onClick={handleRetry}
                className="p-3 bg-brand-sage-50 text-brand-sage-800 hover:bg-brand-sage-100 rounded-xl border border-brand-sage-200 transition-all flex items-center gap-1 font-sans text-xs font-semibold"
                title="Retake image"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </motion.div>
        )}
        
      </AnimatePresence>
    </div>
  );
}
