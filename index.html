import * as THREE from 'three';

/**
 * Procedural texture generators for celestial bodies using canvas graphics.
 * This guarantees offline operation, high performance, and custom shaders/lookups.
 */

// Draw an organic noise-like path for continental shapes
function drawOrganicContinent(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pointsCount: number = 8,
  seed: number = 0
) {
  ctx.beginPath();
  const angleStep = (Math.PI * 2) / pointsCount;
  for (let i = 0; i <= pointsCount; i++) {
    const angle = i * angleStep;
    // Semi-deterministic noise variation based on sine/cosine wave functions
    const noise = Math.sin(angle * 3 + seed) * 0.2 + Math.cos(angle * 5 - seed) * 0.1;
    const rCurrentX = rx * (1 + noise);
    const rCurrentY = ry * (1 + noise);
    const x = cx + Math.cos(angle) * rCurrentX;
    const y = cy + Math.sin(angle) * rCurrentY;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

/**
 * Generates an Earth-like texture with blue oceans, green/brown landmasses, and polar icecaps.
 */
export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Draw Ocean Blue Background
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0d2b45');
  oceanGrad.addColorStop(0.5, '#1d3557');
  oceanGrad.addColorStop(1, '#0d2b45');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw Lands with rich vegetative and desert tones
  ctx.fillStyle = '#2d6a4f'; // Green landmass

  // Simplified continents
  // Eurasia/Africa
  ctx.fillStyle = '#40916c';
  drawOrganicContinent(ctx, 500, 220, 180, 110, 12, 1.5);
  ctx.fill();

  // Africa connection / details
  ctx.fillStyle = '#d8f3dc'; // Sahara zone
  drawOrganicContinent(ctx, 450, 270, 70, 60, 10, 2.3);
  ctx.fill();
  ctx.fillStyle = '#52b788';
  drawOrganicContinent(ctx, 480, 310, 60, 70, 9, 3.1);
  ctx.fill();

  // North America
  ctx.fillStyle = '#2d6a4f';
  drawOrganicContinent(ctx, 220, 160, 110, 80, 11, 4.4);
  ctx.fill();

  // South America
  ctx.fillStyle = '#1b4332';
  drawOrganicContinent(ctx, 280, 330, 60, 110, 8, 5.1);
  ctx.fill();

  // Australia
  ctx.fillStyle = '#b7094c'; // Outback reddish tint
  ctx.fillStyle = '#d4a373';
  drawOrganicContinent(ctx, 800, 360, 60, 45, 7, 6.2);
  ctx.fill();

  // Antarctica
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 470, canvas.width, 42); // South pole ice cap
  ctx.fillRect(0, 0, canvas.width, 25);  // North pole ice cap

  // Subtle land shadows and accents (coastlines)
  ctx.strokeStyle = '#48cae4';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Add simple city clusters / lights as yellowish speckles on land bounds (useful for Layer 2 city lights visualizing!)
  ctx.fillStyle = 'rgba(255, 235, 120, 0.4)';
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    // Check if on land (green or light sand) by reading pixel color
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    if (pixel[1] > 60 && pixel[2] < 200) { // High green, low blue implies green continent code
      ctx.beginPath();
      // Draw clusters
      ctx.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates an Earth cloud overlay layer with beautiful wispy, spiraling clouds.
 */
export function createCloudsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw semi-transparent wispy clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  
  // Create beautiful cyclones and long horizontal streams
  for (let s = 0; s < 12; s++) {
    const cx = Math.random() * canvas.width;
    const cy = 100 + Math.random() * (canvas.height - 200);
    const radius = 50 + Math.random() * 90;

    // Draw spiral swirl
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 8 + Math.random() * 15;
    const steps = 30;
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 4;
      const r = (i / steps) * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r * 0.5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Draw cloud belts
  const cloudGr = ctx.createLinearGradient(0, 0, canvas.width, 0);
  cloudGr.addColorStop(0, 'rgba(255,255,255,0.0)');
  cloudGr.addColorStop(0.3, 'rgba(255,255,255,0.35)');
  cloudGr.addColorStop(0.5, 'rgba(255,255,255,0.0)');
  cloudGr.addColorStop(0.7, 'rgba(255,255,255,0.4)');
  cloudGr.addColorStop(1, 'rgba(255,255,255,0.0)');

  ctx.fillStyle = cloudGr;
  ctx.fillRect(0, 200, canvas.width, 60);
  ctx.fillRect(0, 100, canvas.width, 30);
  ctx.fillRect(0, 320, canvas.width, 45);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Generates Mars rusty red-orange texture with craters and white polar ice caps.
 */
export function createMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Rust Red background
  const baseGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  baseGrad.addColorStop(0, '#be3e1f');
  baseGrad.addColorStop(0.5, '#cc5a37');
  baseGrad.addColorStop(1, '#be3e1f');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Darker mineral patches (iron oxide channels / maria)
  ctx.fillStyle = 'rgba(78, 25, 12, 0.45)';
  for (let i = 0; i < 8; i++) {
    const rx = 40 + Math.random() * 80;
    const ry = 20 + Math.random() * 40;
    const cx = Math.random() * canvas.width;
    const cy = 60 + Math.random() * (canvas.height - 120);
    drawOrganicContinent(ctx, cx, cy, rx, ry, 8, i);
    ctx.fill();
  }

  // 3. Polar Icecaps
  ctx.fillStyle = '#ffffff';
  // North Pole
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 0, 32, 0, Math.PI);
  ctx.fill();
  // South Pole
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height, 22, Math.PI, 0);
  ctx.fill();

  // 4. Subtle impact craters
  ctx.strokeStyle = 'rgba(60, 20, 10, 0.4)';
  ctx.fillStyle = 'rgba(200, 100, 80, 0.15)';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = 30 + Math.random() * (canvas.height - 60);
    const cr = 4 + Math.random() * 12;
    ctx.beginPath();
    ctx.arc(x, y, cr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates Jupiter orange, beige, and brown stripe texture with the Great Red Spot.
 */
export function createJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Layered belt colors
  const bands = [
    { start: 0, end: 15, color: '#bc6c25' }, // Polar north
    { start: 15, end: 28, color: '#dda15e' },
    { start: 28, end: 38, color: '#fae19c' },
    { start: 38, end: 50, color: '#aa5d20' }, // Dark belt
    { start: 50, end: 58, color: '#dda15e' },
    { start: 58, end: 72, color: '#b05315' }, // Red spot latitude belt
    { start: 72, end: 84, color: '#fefae0' },
    { start: 84, end: 100, color: '#bc6c25' } // Polar south
  ];

  bands.forEach(band => {
    const yStart = (band.start / 100) * canvas.height;
    const yEnd = (band.end / 100) * canvas.height;
    const h = yEnd - yStart;

    const grad = ctx.createLinearGradient(0, yStart, 0, yEnd);
    grad.addColorStop(0, band.color);
    grad.addColorStop(1, band.color);
    ctx.fillStyle = grad;
    ctx.fillRect(0, yStart, canvas.width, h);

    // Draw turbulence/swirls on the borders
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let x = 0; x < canvas.width; x += 120) {
      ctx.beginPath();
      ctx.arc(x + Math.sin(x) * 15, yStart, 8 + Math.random() * 12, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw the world-famous Great Red Spot at latitude ~65%, longitude ~40%
  const rsX = canvas.width * 0.42;
  const rsY = canvas.height * 0.65;
  const rx = 45;
  const ry = 25;

  const spotGrad = ctx.createRadialGradient(rsX - 10, rsY - 5, 2, rsX, rsY, rx);
  spotGrad.addColorStop(0, '#e83e15'); // Intense red center
  spotGrad.addColorStop(0.6, '#9b2226'); // Darker crimson
  spotGrad.addColorStop(1, '#dda15e'); // Fade to environment orange

  ctx.beginPath();
  ctx.ellipse(rsX, rsY, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = spotGrad;
  ctx.fill();

  // Highlight swirls in the spot
  ctx.strokeStyle = 'rgba(255, 150, 150, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(rsX, rsY, rx - 8, ry - 5, 0, 0, Math.PI * 1.5);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates Saturn's horizontal bands (golden-beige shades).
 */
export function createSaturnTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const bands = [
    { start: 0, end: 20, color: '#cbb380' },
    { start: 20, end: 32, color: '#dfcca5' },
    { start: 32, end: 40, color: '#eadcb9' },
    { start: 40, end: 55, color: '#bd9f67' },
    { start: 55, end: 72, color: '#dfcca5' },
    { start: 72, end: 100, color: '#cbb380' }
  ];

  bands.forEach(band => {
    const yStart = (band.start / 100) * canvas.height;
    const yEnd = (band.end / 100) * canvas.height;
    ctx.fillStyle = band.color;
    ctx.fillRect(0, yStart, canvas.width, yEnd - yStart);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates Saturn's rings texture (horizontal concentric bands with gaps).
 */
export function createSaturnRingsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Gradient along the thickness representing different concentric groups (A, B, C, Cassini Division)
  const ringGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  ringGrad.addColorStop(0, 'rgba(163, 137, 98, 0.05)'); // Inner dust C-ring
  ringGrad.addColorStop(0.2, 'rgba(215, 192, 154, 0.4)');
  ringGrad.addColorStop(0.45, 'rgba(240, 225, 195, 0.95)'); // Bright B-ring
  ringGrad.addColorStop(0.55, 'rgba(20, 15, 10, 0.02)');   // Cassini Division Gap
  ringGrad.addColorStop(0.65, 'rgba(195, 172, 133, 0.75)'); // Broad A-ring
  ringGrad.addColorStop(0.85, 'rgba(160, 140, 110, 0.3)');
  ringGrad.addColorStop(0.95, 'rgba(50, 45, 40, 0.01)');    // Encke gap / boundary
  ringGrad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = ringGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Generates Mercury/Moon dusty gray crater texture.
 */
export function createMercuryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#555555');
  grad.addColorStop(0.5, '#777777');
  grad.addColorStop(1, '#555555');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add crater craters
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 2 + Math.random() * 10;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates Venus yellowish-gold smog gas texture.
 */
export function createVenusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#b58228');
  grad.addColorStop(0.5, '#e0b355');
  grad.addColorStop(1, '#b58228');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Wispy sulfur streaks
  ctx.fillStyle = 'rgba(255, 235, 150, 0.15)';
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    const h = 5 + Math.random() * 15;
    const y = Math.random() * (canvas.height - h);
    ctx.fillRect(0, y, canvas.width, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates Uranus/Neptune cyan and active blue gas bands.
 */
export function createIceGiantTexture(isNeptune: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const baseColor = isNeptune ? '#2a4494' : '#a2e8dd';
  const streakColor = isNeptune ? '#1a2b63' : '#b2ede4';
  const cloudsColor = isNeptune ? '#6fa6f6' : '#ffffff';

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle gas streaks
  ctx.fillStyle = streakColor;
  for (let i = 0; i < 8; i++) {
    const y = Math.random() * canvas.height;
    ctx.fillRect(0, y, canvas.width, 4 + Math.random() * 15);
  }

  // Draw Neptune-like high storms (white streaks)
  ctx.fillStyle = cloudsColor;
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 5; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    ctx.fillRect(cx, cy, 80 + Math.random() * 100, 3 + Math.random() * 5);
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates Sun plasma flare dynamic texture.
 */
export function createSunTexture(colorHex: string = '#ffa700', secondaryHex: string = '#ff3c00'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Intense red-orange base
  ctx.fillStyle = secondaryHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render thousands of granular convective cell points or noise
  ctx.fillStyle = colorHex;
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 20 + Math.random() * 60;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255, 235, 120, 0.4)');
    grad.addColorStop(0.5, 'rgba(255, 167, 0, 0.25)');
    grad.addColorStop(1, 'rgba(255, 50, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add sunspots (dark cool plasma anomalies)
  ctx.fillStyle = 'rgba(40, 5, 0, 0.75)';
  for (let i = 0; i < 12; i++) {
    const sx = Math.random() * canvas.width;
    const sy = 80 + Math.random() * (canvas.height - 160);
    ctx.beginPath();
    ctx.ellipse(sx, sy, 4 + Math.random() * 10, 2 + Math.random() * 6, Math.PI * Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Generates a standard gray crater moon texture in a canvas texture.
 */
export function createMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#666666';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#444444';
  for (let s = 0; s < 10; s++) {
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 4 + Math.random() * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
