"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { play } from "cuelume";

// Approximate boundary polygon of India [lat, lon]
const INDIA_POLYGON: [number, number][] = [
  [35.5, 74.0],
  [37.0, 75.5],
  [35.8, 77.8],
  [34.2, 78.9],
  [32.5, 78.5],
  [30.2, 81.0],
  [28.2, 84.0],
  [27.8, 88.1],
  [27.9, 88.8],
  [26.8, 89.8],
  [26.5, 92.0],
  [28.0, 94.5],
  [29.2, 96.2],
  [27.8, 97.1],
  [25.6, 95.1],
  [23.8, 94.2],
  [22.0, 92.8],
  [23.8, 91.5],
  [25.1, 89.8],
  [22.5, 89.0],
  [21.6, 87.5],
  [19.8, 85.8],
  [17.7, 83.3],
  [15.9, 80.3],
  [13.1, 80.3],
  [10.3, 79.8],
  [8.08, 77.55],
  [9.9, 76.2],
  [12.9, 74.8],
  [15.4, 73.8],
  [19.0, 72.8],
  [20.7, 70.9],
  [22.3, 69.0],
  [23.8, 68.4],
  [24.6, 71.0],
  [27.0, 70.5],
  [30.0, 73.8],
  [32.5, 74.6],
  [35.5, 74.0],
];

// Convert [lat, lon] in degrees to 3D Cartesian vector matching Three.js SphereGeometry UV mapping
function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Compute real-time subsolar point [lat, lon] from current UTC time
function getRealTimeSubsolarPoint(date = new Date()): {
  sunLat: number;
  sunLon: number;
  utcString: string;
} {
  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;

  // Subsolar longitude: at 12:00 UTC the sun is over 0° (Prime Meridian), moving 15° west per hour
  let sunLon = (12 - utcHours) * 15;
  if (sunLon > 180) sunLon -= 360;
  if (sunLon < -180) sunLon += 360;

  // Approximate day of year for solar declination (-23.44° to +23.44°)
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const sunLat =
    -23.44 * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));

  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");

  return {
    sunLat,
    sunLon,
    utcString: `${hh}:${mm} UTC`,
  };
}

