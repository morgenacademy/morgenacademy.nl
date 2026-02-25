import { useRef, useState } from "react";
import { Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

const VideoPlayer = ({ src, poster }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setShowOverlay(false);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-card cursor-pointer group"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-cover"
        onEnded={() => { setIsPlaying(false); setShowOverlay(true); }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Big center play button */}
      <AnimatePresence>
        {(!isPlaying || showOverlay) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-background/30"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 backdrop-blur-sm shadow-2xl">
              <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={togglePlay} className="text-foreground hover:text-primary transition-colors">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button onClick={toggleMute} className="text-foreground hover:text-primary transition-colors">
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        <div className="flex-1" />
        <button onClick={toggleFullscreen} className="text-foreground hover:text-primary transition-colors">
          <Maximize className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
