"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  layers?: number;
  activationDistance?: number;

  // New
  defaultPosition?: [number, number];
  mouseControlled?: boolean;
};

export default function DepthText({
  text,
  layers = 10,
  activationDistance = 300,

  // New
  defaultPosition = [0, 0],
  mouseControlled = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [offset, setOffset] = useState(
    Array.from({ length: layers }, () => ({
      x: defaultPosition[0],
      y: defaultPosition[1],
    }))
  );

  const targetOffset = useRef(
    Array.from({ length: layers }, () => ({
      x: defaultPosition[0],
      y: defaultPosition[1],
    }))
  );

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (!ref.current || !mouseControlled) return;

      const rect = ref.current.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      /*
       * Mouse outside the effect range.
       * Go back to default position.
       */
      if (distance > activationDistance) {
        targetOffset.current = Array.from(
          { length: layers },
          () => ({
            x: defaultPosition[0],
            y: defaultPosition[1],
          })
        );

        return;
      }

      if (distance === 0) return;

      const directionX = dx / distance;
      const directionY = dy / distance;

      /*
       * Distance from mouse controls total depth.
       *
       * Farther mouse = stronger depth
       * Closer mouse = weaker depth
       */
      const distanceFactor =
        distance / activationDistance;

      const maxDepth = 40 * distanceFactor;

      targetOffset.current = Array.from(
        { length: layers },
        (_, i) => {
          /*
           * First layer = closest
           * Last layer = furthest
           */
          const depth = i / layers;

          return {
            x:
              defaultPosition[0] -
              directionX * maxDepth * depth,

            y:
              defaultPosition[1] -
              directionY * maxDepth * depth,
          };
        }
      );
    };

    window.addEventListener("mousemove", mouseMove);

    /*
     * Animation loop.
     *
     * Current position slowly follows target position.
     */
    let animationFrame: number;

    const animate = () => {
      setOffset((current) =>
        current.map((layer, i) => {
          const target = targetOffset.current[i];

          return {
            x:
              layer.x +
              (target.x - layer.x) * 0.12,

            y:
              layer.y +
              (target.y - layer.y) * 0.12,
          };
        })
      );

      animationFrame =
        requestAnimationFrame(animate);
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      window.removeEventListener(
        "mousemove",
        mouseMove
      );

      cancelAnimationFrame(animationFrame);
    };
  }, [
    layers,
    activationDistance,
    defaultPosition,
    mouseControlled,
  ]);

  return (
    <div ref={ref} className="relative">
      {/* Depth layers */}
      {Array.from({ length: layers }).map((_, i) => {
        const depth = i + 1;

        /*
         * EXACT SAME opacity behavior
         */
        const opacity =
          0.35 * (1 - i / layers);

        return (
          <div
            key={i}
            className="absolute inset-0 text-6xl font-bold"
            style={{
              color: `rgba(0, 0, 0, ${opacity})`,

              transform: `
                translate(
                  ${offset[i]?.x ?? defaultPosition[0]}px,
                  ${offset[i]?.y ?? defaultPosition[1]}px
                )
              `,

              /*
               * EXACT SAME blur behavior
               */
              filter: `blur(${depth * 0.15}px)`,
            }}
          >
            {text}
          </div>
        );
      })}

      {/* Actual surface — NEVER moves */}
      <div className="relative text-6xl font-bold text-black">
        {text}
      </div>
    </div>
  );
}