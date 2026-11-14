import React from "react";
import { AV1, AV1_OPUS, H264, media, videoById, VIDEOS, type Video } from "./data";

// The player beside the text. It's drawn like a Veshell workspace: the videos are tabs in a
// workspace panel, the video is the tile. It follows the section being read (each section
// names its video), unless a tab was picked by hand since the last section change.
//
// Clips are silent screen recordings: they play muted and loop. The teaser has sound and
// controls, and only plays when asked to.

// `request` counts the times a video was asked to play (a click), so the player starts it.
type PlayerState = { current: string; request: number; show: (id: string, play?: boolean) => void };
export const PlayerContext = React.createContext<PlayerState>({ current: VIDEOS[0].id, request: 0, show: () => {} });
export const usePlayer = () => React.useContext(PlayerContext);

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Sources: React.FC<{ video: Video }> = ({ video }) => (
  <>
    <source src={media(`${video.file}.webm`)} type={video.kind === "film" ? AV1_OPUS : AV1} />
    <source src={media(`${video.file}.mp4`)} type={H264} />
  </>
);

export const Player: React.FC<{ autoplay: boolean }> = ({ autoplay }) => {
  const { current, request, show } = usePlayer();
  const video = videoById(current);
  const ref = React.useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = React.useState(true);

  // A new clip starts on its own (when the player is on screen and motion is welcome).
  React.useEffect(() => {
    const el = ref.current;
    if (!el || video.kind !== "clip" || !autoplay || reducedMotion()) return;
    el.muted = true;
    el.play().catch(() => {});
  }, [video, autoplay]);
  // A video asked for by a click plays, the teaser included.
  React.useEffect(() => {
    if (request) ref.current?.play().catch(() => {});
  }, [request]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <div className="player" id="player">
      <div className="tabs" role="tablist" aria-label="Videos">
        {VIDEOS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={v.id === current}
            className="tab"
            onClick={() => show(v.id, v.kind === "film")}
            title={v.label}
          >
            <span className="icon" aria-hidden="true">
              {v.icon}
            </span>
            <span className="tab-label">{v.tab}</span>
          </button>
        ))}
      </div>
      <div className="tile">
        <video
          key={video.id}
          ref={ref}
          className={video.kind}
          poster={video.poster}
          width={2560}
          height={1440}
          muted={video.kind === "clip"}
          loop={video.kind === "clip"}
          controls={video.kind === "film"}
          playsInline
          preload={video.kind === "clip" ? "auto" : "metadata"}
          aria-label={video.label}
          onClick={video.kind === "clip" ? toggle : undefined}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
        >
          <Sources video={video} />
        </video>
        {video.kind === "clip" && (
          <button type="button" className={`play${paused ? "" : " playing"}`} onClick={toggle} aria-label={paused ? "Play" : "Pause"}>
            <span className="icon" aria-hidden="true">
              {paused ? "play_arrow" : "pause"}
            </span>
          </button>
        )}
      </div>
      <p className="caption">
        <span>{video.label}</span>
        <span className="duration">{video.duration}</span>
      </p>
    </div>
  );
};

// Narrow screens have no player beside the text: each section shows its video inline instead,
// paused on its poster until tapped.
export const InlineVideo: React.FC<{ id: string }> = ({ id }) => {
  const video = videoById(id);
  const ref = React.useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = React.useState(true);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.preload = "auto";
      el.play().catch(() => {});
    } else el.pause();
  };
  return (
    <figure className="inline-video">
      <div className="tile">
        <video
          ref={ref}
          poster={video.poster}
          width={2560}
          height={1440}
          muted
          loop
          playsInline
          preload="none"
          aria-label={video.label}
          onClick={toggle}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
        >
          <Sources video={video} />
        </video>
        <button type="button" className={`play${paused ? "" : " playing"}`} onClick={toggle} aria-label={paused ? "Play" : "Pause"}>
          <span className="icon" aria-hidden="true">
            {paused ? "play_arrow" : "pause"}
          </span>
        </button>
      </div>
      <figcaption>{video.label}</figcaption>
    </figure>
  );
};
