"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pauseImg, playImg, replayImg, rightImg, watchImg } from "./utils";
import { hightlightsSlides } from "./constants";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [video, setVideo] = useState({
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
    startPlay: false,
  });

  const { videoId, isLastVideo, isPlaying, startPlay } = video;

  const [replay, setReplay] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef([]);
  const videoDivRef = useRef([]);
  const videoSpanRef = useRef([]);

  useGSAP(() => {
    gsap.to("#slider", {
      xPercent: -100 * video.videoId,
      x: -40 * video.videoId,
      duration: 2,
      ease: "power2.inOut",
    });
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [videoId]);

  useEffect(() => {
    const currentVideo = videoRef.current[videoId];
    if (isLastVideo) {
      console.log("");
    } else if (currentVideo) {
      currentVideo.currentTime = 0;

      if (replay) {
        if (videoId === 0) {
          const timeout = setTimeout(() => {
            currentVideo.play();
            setReplay(false);
          }, 1500);
          return () => clearTimeout(timeout);
        }
      } else {
        if (videoId === 0) {
          currentVideo.play();
        } else {
          const timeout = setTimeout(() => {
            currentVideo.play();
          }, 1500);
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [videoId]);

  useEffect(() => {
    if (!isPlaying) return;
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          if (!isPlaying) return;
          gsap.to(videoDivRef.current[videoId], {
            width: "12px",
          });
          gsap.to(span[videoId], {
            backgroundColor: "#afafaf",
          });
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  const handleVideo = () => {
    const currentVideo = videoRef.current[video.videoId];
    if (currentVideo) {
      if (video.isLastVideo) {
        setVideo((prev) => ({
          ...prev,
          videoId: 0,
          isLastVideo: false,
          isPlaying: true,
        }));
        setReplay(true);
      } else {
        if (!video.isPlaying) {
          currentVideo.play();
          setVideo((prev) => ({ ...prev, isPlaying: true }));
        } else {
          currentVideo.pause();
          setVideo((prev) => ({ ...prev, isPlaying: false }));
        }
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen w-full bg-zinc overflow-hidden">
        <div className="flex justify-center items-center flex-col w-9/10 md:w-9/16">
          <div className="flex md:mb-5 mb-3 ml-4 md:ml-0 justify-center items-center flex-col md:flex-row w-full">
            <h1 className="font-bold text-gray-200  text-2xl md:text-3xl w-full flex justify-start items-center">
              Get the highlights
            </h1>
            <div className="flex w-full justify-start md:mt-0 mt-3 md:justify-end items-center text-md md:text-xl gap-8 text-blue">
              <p className="flex items-center gap-2">
                Watch the film
                <img src={watchImg} alt="watch" className="size-5" />
              </p>
              <p className="flex items-center gap-2">
                Watch the event
                <img src={rightImg} alt="right" className="size-3" />
              </p>
            </div>
          </div>
          <div
            ref={containerRef}
            className="flex justify-start items-center gap-10"
          >
            {hightlightsSlides.map((list, i) => (
              <div
                key={list.id}
                id="slider"
                className=" flex justify-center shadow-md items-center w-full shrink-0 bg-black rounded-3xl overflow-hidden"
              >
                <video
                  id="video"
                  className="aspect-video w-full object-cover"
                  playsInline
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    setVideo((prev) => {
                      const nextId = prev.videoId + 1;
                      const isLast = nextId == hightlightsSlides.length;
                      return {
                        videoId: isLast ? prev.videoId : nextId,
                        isLastVideo: isLast,
                        isPlaying: false,
                      };
                    })
                  }
                  onPlay={() =>
                    setVideo((prev) => ({ ...prev, isPlaying: true }))
                  }
                >
                  <source src={list.video} type="video/mp4" />
                </video>
                <div className="absolute top-2 md:top-12 left-[5%] z-10">
                  {list.textLists.map((text, i) => (
                    <p key={i} className="md:text-2xl text-md font-medium">
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="relative flex justify-center items-center flex-row mt-5 gap-4">
            <div className="flex justify-center items-center flex-row py-5 px-7 shadow-md bg-gray-300 rounded-full">
              {videoRef.current.map((_, i) => (
                <span
                  key={i}
                  ref={(el) => (videoDivRef.current[i] = el)}
                  className="mx-2 size-3 md:size-3 bg-gray-200 overflow-hidden rounded-full relative cursor-pointer"
                >
                  <span
                    className="absolute h-full w-full rounded-full"
                    ref={(el) => (videoSpanRef.current[i] = el)}
                  />
                </span>
              ))}
            </div>
            <button
              onClick={() => handleVideo()}
              className="cursor-pointer bg-gray-300 flex justify-center items-center rounded-full p-3 backdrop-blur"
            >
              <img
                src={
                  video.isLastVideo
                    ? replayImg
                    : video.isPlaying
                    ? pauseImg
                    : playImg
                }
                className={
                  !video.isLastVideo && !video.isPlaying
                    ? "translate-x-[1.5px] md:size-7 size-6"
                    : "md:size-7 size-6"
                }
                alt="pause"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
