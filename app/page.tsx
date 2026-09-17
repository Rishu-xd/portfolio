"use client";

import { useEffect, useRef, useState } from "react";
import DepthText from "@/components/DepthText";

const defaultPosition: [number, number] = [2, 10];
const layers = 20;
const activationDistance = 300;

export default function Page() {
  const textRef = useRef<HTMLDivElement>(null);
  const targetPosition = useRef<[number, number]>(defaultPosition);
  const [position, setPosition] = useState<[number, number]>(defaultPosition);

  useEffect(() => {
    const mouseMove = (event: MouseEvent) => {
      if (!textRef.current) return;

      const rect = textRef.current.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > activationDistance || distance === 0) {
        targetPosition.current = defaultPosition;
        return;
      }

      const distanceFactor = distance / activationDistance;
      const maxDepth = 40 * distanceFactor;

      targetPosition.current = [
        defaultPosition[0] - (dx / distance) * maxDepth,
        defaultPosition[1] - (dy / distance) * maxDepth,
      ];
    };

    let animationFrame: number;

    const animate = () => {
      setPosition((current) => [
        current[0] + (targetPosition.current[0] - current[0]) * 0.12,
        current[1] + (targetPosition.current[1] - current[1]) * 0.12,
      ]);
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", mouseMove);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div ref={textRef} className="cursor-pointer">
        <DepthText
          text="Akhand Veer Singh"
          layers={layers}
          position={position}
        />
      </div>
    </main>
  );
}