export function ThreeArtifact({ light = false }: { light?: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [focusIndia, setFocusIndia] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [telemetry, setTelemetry] = useState({
    lat: "26.85°N",
    lon: "80.95°E",
    sunInfo: "SYNCING SOLAR TERMINATOR...",
  });

  const focusRef = useRef(focusIndia);
  const cloudsRef = useRef(showClouds);

  useEffect(() => {
    focusRef.current = focusIndia;
  }, [focusIndia]);

  useEffect(() => {
    cloudsRef.current = showClouds;
  }, [showClouds]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 265;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Completely pure black space

    // Zoomed out camera so the full globe sits comfortably with black space around it
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.08, 4.95);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Slightly smaller radius for zoomed-out orbital perspective
    const R = 1.24;

    // Load the 5 high-resolution 8K textures from /globe/
    const loader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const configureTex = (tex: THREE.Texture, isColor = true) => {
      tex.anisotropy = maxAnisotropy;
      if (isColor) {
        tex.colorSpace = THREE.SRGBColorSpace;
      }
      return tex;
    };

    const dayTex = configureTex(loader.load("/globe/8k_earth_daymap.jpeg"), true);
    const nightTex = configureTex(loader.load("/globe/8k_earth_nightmap.jpg"), true);
    const cloudsTex = configureTex(loader.load("/globe/8k_earth_clouds.jpeg"), true);
    const normalTex = configureTex(
      loader.load("/globe/8k_earth_normal_map_(0-00-00-00).jpg"),
      false
    );
    const specularTex = configureTex(
      loader.load("/globe/8k_earth_specular_map.png"),
      false
    );

    // Compute real-time sun direction vector in the globe's local coordinate frame
    const initialSolar = getRealTimeSubsolarPoint(new Date());
    const localSunDir = latLonToVec3(
      initialSolar.sunLat,
      initialSolar.sunLon,
      1.0
    ).normalize();

    // 1. Physically-grounded Real-Time Day/Night Earth Shader
    // - Uses local-space normal & position so the solar terminator stays locked to real geographic time as you rotate the globe
    // - Pure white sunlight (no artificial colored lights)
    // - Normal mapping for realistic mountain relief along the day/night terminator
    // - Specular water reflection on the day side
    // - Night city lights appear ONLY on the night hemisphere
    const earthGeo = new THREE.SphereGeometry(R, 96, 96);
    earthGeo.computeTangents();

    const earthUniforms = {
      uDayMap: { value: dayTex },
      uNightMap: { value: nightTex },
      uNormalMap: { value: normalTex },
      uSpecularMap: { value: specularTex },
      uSunDirLocal: { value: localSunDir },
    };

    const earthMat = new THREE.ShaderMaterial({
      uniforms: earthUniforms,
      vertexShader: `
        attribute vec4 tangent;
        varying vec2 vUv;
        varying vec3 vNormalLocal;
        varying vec3 vTangentLocal;
        varying vec3 vBitangentLocal;
        varying vec3 vViewDirWorld;
        varying mat3 vNormalMat;

        void main() {
          vUv = uv;
          vNormalLocal = normalize(normal);
          vTangentLocal = normalize(tangent.xyz);
          vBitangentLocal = normalize(cross(vNormalLocal, vTangentLocal) * tangent.w);
          vNormalMat = normalMatrix;

          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vViewDirWorld = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uDayMap;
        uniform sampler2D uNightMap;
        uniform sampler2D uNormalMap;
        uniform sampler2D uSpecularMap;
        uniform vec3 uSunDirLocal;

        varying vec2 vUv;
        varying vec3 vNormalLocal;
        varying vec3 vTangentLocal;
        varying vec3 vBitangentLocal;
        varying vec3 vViewDirWorld;
        varying mat3 vNormalMat;

        void main() {
          // Sample textures
          vec3 dayColor = texture2D(uDayMap, vUv).rgb;
          vec3 nightColor = texture2D(uNightMap, vUv).rgb;
          float specMask = texture2D(uSpecularMap, vUv).r;

          // Tangent-space normal perturbation in local space
          vec3 mapN = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
          mapN.xy *= 1.35;
          mat3 TBN = mat3(normalize(vTangentLocal), normalize(vBitangentLocal), normalize(vNormalLocal));
          vec3 perturbedNormalLocal = normalize(TBN * mapN);

          // Cosine of angle to real-time Sun
          vec3 sunDir = normalize(uSunDirLocal);
          float sunDot = dot(normalize(vNormalLocal), sunDir);
          float reliefDot = max(0.0, dot(perturbedNormalLocal, sunDir));

          // Smooth twilight terminator (-0.12 to +0.16)
          float dayFactor = smoothstep(-0.12, 0.16, sunDot);
          float nightFactor = 1.0 - smoothstep(-0.14, 0.06, sunDot);

          // Pure white natural solar illumination on the day side
          vec3 litDay = dayColor * (0.08 + 0.98 * reliefDot);

          // Subtle natural solar glint on oceans (only on day side)
          vec3 worldNormal = normalize(vNormalMat * perturbedNormalLocal);
          vec3 worldSun = normalize(vNormalMat * sunDir);
          vec3 halfVec = normalize(worldSun + normalize(vViewDirWorld));
          float spec = pow(max(0.0, dot(worldNormal, halfVec)), 36.0) * specMask * dayFactor;
          litDay += vec3(0.42) * spec;

          // Night side: very dark surface with realistic city lights
          vec3 darkBase = dayColor * 0.025;
          vec3 cityLights = pow(nightColor, vec3(1.15)) * vec3(1.0, 0.86, 0.65) * 1.45;
          vec3 litNight = darkBase + cityLights * nightFactor;

          vec3 finalColor = mix(litNight, litDay, dayFactor);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // 2. Real-Time Day/Night Cloud Layer (bright white in sunlight, dim on the night side)
    const cloudsGeo = new THREE.SphereGeometry(R * 1.011, 80, 80);
    const cloudsMat = new THREE.ShaderMaterial({
      uniforms: {
        uCloudsMap: { value: cloudsTex },
        uSunDirLocal: { value: localSunDir },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormalLocal;
        void main() {
          vUv = uv;
          vNormalLocal = normalize(normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uCloudsMap;
        uniform vec3 uSunDirLocal;
        varying vec2 vUv;
        varying vec3 vNormalLocal;

        void main() {
          float cloudVal = texture2D(uCloudsMap, vUv).r;
          float sunDot = dot(normalize(vNormalLocal), normalize(uSunDirLocal));
          float dayLight = smoothstep(-0.18, 0.22, sunDot);
          float brightness = mix(0.08, 0.92, dayLight);
          gl_FragColor = vec4(vec3(brightness), cloudVal * mix(0.18, 0.52, dayLight));
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);

    // 3. Subtle Neutral White/Silver Atmospheric Limb (no artificial neon blue)
    const atmosphereGeo = new THREE.SphereGeometry(R * 1.065, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.6);
          gl_FragColor = vec4(0.88, 0.91, 0.95, 1.0) * intensity * 0.45;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 4. Crisp White India Border Outline + Coordinate Marker
    const borderPoints = INDIA_POLYGON.map(([lat, lon]) =>
      latLonToVec3(lat, lon, R * 1.014)
    );
    const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const borderMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const indiaBorder = new THREE.Line(borderGeo, borderMat);
    globeGroup.add(indiaBorder);

    // Location Pin on India (26.85°N, 80.95°E)
    const pinPos = latLonToVec3(26.8467, 80.9462, R * 1.02);
    const pinGeo = new THREE.SphereGeometry(0.022, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.copy(pinPos);
    globeGroup.add(pinMesh);

    const ringGeo = new THREE.RingGeometry(0.034, 0.052, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.copy(pinPos.clone().multiplyScalar(1.003));
    ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
    globeGroup.add(ringMesh);

    // Orient globe so India faces the camera on load
    const INDIA_ROT_Y = -2.95;
    const INDIA_ROT_X = 0.34;
    globeGroup.rotation.y = INDIA_ROT_Y;
    globeGroup.rotation.x = INDIA_ROT_X;

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0.0015;
    let pointerOffsetX = 0;
    let pointerOffsetY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      setFocusIndia(false);
      play("tap");
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      pointerOffsetX = ny * 0.14;
      pointerOffsetY = nx * 0.2;

      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        velY = dx * 0.009;
        velX = dy * 0.009;
        globeGroup.rotation.y += velY;
        globeGroup.rotation.x = Math.max(
          -1.15,
          Math.min(1.15, globeGroup.rotation.x + velX)
        );
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 265;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let frame = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      frame++;

      cloudsMesh.visible = cloudsRef.current;

      // Update real-time sun position every ~60 frames
      if (frame % 60 === 1) {
        const solar = getRealTimeSubsolarPoint(new Date());
        const updatedSun = latLonToVec3(solar.sunLat, solar.sunLon, 1.0).normalize();
        earthUniforms.uSunDirLocal.value.copy(updatedSun);

        // Determine whether India (lon ~80.95°E) is currently in day, twilight, or night
        const indiaNormal = latLonToVec3(26.85, 80.95, 1.0).normalize();
        const dotIndia = indiaNormal.dot(updatedSun);
        const phase =
          dotIndia > 0.12
            ? "INDIA: DAYLIGHT"
            : dotIndia > -0.12
            ? "INDIA: TWILIGHT"
            : "INDIA: NIGHT";

        const degLat = Math.round((globeGroup.rotation.x * 180) / Math.PI);
        const degLon = Math.round(((globeGroup.rotation.y * 180) / Math.PI) % 360);

        setTelemetry({
          lat: focusRef.current ? "26.85°N" : `${Math.abs(degLat)}°N`,
          lon: focusRef.current ? "80.95°E" : `${Math.abs(degLon)}°E`,
          sunInfo: `${solar.utcString} · ${phase}`,
        });
      }

      if (!isDragging) {
        if (focusRef.current) {
          const targetY =
            INDIA_ROT_Y + pointerOffsetY + Math.sin(frame * 0.01) * 0.05;
          const targetX = INDIA_ROT_X + pointerOffsetX;
          globeGroup.rotation.y += (targetY - globeGroup.rotation.y) * 0.06;
          globeGroup.rotation.x += (targetX - globeGroup.rotation.x) * 0.06;
        } else {
          globeGroup.rotation.y += velY;
          globeGroup.rotation.x = Math.max(
            -1.15,
            Math.min(1.15, globeGroup.rotation.x + velX)
          );
          velX *= 0.95;
          velY = velY * 0.97 + 0.0015 * 0.03;
        }
      }

      const s = 1 + Math.sin(frame * 0.07) * 0.22;
      ringMesh.scale.set(s, s, s);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      domElem.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
      earthGeo.dispose();
      earthMat.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      borderGeo.dispose();
      borderMat.dispose();
      pinGeo.dispose();
      pinMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      dayTex.dispose();
      nightTex.dispose();
      cloudsTex.dispose();
      normalTex.dispose();
      specularTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-sm border transition-colors ${
        light
          ? "border-black/25 bg-black text-white"
          : "border-white/20 bg-black text-white"
      }`}
    >
      {/* Top header bar */}
      <div className="flex items-center justify-between border-b border-white/15 bg-black px-3 py-1.5 font-mono text-[10px] text-white/75">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          REALTIME_EARTH // SOLAR_TERMINATOR
        </span>
        <span>
          {telemetry.lat} · {telemetry.lon}
        </span>
      </div>

      {/* Pure Black 3D Globe Stage */}
      <div className="relative h-[235px] w-full cursor-grab bg-black active:cursor-grabbing sm:h-[265px]">
        <div ref={mountRef} className="size-full bg-black" />

        <span className="pointer-events-none absolute left-2.5 top-2 font-mono text-[9px] text-white/50">
          DRAG TO ORBIT · LIVE DAY/NIGHT TERMINATOR
        </span>

        <div className="absolute right-2.5 top-2 flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setFocusIndia(true);
              play("select");
            }}
            className={`rounded-[2px] border px-1.5 py-0.5 font-mono text-[9px] transition-colors ${
              focusIndia
                ? "border-white bg-white text-black font-semibold"
                : "border-white/25 bg-black/80 text-white hover:bg-white hover:text-black"
            }`}
          >
            INDIA
          </button>
          <button
            type="button"
            onClick={() => {
              setShowClouds((v) => !v);
              play("select");
            }}
            className={`rounded-[2px] border px-1.5 py-0.5 font-mono text-[9px] transition-colors ${
              showClouds
                ? "border-white/60 bg-white/15 text-white"
                : "border-white/20 bg-black/80 text-white/60"
            }`}
          >
            CLOUDS
          </button>
        </div>
      </div>

      {/* Bottom telemetry bar */}
      <div className="flex items-center justify-between border-t border-white/15 bg-black px-3 py-2 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-white" />
          <span className="font-semibold">{telemetry.sunInfo}</span>
        </div>
        <span className="font-semibold text-emerald-400">● REAL-TIME SYNC</span>
      </div>
    </div>
  );
}
