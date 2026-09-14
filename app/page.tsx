"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const capabilities = ["Next.js", "TypeScript", "Python", "FastAPI", "Dart", "Flutter"];

const projects = [
  {
    number: "01",
    title: "Nebula Finance",
    type: "Fintech / Product system",
    description: "A calm command center for complex money movement, shaped for people who need the signal before the noise.",
    color: "ochre",
  },
  {
    number: "02",
    title: "Vanta Health",
    type: "Mobile / Care infrastructure",
    description: "A frictionless Flutter experience that makes the invisible work of care feel clear, human, and immediate.",
    color: "seafoam",
  },
  {
    number: "03",
    title: "Atlas OS",
    type: "Developer tooling / API",
    description: "A fast, composable API layer where data, automation, and a slightly obsessive eye for detail meet.",
    color: "coral",
  },
];

function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1), 3));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0x000000, 0);

    const world = new THREE.Group();
    scene.add(world);
    const planet = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.35, 5),
      new THREE.MeshStandardMaterial({ color: 0x7d8e47, roughness: 0.82, metalness: 0.08 }),
    );
    world.add(planet);
    world.add(new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.39, 2),
      new THREE.MeshBasicMaterial({ color: 0xd4f05b, wireframe: true, transparent: true, opacity: 0.18 }),
    ));

    const textGroup = new THREE.Group();
    const createTextSprite = (text: string, color: string, size: number) => {
      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = 2400;
      textureCanvas.height = 520;
      const context = textureCanvas.getContext("2d");
      if (!context) return null;
      context.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
      context.font = "700 236px Space Grotesk, sans-serif";
      context.fillStyle = color;
      context.letterSpacing = "16px";
      context.fillText(text, 40, 290);
      const texture = new THREE.CanvasTexture(textureCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.38, depthWrite: false }));
      sprite.scale.set(size * 4.6, size, 1);
      return sprite;
    };
    const textItems = [
      { text: "AKHAND", color: "#d4f05b", size: 1.1, position: [-4.8, 3.1, -2.2] },
      { text: "VEER", color: "#f27756", size: 1.35, position: [2.5, -2.2, -1.5] },
      { text: "SINGH", color: "#d8d6cd", size: 0.82, position: [-3.4, -3.9, -0.8] },
    ];
    textItems.forEach(({ text, color, size, position }) => {
      const sprite = createTextSprite(text, color, size);
      if (!sprite) return;
      sprite.position.set(...position as [number, number, number]);
      textGroup.add(sprite);
    });
    scene.add(textGroup);

    const rings = [
      { radius: 2.05, tilt: 1.12, color: 0xd4f05b, opacity: 0.7 },
      { radius: 2.65, tilt: 0.82, color: 0xf27756, opacity: 0.58 },
      { radius: 3.1, tilt: 1.38, color: 0xd8d6cd, opacity: 0.2 },
    ].map(({ radius, tilt, color, opacity }) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 8, 160), new THREE.MeshBasicMaterial({ color, transparent: true, opacity }));
      ring.rotation.set(tilt, 0.3, -0.4);
      world.add(ring);
      return ring;
    });

    const starPositions = new Float32Array(900 * 3);
    for (let index = 0; index < starPositions.length; index += 3) {
      const radius = 5 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[index] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[index + 2] = radius * Math.cos(phi);
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xd8d6cd, size: 0.025, transparent: true, opacity: 0.58 }));
    scene.add(stars);
    const light = new THREE.PointLight(0xffefad, 28, 11);
    light.position.set(-3, 3, 4);
    scene.add(light, new THREE.AmbientLight(0x526044, 1.2));

    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    let scrollProgress = 0;
    let targetScroll = 0;
    let animationFrame = 0;
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);
      renderer.setSize(safeWidth, safeHeight, false);
      camera.aspect = safeWidth / safeHeight;
      camera.updateProjectionMatrix();
    };
    const updatePointer = (event: PointerEvent) => {
      targetPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetPointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    const updateScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    const animate = (time: number) => {
      animationFrame = requestAnimationFrame(animate);
      pointer.lerp(targetPointer, 0.035);
      scrollProgress += (targetScroll - scrollProgress) * 0.045;
      const orbitDirection = scrollProgress * Math.PI * 2;
      world.rotation.y = time * 0.00012 + orbitDirection * 0.55 + pointer.x * 0.16;
      world.rotation.x = pointer.y * 0.12 + scrollProgress * 0.38;
      planet.rotation.y = time * 0.0003;
      rings[0].rotation.z = -0.4 + orbitDirection * 0.9;
      rings[1].rotation.z = 0.7 - orbitDirection * 0.65;
      rings[2].rotation.z = -0.9 + orbitDirection * 0.35;
      stars.rotation.y = time * 0.000018 + scrollProgress * 0.6;
      textGroup.rotation.y = -pointer.x * 0.08 - scrollProgress * 0.25;
      textGroup.rotation.x = pointer.y * 0.06 + scrollProgress * 0.12;
      textGroup.position.y = scrollProgress * 1.8;
      textGroup.position.z = scrollProgress * 1.7;
      camera.position.z = 8 - scrollProgress * 2.15;
      camera.position.y = pointer.y * 0.25 + scrollProgress * 0.35;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    resize();
    updateScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("scroll", updateScroll, { passive: true });
    animationFrame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      starsGeometry.dispose();
      textGroup.traverse((object) => {
        if (object instanceof THREE.Sprite) {
          object.material.map?.dispose();
          object.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return <canvas className="three-scene" ref={canvasRef} aria-label="Interactive 3D orbital scene" />;
}

export default function Home() {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <main className={focusMode ? "portfolio focus-mode" : "portfolio"}>
      <div className="grain" aria-hidden="true" />
      <ThreeScene />
      <div className="site-shell">
        <nav className="topbar" aria-label="Main navigation">
          <a className="monogram" href="#top" aria-label="Akhand Veer Singh home">AVS<span>.</span></a>
          <div className="nav-links">
            <a href="#work">Selected work</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="mode-button" onClick={() => setFocusMode(!focusMode)} aria-pressed={focusMode}>
            <span className="mode-dot" /> {focusMode ? "Ambient mode" : "Focus mode"}
          </button>
        </nav>

        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span className="live-dot" /> Independent full-stack developer <span className="eyebrow-year">/ 2026</span></p>
            <h1>Building digital<br /><em>matter</em> that moves.</h1>
            <p className="hero-intro">I&apos;m <strong>Akhand Veer Singh</strong> — a full-stack developer turning ambitious ideas into precise, expressive software.</p>
            <a className="text-link" href="#work">Explore the archive <span>↘</span></a>
          </div>

          <div className="orbital-stage">
            <span className="stage-label label-top">SYSTEM / 001</span>
            <span className="stage-label label-bottom">CREATIVE<br />ENGINEERING</span>
          </div>

          <div className="scroll-note"><span className="scroll-line" /> Scroll to descend</div>
          <div className="hero-index">A01 <span>INTRODUCTION</span></div>
        </section>

        <section className="manifesto" id="about">
          <p className="section-kicker">/ The point of view</p>
          <div className="manifesto-grid">
            <h2>Code is the<br /><span>material.</span></h2>
            <div className="manifesto-copy">
              <p>I build at the intersection of engineering and intention. The best interfaces don&apos;t just work — they create a sense of place.</p>
              <div className="stat-row"><div><strong>04</strong><span>years building</span></div><div><strong>∞</strong><span>curiosity remaining</span></div></div>
            </div>
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="section-heading"><div><p className="section-kicker">/ Selected transmissions</p><h2>Recent work</h2></div><span className="project-count">03 / 03</span></div>
          <div className="project-list">
            {projects.map((project) => (
              <article className={`project-row ${project.color}`} key={project.number}>
                <span className="project-number">{project.number}</span>
                <div className="project-title"><h3>{project.title}</h3><span>{project.type}</span></div>
                <p>{project.description}</p>
                <span className="project-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="stack-section">
          <p className="section-kicker">/ Current toolkit</p>
          <div className="stack-head"><h2>Many tools.<br /><span>One sharp edge.</span></h2><p>Always learning, currently deep in the elegant brutality of data structures &amp; algorithms.</p></div>
          <div className="capability-list">{capabilities.map((item, index) => <span key={item}><small>0{index + 1}</small>{item}</span>)}</div>
        </section>

        <footer className="footer" id="contact">
          <p className="section-kicker">/ Start a conversation</p>
          <h2>Have a strange,<br /><em>good</em> idea?</h2>
          <a className="email-link" href="mailto:akhandveer@example.com">akhandveer@example.com <span>↗</span></a>
          <div className="footer-bottom"><span>© 2026 Akhand Veer Singh</span><span>Built with intent / Next.js</span><a href="#top">Back to top ↑</a></div>
        </footer>
      </div>
    </main>
  );
}
