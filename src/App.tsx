/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Layers,
  Info,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Radio,
  Cpu,
  Orbit,
  ArrowLeft,
  Maximize2
} from 'lucide-react';
import {
  celestialObjects,
  CelestialObject,
  PlanetLayer
} from './data/spaceData';
import {
  createEarthTexture,
  createCloudsTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingsTexture,
  createMercuryTexture,
  createVenusTexture,
  createIceGiantTexture,
  createSunTexture,
  createMoonTexture
} from './utils/textureGenerator';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [selectedID, setSelectedID] = useState<string | null>(null);
  const [currentLayerIndex, setCurrentLayerIndex] = useState<number>(0);
  const [orbitSpeedFactor, setOrbitSpeedFactor] = useState<number>(1.0);
  const [useHolographicLights, setUseHolographicLights] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hoveredID, setHoveredID] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'telemetry' | 'composition'>('info');
  const [scanTelemetry, setScanTelemetry] = useState<string[]>([
    'SPECTROMETRY: Scanner locked to background stars.',
    'TECTONIC PROBE: Grid initialized.'
  ]);

  // AI Helper States
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Cosmic Guidance Unit (CGU-35) online. I am at your service to analyze planetary boundaries, deep composition, and outer solar architectures.' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humOsc1 = useRef<OscillatorNode | null>(null);
  const humGain = useRef<GainNode | null>(null);

  // ThreeJS Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetMeshesRef = useRef<{ [key: string]: THREE.Group }>({});
  const orbitLinesRef = useRef<{ [key: string]: THREE.Line }>({});
  const labelSpritesRef = useRef<{ [key: string]: HTMLDivElement }>({});
  const clippingPlanesRef = useRef<{ [key: string]: THREE.Plane }>({});
  const clipPlaneConstantsRef = useRef<{ [key: string]: number }>({});

  // Animation values tracked in refs to prevent state re-draw re-instantiation
  const orbitAngles = useRef<{ [key: string]: number }>({
    mercury: Math.random() * Math.PI * 2,
    venus: Math.random() * Math.PI * 2,
    earth: Math.random() * Math.PI * 2,
    mars: Math.random() * Math.PI * 2,
    jupiter: Math.random() * Math.PI * 2,
    saturn: Math.random() * Math.PI * 2,
  });

  // Smooth camera system state variables
  const cameraState = useRef({
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    currentX: 0,
    currentY: 0,
    currentZ: 0,

    theta: 0.8, // Horizontal orbit angle
    phi: Math.PI / 2.3, // Vertical inclination angle
    distance: 140, // Distance to focus

    targetTheta: 0.8,
    targetPhi: Math.PI / 2.3,
    targetDistance: 140,
  });

  const previousMousePosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  // Retrieve selected celestial object details
  const activeObject = useMemo(() => {
    return celestialObjects.find(o => o.id === selectedID) || null;
  }, [selectedID]);

  // Active layer representation
  const activeLayer = useMemo<PlanetLayer | null>(() => {
    if (!activeObject) return null;
    return activeObject.layers[currentLayerIndex] || activeObject.layers[0];
  }, [activeObject, currentLayerIndex]);

  // Handle Mute/Audio toggle
  useEffect(() => {
    if (isMuted) {
      if (humGain.current && audioCtxRef.current) {
        humGain.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.5);
      }
    } else {
      initAudioEngine();
      if (humGain.current && audioCtxRef.current) {
        humGain.current.gain.linearRampToValueAtTime(0.07, audioCtxRef.current.currentTime + 0.5);
      }
    }
  }, [isMuted]);

  // Synthesize sound effects via Web Audio API
  const initAudioEngine = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Immersive background space drone hum
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // Low A hum
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(55.3, ctx.currentTime); // Beating detune

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      humOsc1.current = osc1;
      humGain.current = gain;
    } catch (e) {
      console.warn('Audio Context creation failed', e);
    }
  };

  const playSynthBeep = (freq: number = 600, dur: number = 0.08) => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + dur);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {
      // Ignored
    }
  };

  // Add random scifi jargon on telemetry updates
  useEffect(() => {
    if (selectedID) {
      const messages = [
        `SCANNER STATE: Inspecting Core Density of ${activeObject?.name}...`,
        `THERMOGRAPHY: Temperature calibrated: ${activeObject?.temperature}`,
        `GRAVITY ENGINE: Local pull coefficient of ${activeObject?.gravity}`,
        `ATMOSPHERE SECTOR: Multiwave carbon-nitrogen grid locked.`,
        `ROTATIONAL COEFFICIENT: Angular speed clocked at ${activeObject?.rotationSpeed}`,
        `SPECTRAL CLASSIFICATION: Target locks in group "${activeObject?.class}"`
      ];
      setScanTelemetry(messages);
      playSynthBeep(450, 0.12);
    } else {
      setScanTelemetry([
        'SPECTROMETRY: Widefield scanner locked to background stars.',
        'TECTONIC PROBE: Background grids active in standard status.'
      ]);
      playSynthBeep(320, 0.15);
    }
  }, [selectedID, currentLayerIndex, activeObject]);

  // Zoom to celestial object or back to orbital overview
  const selectCelestial = (id: string | null) => {
    setSelectedID(id);
    setCurrentLayerIndex(0);

    if (id) {
      const selectedObj = celestialObjects.find(o => o.id === id);
      if (selectedObj) {
        // Find 3D geometry target
        const group = planetMeshesRef.current[id];
        if (group) {
          cameraState.current.targetX = group.position.x;
          cameraState.current.targetY = group.position.y;
          cameraState.current.targetZ = group.position.z;
        }

        // Setup custom framing zoom from layer data
        const l0Settings = selectedObj.layers[0].visualSettings;
        cameraState.current.targetDistance = selectedObj.radius * l0Settings.targetZoom;
        cameraState.current.targetPhi = Math.PI / 2.3; // Angle downwards a bit
      }
    } else {
      // Return to full overview
      cameraState.current.targetX = 0;
      cameraState.current.targetY = 0;
      cameraState.current.targetZ = 0;
      cameraState.current.targetDistance = 150;
      cameraState.current.targetPhi = Math.PI / 3; // Broader high-angle overview
    }
  };

  // AI Companion Chat Handlers
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    playSynthBeep(650, 0.05);

    const updatedMessages = [...chatMessages, { role: 'user' as const, text: userMessage }];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/helper/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: updatedMessages.slice(0, -1),
          currentPlanet: activeObject ? activeObject.name : "Solar System View",
          currentLayer: activeLayer ? `Layer ${activeLayer.id} - ${activeLayer.title}` : "None"
        })
      });

      if (!response.ok) throw new Error("Transmission failed");
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'model' as const, text: data.text }]);
      playSynthBeep(850, 0.07);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model' as const, text: "Error: Quantum signal interrupted. Please retry link." }]);
      playSynthBeep(300, 0.15);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickProbe = async (promptText: string) => {
    if (isChatLoading) return;
    playSynthBeep(650, 0.05);

    const updatedMessages = [...chatMessages, { role: 'user' as const, text: promptText }];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/helper/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          history: updatedMessages.slice(0, -1),
          currentPlanet: activeObject ? activeObject.name : "Solar System View",
          currentLayer: activeLayer ? `Layer ${activeLayer.id} - ${activeLayer.title}` : "None"
        })
      });

      if (!response.ok) throw new Error("Transmission failed");
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'model' as const, text: data.text }]);
      playSynthBeep(850, 0.07);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model' as const, text: "Error: Quantum signal interrupted. Please check link." }]);
      playSynthBeep(300, 0.15);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Initialize Three.js Space Engine
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // 3. Renderer with antialiasing
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true; // Support geological clipping / splits
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    // Dynamic solar illumination source - Sunlight radiates from center outwards
    const sunLight = new THREE.PointLight(0xfff8ee, 2.5, 300, 0.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Subtle atmospheric glowing secondary lights above to fill shadows when holographic is ON
    const holoLight = new THREE.DirectionalLight(0xa5f3fc, 0.4);
    holoLight.position.set(0, 100, 0);
    scene.add(holoLight);

    // 5. Stars Skybox / Starfield Grid
    const starCount = 3000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Scatter stars broadly
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 250 + Math.random() * 150; // Vast sphere radius

      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);

      // Star heat coloration (blue-white, bright orange, bright yellow)
      const colorVal = Math.random();
      if (colorVal > 0.85) {
        starColors[i] = 0.7; starColors[i + 1] = 0.9; starColors[i + 2] = 1.0; // Shimmer Blue
      } else if (colorVal > 0.7) {
        starColors[i] = 1.0; starColors[i + 1] = 0.8; starColors[i + 2] = 0.6; // Redward
      } else {
        starColors[i] = 1.0; starColors[i + 1] = 1.0; starColors[i + 2] = 1.0; // Standard White
      }
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(starfield);

    // 6. Build Celestial Bodies
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

    celestialObjects.forEach(obj => {
      const group = new THREE.Group();
      group.name = obj.id;

      // 3D positioning
      if (obj.id === 'sun') {
        group.position.set(0, 0, 0);
      } else if (obj.type === 'star') {
        // Fixed distant star position
        group.position.set(
          obj.id === 'sirius' ? 120 : obj.id === 'proxima' ? 80 : -100,
          obj.id === 'sirius' ? -15 : obj.id === 'proxima' ? 20 : -10,
          obj.id === 'sirius' ? -90 : obj.id === 'proxima' ? -20 : -80
        );
      } else {
        // Initial orbital placements
        const initialAngle = orbitAngles.current[obj.id] || 0;
        // Simulated slight inclination plane
        const incRad = (obj.distFromSun * 0.05 * Math.PI) / 180;
        group.position.set(
          Math.cos(initialAngle) * obj.distFromSun,
          Math.sin(initialAngle) * obj.distFromSun * Math.sin(incRad),
          Math.sin(initialAngle) * obj.distFromSun
        );
      }

      // Procedural surface texture loading
      let material: THREE.Material;
      const coreProps = {
        roughness: 0.8,
        metalness: 0.1,
      };

      const planetaryMaterials: THREE.Material[] = [];

      if (obj.id === 'sun') {
        const texture = createSunTexture('#ffa300', '#ff2a00');
        material = new THREE.MeshBasicMaterial({ map: texture });
      } else if (obj.id === 'earth') {
        const earthText = createEarthTexture();
        material = new THREE.MeshStandardMaterial({
          map: earthText,
          roughness: 0.4,
          metalness: 0.2,
        });

        // Add cloud mesh revolving around Earth
        const cloudText = createCloudsTexture();
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudText,
          transparent: true,
          blending: THREE.NormalBlending,
          opacity: 0.45,
          depthWrite: false,
        });
        planetaryMaterials.push(cloudMat);
        const cloudsMesh = new THREE.Mesh(new THREE.SphereGeometry(obj.radius * 1.04, 32, 32), cloudMat);
        cloudsMesh.name = 'clouds';
        group.add(cloudsMesh);

        // Add Moon
        const moonText = createMoonTexture();
        const moonMat = new THREE.MeshStandardMaterial({ map: moonText, roughness: 0.8 });
        const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(obj.radius * 0.22, 16, 16), moonMat);
        moonMesh.name = 'moon';
        moonMesh.position.set(obj.radius * 2.8, obj.radius * 0.3, 0);
        group.add(moonMesh);

      } else if (obj.id === 'mars') {
        const marsText = createMarsTexture();
        material = new THREE.MeshStandardMaterial({ map: marsText, ...coreProps });
      } else if (obj.id === 'jupiter') {
        const jupiterText = createJupiterTexture();
        material = new THREE.MeshStandardMaterial({ map: jupiterText, roughness: 0.9, metalness: 0.05 });
      } else if (obj.id === 'saturn') {
        const saturnText = createSaturnTexture();
        material = new THREE.MeshStandardMaterial({ map: saturnText, ...coreProps });

        // Build flat concentric Saturn rings
        const ringText = createSaturnRingsTexture();
        const ringGeo = new THREE.RingGeometry(obj.radius * 1.4, obj.radius * 2.8, 64);
        
        // Ring mapping coordinates UV adjustments
        const pos = ringGeo.attributes.position;
        const uv = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const vertex = new THREE.Vector3().fromBufferAttribute(pos, i);
          const dist = vertex.length();
          const normDist = (dist - obj.radius * 1.4) / (obj.radius * 1.4);
          uv.setXY(i, normDist, 0.5);
        }
        
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringText,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        planetaryMaterials.push(ringMat);
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.name = 'ring';
        ringMesh.rotation.x = Math.PI / 2.3; // Tilted ring system
        group.add(ringMesh);

      } else if (obj.id === 'mercury') {
        const text = createMercuryTexture();
        material = new THREE.MeshStandardMaterial({ map: text, ...coreProps });
      } else if (obj.id === 'venus') {
        const text = createVenusTexture();
        material = new THREE.MeshStandardMaterial({ map: text, roughness: 0.9 });
      } else if (obj.id === 'sirius') {
        // Sirius bright plasma texture
        const text = createSunTexture('#90e0ef', '#0077b6');
        material = new THREE.MeshBasicMaterial({ map: text });
      } else if (obj.id === 'proxima') {
        // Crimson plasma red dwarf
        const text = createSunTexture('#ff4d4d', '#7209b7');
        material = new THREE.MeshBasicMaterial({ map: text });
      } else if (obj.id === 'alpha') {
        // Gold plasma
        const text = createSunTexture('#ffca3a', '#ff5400');
        material = new THREE.MeshBasicMaterial({ map: text });
      } else {
        // Uranus & Neptune
        const text = createIceGiantTexture(obj.id === 'neptune');
        material = new THREE.MeshStandardMaterial({ map: text, ...coreProps });
      }

      planetaryMaterials.push(material);

      // Base planetary core body
      const corePivot = new THREE.Group();
      corePivot.name = 'corePivot';

      const coreMesh = new THREE.Mesh(sphereGeo.clone(), material);
      coreMesh.name = 'primaryCrust';
      coreMesh.scale.set(obj.radius, obj.radius, obj.radius);
      corePivot.add(coreMesh);

      // --- INTERNAL ANATOMY SPHERES (Hidden initially, triggered on Layer 3 / 4 Slices) ---
      // 1. Convective Mantle Spheroid
      const mantleMat = new THREE.MeshStandardMaterial({
        color: obj.type === 'star' ? 0xff4500 : 0xd35400,
        emissive: obj.type === 'star' ? 0xcc3300 : 0xe67e22,
        roughness: 0.9,
      });
      planetaryMaterials.push(mantleMat);
      const mantleMesh = new THREE.Mesh(sphereGeo.clone(), mantleMat);
      mantleMesh.name = 'mantleSlice';
      mantleMesh.scale.set(obj.radius * 0.72, obj.radius * 0.72, obj.radius * 0.72);
      mantleMesh.visible = false;
      corePivot.add(mantleMesh);

      // 2. Churning Liquid Outer Core Spheroid
      const outerCoreMat = new THREE.MeshStandardMaterial({
        color: obj.type === 'star' ? 0xffcc00 : 0xf1c40f,
        emissive: obj.type === 'star' ? 0xffaa00 : 0xf39c12,
        roughness: 0.1,
        metalness: 0.9,
      });
      planetaryMaterials.push(outerCoreMat);
      const outerCoreMesh = new THREE.Mesh(sphereGeo.clone(), outerCoreMat);
      outerCoreMesh.name = 'outerCoreSlice';
      outerCoreMesh.scale.set(obj.radius * 0.44, obj.radius * 0.44, obj.radius * 0.44);
      outerCoreMesh.visible = false;
      corePivot.add(outerCoreMesh);

      // 3. Ultra-Dense Glowing Solid Inner Core Spheroid
      const innerCoreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      planetaryMaterials.push(innerCoreMat);
      const innerCoreMesh = new THREE.Mesh(sphereGeo.clone(), innerCoreMat);
      innerCoreMesh.name = 'innerCoreSlice';
      innerCoreMesh.scale.set(obj.radius * 0.22, obj.radius * 0.22, obj.radius * 0.22);
      innerCoreMesh.visible = false;
      corePivot.add(innerCoreMesh);

      // Glow corona atmosphere ring
      const coronaMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(obj.color),
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      planetaryMaterials.push(coronaMat);
      const coronaMesh = new THREE.Mesh(sphereGeo.clone(), coronaMat);
      coronaMesh.name = 'coronaHalo';
      coronaMesh.scale.set(obj.radius * 1.25, obj.radius * 1.25, obj.radius * 1.25);
      group.add(coronaMesh);

      // Create local clipping plane for peeling / split sections
      const clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), obj.radius * 2.0);
      clippingPlanesRef.current[obj.id] = clipPlane;

      planetaryMaterials.forEach(m => {
        m.clippingPlanes = [clipPlane];
        m.clipShadows = true;
      });

      group.add(corePivot);
      scene.add(group);
      planetMeshesRef.current[obj.id] = group;

      // Draw Orbit Line tracks for planets
      if (obj.type === 'planet') {
        const orbitGeo = new THREE.BufferGeometry();
        const orbitPoints = [];
        const segments = 120;
        const incRad = (obj.distFromSun * 0.05 * Math.PI) / 180;

        for (let j = 0; j <= segments; j++) {
          const theta = (j / segments) * Math.PI * 2;
          orbitPoints.push(
            new THREE.Vector3(
              Math.cos(theta) * obj.distFromSun,
              Math.sin(theta) * obj.distFromSun * Math.sin(incRad),
              Math.sin(theta) * obj.distFromSun
            )
          );
        }
        orbitGeo.setFromPoints(orbitPoints);

        const orbitMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(obj.color).multiplyScalar(0.55),
          transparent: true,
          opacity: 0.35,
        });

        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        scene.add(orbitLine);
        orbitLinesRef.current[obj.id] = orbitLine;
      }
    });

    // Resize Observer for fluid responsiveness without stretching
    const rObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;

      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    });
    rObserver.observe(containerRef.current);

    // Initial setup
    if (rendererRef.current && containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    // Dynamic rendering calculation loops
    let animationId: number;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const runSpeedMod = orbitSpeedFactor;

      // 1. Update Planets positions along their elliptic plane
      celestialObjects.forEach(obj => {
        const group = planetMeshesRef.current[obj.id];
        if (!group) return;

        // Axels spinning
        const pivot = group.getObjectByName('corePivot');
        if (pivot) {
          pivot.rotation.y += obj.rotationSpeed * (activeLayer?.visualSettings.rotationSpeedFactor || 1);
        }

        // Subordinate animations
        const moon = group.getObjectByName('moon');
        if (moon) {
          moon.rotation.y += 0.01;
          const moonAngle = clock.getElapsedTime() * 0.95;
          moon.position.set(
            Math.cos(moonAngle) * obj.radius * 2.8,
            0,
            Math.sin(moonAngle) * obj.radius * 2.8
          );
        }

        const clouds = group.getObjectByName('clouds');
        if (clouds) {
          clouds.rotation.y += obj.rotationSpeed * 1.3; // Clouds spin faster than planet beneath
        }

        // Increment orbits (halt orbit revolution if in inspection, or make slow)
        if (obj.type === 'planet') {
          // Slow orbit during inspection to prevent fast camera jitter, keep standard for others
          const speedDampMultiplier = selectedID ? 0.05 : 1.0;
          const currentAngle = (orbitAngles.current[obj.id] || 0) + obj.orbitSpeed * runSpeedMod * speedDampMultiplier * 0.2;
          orbitAngles.current[obj.id] = currentAngle;

          const incRad = (obj.distFromSun * 0.05 * Math.PI) / 180;
          group.position.set(
            Math.cos(currentAngle) * obj.distFromSun,
            Math.sin(currentAngle) * obj.distFromSun * Math.sin(incRad),
            Math.sin(currentAngle) * obj.distFromSun
          );
        }

        // Force update world matrix to let local clipping planes compute correctly using matrixWorld
        group.updateMatrixWorld(true);
      });

      // 2. Dynamically Adjust Internal Cutaway Materials and Core States
      celestialObjects.forEach(obj => {
        const group = planetMeshesRef.current[obj.id];
        if (!group) return;

        const primaryCrust = group.getObjectByName('primaryCrust') as THREE.Mesh;
        const mantle = group.getObjectByName('mantleSlice') as THREE.Mesh;
        const outerCore = group.getObjectByName('outerCoreSlice') as THREE.Mesh;
        const innerCore = group.getObjectByName('innerCoreSlice') as THREE.Mesh;
        const clouds = group.getObjectByName('clouds') as THREE.Mesh;
        const corona = group.getObjectByName('coronaHalo') as THREE.Mesh;

        // Is this the selected object being scrutinized?
        const isSelected = selectedID === obj.id;

        if (isSelected && activeLayer) {
          const vis = activeLayer.visualSettings;

          // Slide lighting mode based on user toggle override
          const mat = primaryCrust?.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.transparent = true;
            
            // Crust fade on Layer 3 (Anatomy) and Layer 4 (Core Theory)
            const targetOpacity = vis.showCrust ? 1.0 : 0.15;
            mat.opacity += (targetOpacity - mat.opacity) * 0.09;
            mat.roughness = useHolographicLights ? 0.1 : 0.45;
            mat.metalness = useHolographicLights ? 0.95 : 0.15;
          }

          if (corona) {
            corona.visible = vis.showAtmosphere;
            const targetCoronaScale = obj.radius * (vis.showAtmosphere ? 1.25 : 0.01);
            corona.scale.set(
              corona.scale.x + (targetCoronaScale - corona.scale.x) * 0.09,
              corona.scale.y + (targetCoronaScale - corona.scale.y) * 0.09,
              corona.scale.z + (targetCoronaScale - corona.scale.z) * 0.09
            );
          }

          if (clouds) {
            clouds.visible = vis.showAtmosphere;
          }

          // Toggle internal layers visible status
          if (mantle) {
            const targetMScale = vis.showInternal ? obj.radius * 0.72 : 0.001;
            const nextScale = mantle.scale.x + (targetMScale - mantle.scale.x) * 0.09;
            mantle.scale.set(nextScale, nextScale, nextScale);
            mantle.visible = vis.showInternal || mantle.scale.x > 0.05;
          }

          if (outerCore) {
            const targetOCScale = vis.showInternal ? obj.radius * 0.48 : 0.001;
            const nextScale = outerCore.scale.x + (targetOCScale - outerCore.scale.x) * 0.09;
            outerCore.scale.set(nextScale, nextScale, nextScale);
            outerCore.visible = vis.showInternal || outerCore.scale.x > 0.05;
          }

          if (innerCore) {
            const targetICScale = vis.showInternal ? obj.radius * 0.25 : 0.001;
            const nextScale = innerCore.scale.x + (targetICScale - innerCore.scale.x) * 0.09;
            innerCore.scale.set(nextScale, nextScale, nextScale);
            innerCore.visible = vis.showInternal || innerCore.scale.x > 0.05;
          }

          // Rotate inner cores relative to outer crust showing differential core motion
          if (vis.showInternal && mantle && outerCore) {
            mantle.rotation.y += 0.01;
            outerCore.rotation.y -= 0.015;
          }

          // Animate peeling/split geological slice
          const clipPlane = clippingPlanesRef.current[obj.id];
          if (clipPlane) {
            let localConst = clipPlaneConstantsRef.current[obj.id] ?? (obj.radius * 2.0);
            const targetConstant = vis.showInternal ? 0 : obj.radius * 2.0;
            localConst += (targetConstant - localConst) * 0.09;
            clipPlaneConstantsRef.current[obj.id] = localConst;

            const localPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), localConst);
            clipPlane.copy(localPlane).applyMatrix4(group.matrixWorld);
          }

        } else {
          // Object is in overview mode / non-selected. Reset to solid outer shell opacity and closed plane
          if (primaryCrust) {
            const mat = primaryCrust.material as THREE.MeshStandardMaterial;
            if (mat) {
              mat.transparent = false;
              mat.opacity = 1.0;
            }
          }
          if (clouds) {
            clouds.visible = true;
          }
          if (corona) {
            corona.visible = true;
            corona.scale.set(obj.radius * 1.2, obj.radius * 1.2, obj.radius * 1.2);
          }
          if (mantle) {
            mantle.visible = false;
            mantle.scale.set(0.001, 0.001, 0.001);
          }
          if (outerCore) {
            outerCore.visible = false;
            outerCore.scale.set(0.001, 0.001, 0.001);
          }
          if (innerCore) {
            innerCore.visible = false;
            innerCore.scale.set(0.001, 0.001, 0.001);
          }
          const clipPlane = clippingPlanesRef.current[obj.id];
          if (clipPlane) {
            clipPlaneConstantsRef.current[obj.id] = obj.radius * 2.0;
            const localPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), obj.radius * 2.0);
            clipPlane.copy(localPlane).applyMatrix4(group.matrixWorld);
          }
        }
      });

      // 3. Cinematic Camera Target Tracking & Interpolation math
      if (selectedID) {
        // Find moving target coordinates
        const activeGroup = planetMeshesRef.current[selectedID];
        if (activeGroup) {
          cameraState.current.targetX = activeGroup.position.x;
          cameraState.current.targetY = activeGroup.position.y;
          cameraState.current.targetZ = activeGroup.position.z;
        }
      }

      // Smooth buttery interpolation (Lag smoothing multiplier)
      cameraState.current.currentX += (cameraState.current.targetX - cameraState.current.currentX) * 0.08;
      cameraState.current.currentY += (cameraState.current.targetY - cameraState.current.currentY) * 0.08;
      cameraState.current.currentZ += (cameraState.current.targetZ - cameraState.current.currentZ) * 0.08;

      cameraState.current.theta += (cameraState.current.targetTheta - cameraState.current.theta) * 0.08;
      cameraState.current.phi += (cameraState.current.targetPhi - cameraState.current.phi) * 0.08;
      cameraState.current.distance += (cameraState.current.targetDistance - cameraState.current.distance) * 0.08;

      // Translate spherical orbital coordinates to 3D Descartes vector
      const cx = cameraState.current.currentX + cameraState.current.distance * Math.sin(cameraState.current.phi) * Math.cos(cameraState.current.theta);
      const cy = cameraState.current.currentY + cameraState.current.distance * Math.cos(cameraState.current.phi);
      const cz = cameraState.current.currentZ + cameraState.current.distance * Math.sin(cameraState.current.phi) * Math.sin(cameraState.current.theta);

      camera.position.set(cx, cy, cz);
      camera.lookAt(
        cameraState.current.currentX,
        cameraState.current.currentY,
        cameraState.current.currentZ
      );

      // Render the current scene pipeline
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(tick);
    };

    tick();

    // Cleanup resources
    return () => {
      cancelAnimationFrame(animationId);
      rObserver.disconnect();
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      sphereGeo.dispose();
    };
  }, [orbitSpeedFactor, selectedID, useHolographicLights]);

  // Click Raycaster handler for 3D clicks inside Three Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // Get click bounding rect coordinates
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    // Filter objects to click
    const intersectTargets: THREE.Object3D[] = [];
    celestialObjects.forEach(obj => {
      const g = planetMeshesRef.current[obj.id];
      if (g) {
        const bodyMesh = g.getObjectByName('primaryCrust');
        if (bodyMesh) intersectTargets.push(bodyMesh);
      }
    });

    const intersects = raycaster.intersectObjects(intersectTargets);
    if (intersects.length > 0) {
      // Traverse up to find group ID naming match
      let hitObj = intersects[0].object;
      while (hitObj.parent && !celestialObjects.some(o => o.id === hitObj.name)) {
        hitObj = hitObj.parent;
      }
      if (celestialObjects.some(o => o.id === hitObj.name)) {
        selectCelestial(hitObj.name);
      }
    }
  };

  // Keyboard navigation & drag coordinates modifiers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // If hovering, check raycasting target to update tooltip status
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const checkTargets: THREE.Object3D[] = [];
    celestialObjects.forEach(obj => {
      const g = planetMeshesRef.current[obj.id];
      if (g) {
        const b = g.getObjectByName('primaryCrust');
        if (b) checkTargets.push(b);
      }
    });

    const intersects = raycaster.intersectObjects(checkTargets);
    if (intersects.length > 0) {
      let hit = intersects[0].object;
      while (hit.parent && !celestialObjects.some(o => o.id === hit.name)) {
        hit = hit.parent;
      }
      setHoveredID(hit.name);
    } else {
      setHoveredID(null);
    }

    // Drag rotation
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    cameraState.current.targetTheta -= deltaX * 0.006;
    cameraState.current.targetPhi -= deltaY * 0.006;

    // Clamp camera poles to prevent inversion
    cameraState.current.targetPhi = Math.max(0.12, Math.min(Math.PI - 0.12, cameraState.current.targetPhi));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomDelta = e.deltaY * 0.12;
    const minD = selectedID ? activeObject!.radius * 1.8 : 30;
    const maxD = selectedID ? activeObject!.radius * 40 : 420;

    cameraState.current.targetDistance = Math.max(
      minD,
      Math.min(maxD, cameraState.current.targetDistance + zoomDelta)
    );
  };

  return (
    <div id="app" className="relative w-full h-screen overflow-hidden text-slate-350 font-sans select-none tracking-normal antialiased bg-[#020408]">
      {/* 3D background WebGL Canvas */}
      <div
        ref={containerRef}
        id="canvas-container"
        className="absolute inset-0 w-full h-full bg-[#020408] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="absolute inset-0 w-full h-full block"
        />
      </div>

      {/* GLOWING AMBIENT SPACE GRID GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* TOP HEADERS AND LOGO AREA */}
      <header id="hud-header" className="relative z-20 p-6 flex justify-between items-start border-b border-white/5 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div id="agency-brand" className="pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/5 backdrop-blur-md px-5 py-3 rounded-none shadow-2xl transition hover:border-cyan-500/30">
          <div className="w-1.5 h-8 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <div>
            <h1 className="text-lg font-light tracking-[0.2em] text-white uppercase">COSMIC LAYERS <span className="font-bold text-cyan-400">EXPLORER</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">Scientific Simulation Mode • Active Sector: Solaris-01</p>
          </div>
        </div>

        {/* Global overview navigation indicators */}
        <div className="pointer-events-auto flex items-center gap-4">
          {selectedID && (
            <div className="text-right hidden md:block">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Focus Target</p>
              <p className="text-sm font-light text-cyan-100 uppercase tracking-widest">{activeObject?.name}</p>
            </div>
          )}

          {selectedID && (
            <button
              id="back-solar-btn"
              onClick={() => selectCelestial(null)}
              className="px-4 py-2 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400 bg-black/45 backdrop-blur-md rounded-none text-[10px] tracking-widest font-light uppercase text-slate-300 transition cursor-pointer flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
              Return to Solar System
            </button>
          )}

          <button
            id="ai-helper-btn"
            onClick={() => {
              setIsChatOpen(!isChatOpen);
              playSynthBeep(600, 0.05);
            }}
            className={`px-4 py-2 border backdrop-blur-md rounded-none text-[10px] tracking-widest font-light uppercase transition cursor-pointer flex items-center gap-2 ${
              isChatOpen
                ? 'border-cyan-400 bg-cyan-950/40 text-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400 bg-black/45 text-slate-300'
            }`}
            title="Toggle AI Companion (CGU-35)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI COMPANION</span>
          </button>

          <button
            id="sound-toggle-btn"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 bg-black/45 border border-white/10 backdrop-blur-md rounded-none text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition cursor-pointer"
            title={isMuted ? 'Unmute space soundscapes' : 'Mute soundscapes'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
          </button>
        </div>
      </header>

      {/* OVERVIEW SYSTEM SELECTOR LIST - visible in solar system overview */}
      {!selectedID && (
        <div id="orbit-selection-scroller" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/60 border border-white/10 backdrop-blur-xl p-3 rounded-none flex gap-1.5 max-w-[92vw] overflow-x-auto shadow-2xl scrollbar-none">
          {celestialObjects.map(obj => {
            const isTarget = hoveredID === obj.id;
            return (
              <button
                key={obj.id}
                id={`sel-${obj.id}`}
                onClick={() => selectCelestial(obj.id)}
                className={`px-4 py-2 rounded-none text-[11px] font-mono whitespace-nowrap uppercase tracking-wider transition relative border flex flex-col justify-center gap-0.5 cursor-pointer min-w-[100px] ${
                  isTarget
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-100'
                    : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: obj.color }} />
                  <span className="font-bold">{obj.name}</span>
                </div>
                <span className="text-[9px] text-slate-500 font-normal pl-3.5">{obj.type}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3D FLOATING SCENE TOOLTIP OVERLAYS */}
      {hoveredID && !selectedID && (
        <div
          id="orbit-float-tooltip"
          className="absolute pointer-events-none z-30 px-3 py-2 bg-black/80 border border-cyan-500/40 rounded-none shadow-2xl backdrop-blur-md"
          style={{
            left: `${window.innerWidth / 2}px`,
            top: `${window.innerHeight / 2 - 50}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: celestialObjects.find(o => o.id === hoveredID)?.color }} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{celestialObjects.find(o => o.id === hoveredID)?.name}</h4>
          </div>
          <p className="text-[9px] text-cyan-400 font-mono mt-0.5 uppercase tracking-widest">CLICK BODY TO INSPECT</p>
        </div>
      )}

      {/* INTERACTIVE COMPREHENSIVE FOCUSED OVERLAY SECTORS */}
      {selectedID && activeObject && activeLayer && (
        <>
          {/* LEFT METEOROLOGICAL / STELLAR DETAILS PANEL */}
          <section
            id="stellar-telemetry-panel"
            className="absolute left-6 top-24 bottom-24 w-[385px] z-20 bg-black/50 backdrop-blur-xl border border-white/10 border-l-4 border-l-cyan-500 rounded-none flex flex-col shadow-2xl overflow-hidden transition-all duration-300 hover:border-cyan-500/40 text-slate-300"
          >
            {/* Header Identity banner */}
            <div className="p-5 border-b border-white/5 bg-black/40">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-mono border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 rounded-none uppercase tracking-wider">
                    {activeObject.class}
                  </span>
                  <h2 className="text-2xl font-bold uppercase tracking-wide mt-2 text-white flex items-center gap-2">
                    {activeObject.name}
                  </h2>
                </div>
                <button
                  onClick={() => selectCelestial(null)}
                  className="p-1.5 bg-white/5 border border-white/5 hover:border-cyan-500/45 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition cursor-pointer rounded-none"
                  title="Close inspection"
                >
                  <Maximize2 className="w-3.5 h-3.5 rotate-45" />
                </button>
              </div>
            </div>

            {/* TAB SYSTEM TILT */}
            <div className="flex border-b border-white/5 text-xs font-mono bg-black/25">
              <button
                onClick={() => { setActiveTab('info'); playSynthBeep(650, 0.05); }}
                className={`flex-1 py-3 text-center border-b transition rounded-none ${
                  activeTab === 'info'
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                LAYER SUMMARY
              </button>
              <button
                onClick={() => { setActiveTab('telemetry'); playSynthBeep(650, 0.05); }}
                className={`flex-1 py-3 text-center border-b transition rounded-none ${
                  activeTab === 'telemetry'
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                CORE METRICS
              </button>
              <button
                onClick={() => { setActiveTab('composition'); playSynthBeep(650, 0.05); }}
                className={`flex-1 py-3 text-center border-b transition rounded-none ${
                  activeTab === 'composition'
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                COMPOSITION
              </button>
            </div>

            {/* Dynamic scrollable core body info container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin bg-black/10">
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      Layer {activeLayer.id} • {activeLayer.title}
                    </h3>
                    <p className="text-sm font-semibold text-white uppercase mt-1">
                      {activeLayer.subtitle}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-400">
                    {activeLayer.description}
                  </p>

                  {/* Active target metrics focus layout */}
                  <div className="space-y-3 mt-4 bg-white/5 p-4 rounded-none border border-white/5">
                    <h4 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">LAYER PROBE TELEMETRY</h4>
                    <div className="divide-y divide-white/5">
                      {activeLayer.focusStats.map((st, sidx) => (
                        <div key={sidx} className="flex justify-between py-2 text-xs">
                          <span className="text-slate-400 font-mono">{st.label}</span>
                          <span className="text-cyan-400 font-bold font-mono text-right">{st.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Theories card inside Level 4 (Accretions) */}
                  {activeLayer.theories && activeLayer.theories.map((th, thIdx) => (
                    <div key={thIdx} className="p-4 bg-cyan-950/10 border border-cyan-800/30 rounded-none">
                      <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                        Scientific Theory — {th.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-2 font-light">
                        {th.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'telemetry' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    Macro-Physical Properties
                  </h3>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-none">
                      <p className="text-[9px] text-slate-500 font-mono uppercase">Mass (kg)</p>
                      <p className="text-xs font-mono font-bold text-white mt-1">{activeObject.mass}</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-none">
                      <p className="text-[9px] text-slate-500 font-mono uppercase">Surface Gravity</p>
                      <p className="text-xs font-mono font-bold text-white mt-1">{activeObject.gravity}</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-none w-full col-span-2">
                      <p className="text-[9px] text-slate-500 font-mono uppercase">Heliospheric Distance</p>
                      <p className="text-xs font-mono font-bold text-cyan-400 mt-1">{activeObject.distanceLabel}</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-none">
                      <p className="text-[9px] text-slate-500 font-mono uppercase">Orbital Period</p>
                      <p className="text-xs font-mono font-bold text-white mt-1">{activeObject.orbitalPeriod}</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-none">
                      <p className="text-[9px] text-slate-500 font-mono uppercase">Known Moons</p>
                      <p className="text-xs font-mono font-bold text-white mt-1">{activeObject.moons}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-none space-y-1">
                    <p className="text-[9px] text-slate-500 font-mono uppercase">Thermal Bounds</p>
                    <p className="text-sm font-semibold font-mono text-orange-400">{activeObject.temperature}</p>
                  </div>

                  {activeObject.type === 'star' && (
                    <div className="p-4 bg-cyan-950/10 border border-cyan-800/30 rounded-none">
                      <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-2">MASS COMPARISON</h4>
                      <p className="text-[11px] text-slate-400 leading-normal mb-1.5">This massive star is classified inside stellar groupings as a {activeObject.class}.</p>
                      <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden flex">
                        <div className="bg-cyan-500 h-full rounded-none" style={{ width: activeObject.id === 'sirius' ? '90%' : '20%' }} />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1.5">
                        <span>SOLAR VALUE (1.0)</span>
                        <span>TARGET STAT</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'composition' && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Atmosphere & Mass Chemical Specs
                  </h3>

                  <div className="space-y-3">
                    {activeObject.composition.map((comp, cIdx) => (
                      <div key={cIdx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-200">{comp.name}</span>
                          <span className="font-mono text-cyan-400 font-bold">{comp.percentage}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-none overflow-hidden">
                          <div
                            className="h-full rounded-none transition-all duration-500"
                            style={{
                              backgroundColor: comp.color,
                              width: `${comp.percentage}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono leading-relaxed bg-white/5 p-3 rounded-none border border-white/5 mt-5">
                    CHEM SCAN CODE: LOCK SENSOR SPECTRA TO COMPONENT GAUGE. VALUES EXTRACTED FROM MASS ABSORPTION SPECTROGRAPHY.
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Diagnostics Scrolling Tick list */}
            <div className="p-4 bg-black/60 border-t border-white/5">
              <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase block mb-1">REALTIME DIAGNOSTICS</span>
              <div className="font-mono text-[9px] text-cyan-400 space-y-0.5">
                {scanTelemetry.map((item, idx) => (
                  <p key={idx} className="truncate uppercase flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse block" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT COMPREHENSIVE FLIGHT INSTRUMENTATION PANEL */}
          <section
            id="stellar-controls-panel"
            className="absolute right-6 top-24 bottom-24 w-[335px] z-20 bg-black/50 backdrop-blur-xl border border-white/10 rounded-none flex flex-col p-6 shadow-2xl overflow-y-auto space-y-5 scrollbar-thin"
          >
            <div>
              <h3 className="text-[10px] tracking-widest text-slate-500 font-mono uppercase">COSMIC INSTRUMENTS</h3>
              <h4 className="text-xs font-bold text-white mt-1 uppercase tracking-wider">ORBITAL METRIC DRIFT</h4>
            </div>

            {/* Orbit Speed Multiplier Factor Slider */}
            <div className="space-y-3 bg-white/5 p-4 rounded-none border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono flex items-center gap-1">
                  <Orbit className="w-3.5 h-3.5 text-cyan-400" />
                  REVOLUTION RATE
                </span>
                <span className="font-mono text-cyan-400 font-bold">{orbitSpeedFactor.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={orbitSpeedFactor}
                onChange={(e) => setOrbitSpeedFactor(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-none appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[8px] font-mono text-slate-500">
                <span>0.0 (PAUSED)</span>
                <span>3.0 (SUPER SPEED)</span>
              </div>
            </div>

            {/* Custom Light Mode Toggle Option */}
            <div className="space-y-3 bg-white/5 p-4 rounded-none border border-white/5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">LUMINANCE EMERGENCE</span>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300">Holographic Lights</span>
                <button
                  onClick={() => { setUseHolographicLights(!useHolographicLights); playSynthBeep(800, 0.05); }}
                  className={`w-11 h-6 rounded-none p-1 transition-colors duration-200 cursor-pointer ${
                    useHolographicLights ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-none shadow-md transform transition-transform duration-200 ${
                      useHolographicLights ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[9px] text-slate-500 font-mono leading-relaxed">
                ACTIVATES COLD AMBIENT MULTILIGHT THAT OVERRIDES SUN CAST SURFACE SHADOWS.
              </p>
            </div>

            {/* Progressive layer checklist indicating what changes visually */}
            <div className="space-y-3 bg-white/5 p-4 rounded-none border border-white/5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">LAYER ANATOMY INSPECT</span>
              <div className="space-y-2">
                {[
                  { label: 'Orbital Sphere Envelope', active: activeLayer.visualSettings.showCrust },
                  { label: 'Atmospheric Shield / Clouds', active: activeLayer.visualSettings.showAtmosphere },
                  { label: 'Viscous Convective Mantle', active: activeLayer.visualSettings.showInternal },
                  { label: 'Core / Dynamo Spheroid', active: activeLayer.visualSettings.showInternal },
                ].map((chk, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${chk.active ? 'bg-cyan-400 animate-pulse' : 'bg-white/10'}`} />
                    <span className={chk.active ? 'text-cyan-200 font-semibold' : 'text-slate-500'}>{chk.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic star comparison dashboard inside right panel context */}
            <div className="flex-1" />

            <div className="border-t border-white/5 pt-3 space-y-1">
              <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">PROJECTION RESOLVE</p>
              <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">CYAN ATMOSPHERIC RENDER ACTIVE</p>
            </div>
          </section>

          {/* BOTTOM STEPPER LAYER PROGRESSION SLIDER */}
          <footer
            id="stellar-stepper-footer"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-5xl bg-black/60 border border-white/10 backdrop-blur-xl p-5 rounded-none flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl"
          >
            {/* Nav Arrows */}
            <div className="flex items-center gap-3">
              <button
                disabled={currentLayerIndex === 0}
                onClick={() => {
                  setCurrentLayerIndex(prev => Math.max(0, prev - 1));
                  playSynthBeep(450, 0.08);
                }}
                className="p-2.5 rounded-none border border-white/10 bg-white/5 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center md:text-left">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">CURRENT DEPTH</span>
                <span className="text-sm font-bold text-white uppercase tracking-wide">
                  LAYER {currentLayerIndex} • {activeLayer.title}
                </span>
              </div>
            </div>

            {/* Stepper bubbles mapping changed to steps progress bar trackers in theme */}
            <div className="flex items-center gap-4 flex-1 justify-center max-w-lg">
              {activeObject.layers.map((lay, idx) => {
                const isActive = idx === currentLayerIndex;
                const isPassed = idx < currentLayerIndex;
                return (
                  <button
                    key={lay.id}
                    id={`step-${lay.id}`}
                    onClick={() => {
                      setCurrentLayerIndex(idx);
                      playSynthBeep(550, 0.07);
                    }}
                    className={`flex flex-col items-center gap-1 group cursor-pointer transition-opacity ${
                      isActive ? 'opacity-100' : isPassed ? 'opacity-70' : 'opacity-40'
                    }`}
                  >
                    <span className={`text-[10px] font-mono ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>0{idx}</span>
                    <div className={`transition-all duration-300 ${
                      isActive
                        ? 'w-24 h-1.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                        : 'w-10 h-1 bg-slate-700'
                    }`} />
                    <span className={`text-[8px] uppercase tracking-tighter truncate max-w-[65px] ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>{lay.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Milestone */}
            <div>
              <button
                disabled={currentLayerIndex === activeObject.layers.length - 1}
                onClick={() => {
                  setCurrentLayerIndex(prev => Math.min(activeObject.layers.length - 1, prev + 1));
                  playSynthBeep(700, 0.09);
                }}
                className={`flex items-center gap-2 px-5 h-11 border text-[10px] tracking-widest font-bold uppercase transition bg-black/40 cursor-pointer ${
                  currentLayerIndex === activeObject.layers.length - 1
                    ? 'border-white/5 text-slate-600 cursor-not-allowed font-light'
                    : 'border-cyan-500/50 text-cyan-100 hover:bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold'
                }`}
              >
                {currentLayerIndex === activeObject.layers.length - 1 ? 'MAX DEPTH' : 'CONTINUE DOWN'}
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </footer>
        </>
      )}

      {/* FOOTER CAPTION - visible only in standard space overview */}
      {!selectedID && (
        <aside id="scene-footer-caption" className="absolute bottom-24 left-6 z-20 max-w-sm pointer-events-none">
          <div className="bg-black/50 backdrop-blur-md border border-white/5 p-4 rounded-none pointer-events-auto shadow-2xl flex gap-3.5 items-start">
            <div className="p-1.5 bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-pulse text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase flex items-center gap-1.5 leading-relaxed font-semibold">
                SECTOR INSPECTOR ACTIVE
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-light">
                Click any celestial body to study its chemistry, geology, and atmospheric layers. Drag mouse pointer to orbit relative space.
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* STELLAR AI COMPANION PANEL (CGU-35) */}
      {isChatOpen && (
        <aside
          id="stellar-ai-panel"
          className="absolute right-6 top-24 bottom-24 w-80 md:w-96 z-50 bg-black/90 backdrop-blur-2xl border border-cyan-500/30 border-r-4 border-r-cyan-400 hover:border-cyan-500/50 rounded-none flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.8)] text-slate-300 transition-all duration-300 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-cyan-950/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">CGU-35 AI COMPANION</h3>
                <p className="text-[8px] font-mono text-cyan-400 tracking-wider">SECURE DIGITAL TELEMETRY LINK</p>
              </div>
            </div>
            <button
              onClick={() => { setIsChatOpen(false); playSynthBeep(450, 0.08); }}
              className="text-slate-500 hover:text-white transition cursor-pointer text-xs uppercase tracking-widest font-mono"
            >
              [ CLOSE ]
            </button>
          </div>

          {/* Context Banner */}
          <div className="px-4 py-2 border-b border-white/5 bg-white/5 text-[9px] font-mono text-slate-400 flex justify-between">
            <span>TARGET: {activeObject ? activeObject.name.toUpperCase() : "SOLAR SYSTEM VIEW"}</span>
            {activeLayer && <span>LAYER: {activeLayer.title.toUpperCase()}</span>}
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin bg-black/20">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <span className="text-[8px] font-mono text-slate-500 mb-1 uppercase tracking-widest">
                  {msg.role === 'user' ? 'PILOT INSTRUCTION' : 'CGU-35 INTEL'}
                </span>
                <div
                  className={`p-3 text-xs leading-relaxed font-light ${
                    msg.role === 'user'
                      ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-200'
                      : 'bg-white/5 border border-white/5 text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isChatLoading && (
              <div className="flex flex-col items-start mr-auto max-w-[85%]">
                <span className="text-[8px] font-mono text-cyan-400 animate-pulse uppercase tracking-wider">
                  ESTABLISHING STELLAR PROXY LINK...
                </span>
                <div className="p-3 bg-white/5 border border-white/5 text-slate-400 text-xs italic flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
          </div>

          {/* Quick recommendations */}
          <div className="p-4 border-t border-white/5 bg-black/40 space-y-2">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">QUICK COMPANION SCANS</span>
            <div className="flex flex-wrap gap-1.5">
              {activeObject ? (
                <>
                  <button
                    onClick={() => handleQuickProbe(`Summarize the internal zones of ${activeObject.name}.`)}
                    className="px-2 py-1 text-[9px] font-mono bg-white/5 border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
                  >
                    SCAN CURRENT STRUCTURE
                  </button>
                  <button
                    onClick={() => handleQuickProbe(`Compare ${activeObject.name} and Earth core pressures.`)}
                    className="px-2 py-1 text-[9px] font-mono bg-white/5 border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
                  >
                    COMPARE CORE DATA
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleQuickProbe("Which planet in our solar system has the densest metallic core?")}
                    className="px-2 py-1 text-[9px] font-mono bg-white/5 border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
                  >
                    WHICH CORE IS MOST DENSE?
                  </button>
                  <button
                    onClick={() => handleQuickProbe("Explain how the Heliosphere structures solar wind boundaries.")}
                    className="px-2 py-1 text-[9px] font-mono bg-white/5 border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
                  >
                    COSMIC HELIOSPHERE INTEL
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Input field */}
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/10 bg-black/60 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isChatLoading}
              placeholder="ASK COGNITIVE UNIT..."
              className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-500/50 text-xs px-3 py-2 text-white placeholder-slate-500 focus:outline-none font-mono tracking-wider"
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="px-4 py-2 bg-cyan-600 border border-cyan-500 text-[10px] tracking-widest font-mono font-bold uppercase transition hover:bg-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              SEND
            </button>
          </form>
        </aside>
      )}
    </div>
  );
}
