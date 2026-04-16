"use client";

import { DotLottie } from "@lottiefiles/dotlottie-web";
import { useEffect, useRef } from "react";

type HeroLottieProps = {
  className?: string;
  fit?: "contain" | "cover" | "fill" | "none" | "fit-width" | "fit-height";
};

export default function HeroLottie({ className, fit = "contain" }: HeroLottieProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const player = new DotLottie({
      canvas,
      src: "/animations/studentpath-hero.lottie",
      autoplay: true,
      loop: true,
      layout: {
        fit,
        align: [0.5, 0.5],
      },
      renderConfig: {
        autoResize: true,
      },
    });

    return () => {
      player.destroy();
    };
  }, [fit]);

  return <canvas ref={canvasRef} className={`block ${className ?? ""}`} />;
}
