"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

type Item = { key: string; label: string; src: string; href: string };

/* the dock's set; using branded social icons from the public folder */
const DOCK: Item[] = [
  { key: "github", label: "GitHub", src: "/github.png", href: "https://github.com/Rishu-xd" },
  { key: "linkedin", label: "LinkedIn", src: "/linkedin.png", href: "https://www.linkedin.com" },
  { key: "x", label: "X", src: "/x.png", href: "https://x.com" },
  { key: "mail", label: "Mail", src: "/gmailnew.png", href: "mailto:rishu99xd@gmail.com" },
  { key: "spotify", label: "Spotify", src: "/spotify.png", href: "https://open.spotify.com" },
];

const isExternal = (href: string) => href.startsWith("http");

const go = (href: string) => {
  if (isExternal(href)) window.open(href, "_blank", "noopener,noreferrer");
  else window.location.href = href;
};

/* ══ dock, distance based magnification ═══════════════════
   Scale falls off with distance from the cursor rather than
   applying only to the hovered item. */

export function GlassDock({
  magnify = 1.32,
  spread = 2,
  lift = 8,
  labels = false,
}: {
  magnify?: number;
  spread?: number;
  lift?: number;
  labels?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const bar = useRef<HTMLElement | null>(null);
  const down = useRef(false);
  /* index a touch started on, and whether the lift already navigated */
  const startIdx = useRef<number | null>(null);
  const redirected = useRef(false);

  /* the nearest item centre to the pointer's x, measured live
     because the layout moves while items are magnified */
  const at = (clientX: number) => {
    const items = bar.current?.querySelectorAll(".gdock-item");
    if (!items?.length) return null;
    let best = 0;
    let gap = Infinity;
    items.forEach((el, i) => {
      const b = el.getBoundingClientRect();
      const d = Math.abs(clientX - (b.left + b.width / 2));
      if (d < gap) { gap = d; best = i; }
    });
    return best;
  };

  const to = (i: number | null) => setHover(() => i);

  const track = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" && !down.current) return;
    to(at(e.clientX));
  };

  return (
    <nav
      className="gdock"
      aria-label="Dock"
      ref={bar}
      /* capture phase: items stop pointerdown propagation, so
         bubbling handlers here would never run */
      onPointerDownCapture={(e) => {
        down.current = true;
        redirected.current = false;
        const i = at(e.clientX);
        startIdx.current = i;
        to(i);
      }}
      onPointerMoveCapture={track}
      /* a touch is captured to the item it began on, so a native
         click only reaches that one. If the finger lifted over a
         different item, open that item's link ourselves and
         suppress the native click. */
      onPointerUpCapture={(e) => {
        if (down.current && e.pointerType !== "mouse") {
          const i = at(e.clientX);
          if (i !== null && i !== startIdx.current) {
            redirected.current = true;
            go(DOCK[i].href);
          }
        }
        down.current = false;
        startIdx.current = null;
        if (e.pointerType !== "mouse") to(null);
      }}
      onPointerCancelCapture={() => {
        down.current = false;
        startIdx.current = null;
        to(null);
      }}
      onPointerLeave={() => { if (!down.current) to(null); }}
    >
      {DOCK.map(({ key, label, src, href }, i) => {
        const d = hover === null ? 99 : Math.abs(i - hover);
        /* raised cosine over the reach: 1 under the cursor,
           easing to 0 at the edge, flat zero past it */
        const f =
          d > spread ? 0 : (1 + Math.cos((Math.PI * d) / (spread + 1))) / 2;
        const scale = 1 + (magnify - 1) * f;
        const external = isExternal(href);
        return (
          <a
            key={key}
            className="gdock-item"
            href={href}
            aria-label={label}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            data-near={d <= 1 ? d : undefined}
            style={{ opacity: 1 }}
            onClick={(e) => {
              /* the lift already navigated; don't open it twice */
              if (redirected.current) {
                e.preventDefault();
                redirected.current = false;
              }
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span
              className="gdock-glyph"
              style={{
                opacity: 1,
                transform: `translateY(${-lift * f}px) scale(${scale})`,
              }}
            >
              <Image src={src} alt="" width={20} height={20} className="size-5 object-contain" />
            </span>
          </a>
        );
      })}
      {labels && <DockTip bar={bar} at={hover} />}
    </nav>
  );
}

/* ── ONE TIP THAT TRAVELS ─────────────────────────────────
   One pill that slides to whichever icon is under the pointer
   and resizes to fit the word. Keeps the last word while it
   fades out. */
function DockTip({ bar, at }: { bar: React.RefObject<HTMLElement | null>; at: number | null }) {
  const [last, setLast] = useState(0);
  const [place, setPlace] = useState<{ x: number; w: number } | null>(null);
  const word = useRef<HTMLSpanElement>(null);
  /* first placing must not slide in from the left edge */
  const [ready, setReady] = useState(false);
  if (at !== null && at !== last) setLast(at);

  useLayoutEffect(() => {
    const nav = bar.current;
    const item = nav?.querySelectorAll<HTMLElement>(".gdock-item")[last];
    const text = word.current;
    if (!nav || !item || !text) return;
    const w = Math.ceil(text.scrollWidth) + 24;
    setPlace({ x: item.offsetLeft + item.offsetWidth / 2 - w / 2, w });
  }, [last, bar]);
  useLayoutEffect(() => {
    if (!place || ready) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [place, ready]);

  return (
    <span
      className="gdock-tip"
      aria-hidden="true"
      data-on={at !== null && !!place}
      data-ready={ready || undefined}
      style={place ? { width: place.w, transform: `translateX(${place.x}px)` } : undefined}
    >
      <span ref={word}>{DOCK[last].label}</span>
    </span>
  );
}