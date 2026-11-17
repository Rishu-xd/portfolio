"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SKILLS, SkillNode } from "../app/data/portfolio";
import { play } from "cuelume";
import { RotateCcw, Zap, ArrowDown, Magnet } from "lucide-react";

type Body = {
  skill: SkillNode;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  angle: number;
  vAngle: number;
};

type GravityMode = "EARTH" | "ZERO_G" | "ATTRACTOR";

export function PhysicsSkillArena({ light = false }: { light?: boolean }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodiesRef = useRef<Body[]>([]);
  const dragRef = useRef<{
    index: number | null;
    lastX: number;
    lastY: number;
    pointerX: number;
    pointerY: number;
  }>({ index: null, lastX: 0, lastY: 0, pointerX: 0, pointerY: 0 });

  const [gravityMode, setGravityMode] = useState<GravityMode>("EARTH");
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(SKILLS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const gravityRef = useRef<GravityMode>(gravityMode);
  useEffect(() => {
    gravityRef.current = gravityMode;
  }, [gravityMode]);

  const filteredSkills =
    categoryFilter === "ALL"
      ? SKILLS
      : SKILLS.filter((s) => s.category === categoryFilter);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const W = rect.width || 640;
    const H = rect.height || 300;

    bodiesRef.current = filteredSkills.map((skill, idx) => {
      const r = 34 * Math.sqrt(skill.mass * 0.85);
      const cols = Math.max(3, Math.floor(W / 120));
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      return {
        skill,
        x: Math.min(W - r - 10, Math.max(r + 10, 75 + col * ((W - 130) / Math.max(1, cols - 1)))),
        y: Math.min(H - r - 10, Math.max(r + 10, 50 + row * 72)),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 2,
        r,
        angle: (Math.random() - 0.5) * 0.2,
        vAngle: (Math.random() - 0.5) * 0.01,
      };
    });

    let rafId = 0;

    const step = () => {
      rafId = requestAnimationFrame(step);
      const currentStage = stageRef.current;
      if (!currentStage) return;

      const w = currentStage.clientWidth || 640;
      const h = currentStage.clientHeight || 300;
      const bodies = bodiesRef.current;
      const mode = gravityRef.current;
      const draggedIdx = dragRef.current.index;

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        if (i === draggedIdx) {
          const targetX = Math.min(w - b.r, Math.max(b.r, dragRef.current.pointerX));
          const targetY = Math.min(h - b.r, Math.max(b.r, dragRef.current.pointerY));
          b.vx = (targetX - b.x) * 0.45;
          b.vy = (targetY - b.y) * 0.45;
          b.x = targetX;
          b.y = targetY;
          b.angle *= 0.85;
          continue;
        }

        if (mode === "EARTH") {
          b.vy += 0.28 * b.skill.mass;
        } else if (mode === "ATTRACTOR") {
          const cx = w * 0.5;
          const cy = h * 0.5;
          const dx = cx - b.x;
          const dy = cy - b.y;
          const dist = Math.hypot(dx, dy) || 1;
          b.vx += (dx / dist) * 0.32;
          b.vy += (dy / dist) * 0.32;
        } else {
          // ZERO_G subtle drift
          b.vx += (Math.sin(Date.now() * 0.001 + i) * 0.015);
          b.vy += (Math.cos(Date.now() * 0.0012 + i) * 0.015);
        }

        b.vx *= 0.985;
        b.vy *= 0.985;
        b.x += b.vx;
        b.y += b.vy;
        b.angle += b.vAngle;
        b.vAngle *= 0.96;

        // Boundary elastic restitution
        const bounce = 0.72;
        if (b.x - b.r < 6) {
          b.x = b.r + 6;
          b.vx = Math.abs(b.vx) * bounce;
          b.vAngle += b.vy * 0.002;
        } else if (b.x + b.r > w - 6) {
          b.x = w - 6 - b.r;
          b.vx = -Math.abs(b.vx) * bounce;
          b.vAngle -= b.vy * 0.002;
        }

        if (b.y - b.r < 6) {
          b.y = b.r + 6;
          b.vy = Math.abs(b.vy) * bounce;
        } else if (b.y + b.r > h - 6) {
          b.y = h - 6 - b.r;
          b.vy = -Math.abs(b.vy) * bounce;
          b.vx *= 0.94; // floor friction
          b.vAngle = b.vx * 0.004;
        }
      }

      // Pairwise elastic collision resolution
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r + b.r + 4;

          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            if (i === draggedIdx) {
              b.x += nx * overlap;
              b.y += ny * overlap;
            } else if (j === draggedIdx) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            } else {
              a.x -= nx * overlap * 0.5;
              a.y -= ny * overlap * 0.5;
              b.x += nx * overlap * 0.5;
              b.y += ny * overlap * 0.5;
            }

            const kx = a.vx - b.vx;
            const ky = a.vy - b.vy;
            const p = 2 * (nx * kx + ny * ky) / (a.skill.mass + b.skill.mass);

            if (i !== draggedIdx) {
              a.vx -= p * b.skill.mass * nx * 0.82;
              a.vy -= p * b.skill.mass * ny * 0.82;
            }
            if (j !== draggedIdx) {
              b.vx += p * a.skill.mass * nx * 0.82;
              b.vy += p * a.skill.mass * ny * 0.82;
            }
          }
        }
      }

      // Apply transforms to DOM nodes
      for (let i = 0; i < bodies.length; i++) {
        const el = pillRefs.current[i];
        const b = bodies[i];
        if (el && b) {
          el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0) rotate(${b.angle.toFixed(3)}rad)`;
        }
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerBlast = () => {
    play("open");
    bodiesRef.current.forEach((b) => {
      b.vx = (Math.random() - 0.5) * 24;
      b.vy = -8 - Math.random() * 16;
      b.vAngle = (Math.random() - 0.5) * 0.14;
    });
  };

  return (
    <div
      className={`rounded-sm border transition-colors ${
        light
          ? "border-black/20 bg-neutral-100"
          : "border-white/20 bg-neutral-950"
      }`}
    >
      {/* Controls Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 font-mono text-[10px] ${
          light ? "border-black/15" : "border-white/15"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-semibold tracking-wider uppercase opacity-80">
            2D_RIGID_BODY // STACK_SANDBOX
          </span>
          {(["ALL", "Frontend & UI", "Backend & Data", "Systems & Core"] as const).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat);
                  play("select");
                }}
                className={`rounded-[2px] border px-2 py-0.5 transition-colors ${
                  categoryFilter === cat
                    ? light
                      ? "border-black bg-black text-white font-semibold"
                      : "border-white bg-white text-black font-semibold"
                    : light
                    ? "border-black/20 hover:border-black"
                    : "border-white/20 opacity-70 hover:opacity-100"
                }`}
              >
                {cat === "ALL" ? "ALL (12)" : cat.split(" ")[0].toUpperCase()}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setGravityMode("EARTH");
              play("toggle");
            }}
            className={`inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 ${
              gravityMode === "EARTH"
                ? light
                  ? "border-black bg-black text-white"
                  : "border-white bg-white text-black"
                : "border-current/20 opacity-65 hover:opacity-100"
            }`}
            title="Standard Gravity (9.8m/s²)"
          >
            <ArrowDown className="size-3" /> 1G
          </button>

          <button
            type="button"
            onClick={() => {
              setGravityMode("ZERO_G");
              play("toggle");
            }}
            className={`inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 ${
              gravityMode === "ZERO_G"
                ? light
                  ? "border-black bg-black text-white"
                  : "border-white bg-white text-black"
                : "border-current/20 opacity-65 hover:opacity-100"
            }`}
            title="Zero-G Orbital Drift"
          >
            <RotateCcw className="size-3" /> 0G
          </button>

          <button
            type="button"
            onClick={() => {
              setGravityMode("ATTRACTOR");
              play("toggle");
            }}
            className={`inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 ${
              gravityMode === "ATTRACTOR"
                ? light
                  ? "border-black bg-black text-white"
                  : "border-white bg-white text-black"
                : "border-current/20 opacity-65 hover:opacity-100"
            }`}
            title="Singularity Core Attractor"
          >
            <Magnet className="size-3" /> CORE
          </button>

          <button
            type="button"
            onClick={triggerBlast}
            className={`ml-1 inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 font-semibold transition-colors ${
              light
                ? "border-black bg-black text-white hover:bg-neutral-800"
                : "border-white bg-white text-black hover:bg-neutral-200"
            }`}
          >
            <Zap className="size-3" /> IMPULSE
          </button>
        </div>
      </div>

      {/* Interactive Physics Stage */}
      <div
        ref={stageRef}
        onPointerMove={(e) => {
          if (dragRef.current.index === null || !stageRef.current) return;
          const r = stageRef.current.getBoundingClientRect();
          dragRef.current.pointerX = e.clientX - r.left;
          dragRef.current.pointerY = e.clientY - r.top;
        }}
        onPointerUp={() => {
          dragRef.current.index = null;
        }}
        onPointerLeave={() => {
          dragRef.current.index = null;
        }}
        className="relative h-[280px] w-full overflow-hidden select-none sm:h-[310px]"
        style={{
          backgroundImage: light
            ? "radial-gradient(rgba(0,0,0,0.16) 1px, transparent 1px)"
            : "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="pointer-events-none absolute left-3 top-2.5 font-mono text-[10px] opacity-50">
          GRAB, THROW & COLLIDE NODES // CLICK NODE TO INSPECT TELEMETRY
        </div>

        {filteredSkills.map((skill, idx) => {
          const diam = Math.round(68 * Math.sqrt(skill.mass * 0.85));
          const isSelected = selectedSkill.name === skill.name;
          return (
            <div
              key={skill.name}
              ref={(el) => {
                pillRefs.current[idx] = el;
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (!stageRef.current) return;
                const r = stageRef.current.getBoundingClientRect();
                dragRef.current.index = idx;
                dragRef.current.pointerX = e.clientX - r.left;
                dragRef.current.pointerY = e.clientY - r.top;
                setSelectedSkill(skill);
                play("tap");
              }}
              style={{
                width: diam,
                height: diam,
              }}
              className={`absolute left-0 top-0 flex cursor-grab flex-col items-center justify-center rounded-full border p-1.5 text-center shadow-lg transition-colors active:cursor-grabbing ${
                isSelected
                  ? light
                    ? "border-2 border-black bg-black text-white"
                    : "border-2 border-white bg-white text-black"
                  : light
                  ? "border-black/30 bg-white/95 text-black hover:border-black"
                  : "border-white/30 bg-black/95 text-white hover:border-white"
              }`}
            >
              <Image
                src={skill.image}
                alt={skill.name}
                width={22}
                height={22}
                draggable={false}
                className="pointer-events-none size-5 object-contain"
              />
              <span className="pointer-events-none mt-1 font-mono text-[9px] font-medium leading-none tracking-tight">
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Node Readout Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2 font-mono text-[11px] ${
          light
            ? "border-black/15 bg-white"
            : "border-white/15 bg-black"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold uppercase ${
              light ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {selectedSkill.category}
          </span>
          <strong className="font-semibold">{selectedSkill.name}</strong>
          <span className="opacity-70">— {selectedSkill.detail}</span>
        </div>
        <span className="text-[10px] opacity-60">
          MASS_COEFF: {selectedSkill.mass.toFixed(2)}kg
        </span>
      </div>
    </div>
  );
}
