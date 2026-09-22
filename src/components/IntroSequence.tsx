import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, FastForward, Play } from 'lucide-react';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const totalDuration = 5600; // 5.6 seconds total

  // Web Audio Synthesizer for sci-fi sound effects
  const playSynthesizedIntroAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (isMuted) return;

      const now = ctx.currentTime;

      // 1. Ambient low drone (0.0s - 2.5s)
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      const droneFilter = ctx.createBiquadFilter();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(55, now);
      droneOsc.frequency.exponentialRampToValueAtTime(75, now + 1.2);
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(140, now);
      droneFilter.frequency.exponentialRampToValueAtTime(320, now + 1.8);
      droneGain.gain.setValueAtTime(0.01, now);
      droneGain.gain.linearRampToValueAtTime(0.12, now + 0.5);
      droneGain.gain.linearRampToValueAtTime(0.01, now + 2.2);
      droneOsc.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(ctx.destination);
      droneOsc.start(now);
      droneOsc.stop(now + 2.3);

      // 2. Warp speed riser (1.0s - 2.2s)
      const riserOsc = ctx.createOscillator();
      const riserGain = ctx.createGain();
      riserOsc.type = 'sine';
      riserOsc.frequency.setValueAtTime(120, now + 1.0);
      riserOsc.frequency.exponentialRampToValueAtTime(1100, now + 2.18);
      riserGain.gain.setValueAtTime(0.001, now + 1.0);
      riserGain.gain.exponentialRampToValueAtTime(0.2, now + 2.15);
      riserGain.gain.exponentialRampToValueAtTime(0.001, now + 2.25);
      riserOsc.connect(riserGain);
      riserGain.connect(ctx.destination);
      riserOsc.start(now + 1.0);
      riserOsc.stop(now + 2.3);

      // 3. Impact sub-bass drop & boom (at 2.2s)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(160, now + 2.2);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 3.4);
      subGain.gain.setValueAtTime(0.35, now + 2.2);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 4.2);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now + 2.2);
      subOsc.stop(now + 4.3);

      // 4. Metallic impact shimmer / bell (at 2.22s)
      const shimmerOsc1 = ctx.createOscillator();
      const shimmerOsc2 = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmerOsc1.type = 'sine';
      shimmerOsc2.type = 'sine';
      shimmerOsc1.frequency.setValueAtTime(1760, now + 2.22);
      shimmerOsc2.frequency.setValueAtTime(2640, now + 2.22);
      shimmerGain.gain.setValueAtTime(0.18, now + 2.22);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 3.6);
      shimmerOsc1.connect(shimmerGain);
      shimmerOsc2.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);
      shimmerOsc1.start(now + 2.22);
      shimmerOsc2.start(now + 2.22);
      shimmerOsc1.stop(now + 3.8);
      shimmerOsc2.stop(now + 3.8);

      // 5. Lens flare shimmer sweep (at 3.4s)
      const flareOsc = ctx.createOscillator();
      const flareGain = ctx.createGain();
      flareOsc.type = 'sine';
      flareOsc.frequency.setValueAtTime(880, now + 3.3);
      flareOsc.frequency.exponentialRampToValueAtTime(2100, now + 3.9);
      flareGain.gain.setValueAtTime(0.001, now + 3.3);
      flareGain.gain.linearRampToValueAtTime(0.12, now + 3.6);
      flareGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
      flareOsc.connect(flareGain);
      flareGain.connect(ctx.destination);
      flareOsc.start(now + 3.3);
      flareOsc.stop(now + 4.6);
    } catch {
      // AudioContext fallback without crashing
    }
  };

  useEffect(() => {
    // Attempt auto-triggering sound if user had previously interacted
    playSynthesizedIntroAudio();

    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  // Keyboard shortcut for skipping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles array
    const particleCount = 140;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 1200,
      z: Math.random() * 1500 + 100,
      size: Math.random() * 2 + 0.8,
      speed: Math.random() * 0.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    // Speedlines array for warp phase
    const speedlineCount = 70;
    const speedlines = Array.from({ length: speedlineCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 0.8 + 0.2;
      return {
        angle,
        dist,
        length: Math.random() * 200 + 80,
        speed: Math.random() * 15 + 25,
        width: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.8 + 0.2,
      };
    });

    // Radial blast rays for impact (t=2.2s)
    const blastRayCount = 48;
    const blastRays = Array.from({ length: blastRayCount }, (_, i) => ({
      angle: (i / blastRayCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.05,
      length: Math.random() * 600 + 300,
      width: Math.random() * 3 + 1,
      alpha: Math.random() * 0.8 + 0.2,
    }));

    // Circuit lines on the floor & edges
    const circuitSegments = [
      // Left side circuits
      { points: [{ x: -0.85, z: 200, y: 0 }, { x: -0.85, z: 600, y: 0 }, { x: -0.6, z: 600, y: 0 }, { x: -0.6, z: 900, y: 0 }] },
      { points: [{ x: -0.9, z: 300, y: -0.2 }, { x: -0.75, z: 500, y: -0.2 }, { x: -0.75, z: 800, y: -0.1 }] },
      // Right side circuits
      { points: [{ x: 0.85, z: 180, y: 0 }, { x: 0.85, z: 550, y: 0 }, { x: 0.55, z: 550, y: 0 }, { x: 0.55, z: 850, y: 0 }] },
      { points: [{ x: 0.9, z: 320, y: -0.15 }, { x: 0.7, z: 450, y: -0.15 }, { x: 0.7, z: 750, y: -0.05 }] },
      // Center branching circuits
      { points: [{ x: -0.3, z: 250, y: 0 }, { x: -0.3, z: 400, y: 0 }, { x: -0.15, z: 400, y: 0 }, { x: -0.15, z: 650, y: 0 }] },
      { points: [{ x: 0.35, z: 220, y: 0 }, { x: 0.35, z: 380, y: 0 }, { x: 0.2, z: 380, y: 0 }, { x: 0.2, z: 600, y: 0 }] },
    ];

    let gridOffsetZ = 0;

    const render = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      if (elapsed >= totalDuration) {
        onComplete();
        return;
      }

      const progress = elapsed / totalDuration; // 0 to 1
      const timeSec = elapsed / 1000;

      // Clear background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.52; // Vanishing point horizon
      const fov = 450;

      // -------------------------------------------------------------
      // 1. Perspective Grid (Floor)
      // -------------------------------------------------------------
      let speedFactor = 1;
      if (timeSec < 1.1) {
        speedFactor = 1.5;
      } else if (timeSec >= 1.1 && timeSec < 2.2) {
        // Warp acceleration
        const warpProg = (timeSec - 1.1) / 1.1;
        speedFactor = 1.5 + Math.pow(warpProg, 2.5) * 35;
      } else if (timeSec >= 2.2 && timeSec < 3.2) {
        speedFactor = 4;
      } else {
        speedFactor = 1.2;
      }

      gridOffsetZ = (gridOffsetZ + speedFactor * 2.8) % 100;

      const floorY = 180; // World units below camera
      const maxZ = 1200;
      const minZ = 40;
      const gridStep = 50;

      ctx.save();
      // Grid line style
      const gridAlpha = timeSec >= 4.6 ? Math.max(0, 1 - (timeSec - 4.6) / 0.8) : 0.65;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.28 * gridAlpha})`;
      ctx.lineWidth = 1.2;

      // Draw horizontal lines
      for (let z = minZ - gridOffsetZ; z < maxZ; z += gridStep) {
        if (z <= minZ) continue;
        const screenY = cy + (floorY / z) * fov;
        const halfWidth = (width * 1.5) * (fov / z);

        const distRatio = Math.max(0, Math.min(1, 1 - z / maxZ));
        ctx.strokeStyle = `rgba(255, 255, 255, ${distRatio * 0.35 * gridAlpha})`;
        ctx.beginPath();
        ctx.moveTo(cx - halfWidth, screenY);
        ctx.lineTo(cx + halfWidth, screenY);
        ctx.stroke();
      }

      // Draw longitudinal radiating lines
      const numLongLines = 28;
      for (let i = -numLongLines / 2; i <= numLongLines / 2; i++) {
        const worldX = i * 75;
        const screenXNear = cx + (worldX / minZ) * fov;
        const screenYNear = cy + (floorY / minZ) * fov;
        const screenXFar = cx + (worldX / maxZ) * fov;
        const screenYFar = cy + (floorY / maxZ) * fov;

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 * gridAlpha})`;
        ctx.beginPath();
        ctx.moveTo(screenXNear, screenYNear);
        ctx.lineTo(screenXFar, screenYFar);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 2. Circuit Traces on the Grid Floor
      // -------------------------------------------------------------
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 8;
      circuitSegments.forEach((seg, idx) => {
        const segAlpha = (0.5 + 0.3 * Math.sin(timeSec * 4 + idx)) * gridAlpha;
        ctx.strokeStyle = `rgba(255, 255, 255, ${segAlpha})`;
        ctx.beginPath();

        seg.points.forEach((pt, pIdx) => {
          const adjZ = ((pt.z - gridOffsetZ * 2 + maxZ) % maxZ) + minZ;
          const worldX = pt.x * 600;
          const worldY = floorY + pt.y * 120;
          const sx = cx + (worldX / adjZ) * fov;
          const sy = cy + (worldY / adjZ) * fov;

          if (pIdx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
      ctx.restore();

      // -------------------------------------------------------------
      // 3. Floating 3D Particles & Dust
      // -------------------------------------------------------------
      ctx.fillStyle = '#FFFFFF';
      particles.forEach((p) => {
        p.z -= speedFactor * p.speed * 2.2;
        if (p.z <= 20) {
          p.z = 1400;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 1200;
        }

        const scale = fov / p.z;
        const sx = cx + p.x * scale;
        const sy = cy + p.y * scale;

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          const depthAlpha = Math.min(1, Math.max(0.1, (1 - p.z / 1400) * p.alpha));
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(0.8, p.size * scale * 2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha})`;
          ctx.fill();
        }
      });

      // -------------------------------------------------------------
      // 4. Warp Speedlines (Frame 00:01 - t=1.1s to 2.3s)
      // -------------------------------------------------------------
      if (timeSec >= 1.0 && timeSec <= 2.3) {
        const warpIntensity =
          timeSec < 1.8
            ? (timeSec - 1.0) / 0.8
            : 1 - (timeSec - 1.8) / 0.5;

        ctx.save();
        ctx.lineWidth = 2.5;
        speedlines.forEach((line) => {
          const maxRadius = Math.max(width, height) * 0.9;
          const startR = 40 + line.dist * 180;
          const endR = startR + line.length * (warpIntensity * 1.8);

          const cos = Math.cos(line.angle);
          const sin = Math.sin(line.angle);

          const sx1 = cx + cos * startR;
          const sy1 = cy + sin * startR;
          const sx2 = cx + cos * endR;
          const sy2 = cy + sin * endR;

          const grad = ctx.createLinearGradient(sx1, sy1, sx2, sy2);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.7, `rgba(255, 255, 255, ${line.alpha * warpIntensity})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${line.alpha * warpIntensity * 1.2})`);

          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(sx1, sy1);
          ctx.lineTo(sx2, sy2);
          ctx.stroke();
        });
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 5. Impact Radial Rays & Flash (Frame 00:02 - t=2.15s to 3.2s)
      // -------------------------------------------------------------
      if (timeSec >= 2.15 && timeSec <= 3.4) {
        const impactProg = (timeSec - 2.15) / 1.1; // 0 to 1
        const flashAlpha =
          timeSec < 2.3
            ? (timeSec - 2.15) / 0.15
            : Math.max(0, 1 - (timeSec - 2.3) / 0.9);

        // Center Flash Bloom
        const radialGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.5);
        radialGrad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha * 0.85})`);
        radialGrad.addColorStop(0.3, `rgba(255, 255, 255, ${flashAlpha * 0.4})`);
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, width, height);

        // Blast Rays
        ctx.save();
        blastRays.forEach((ray) => {
          const rayLen = ray.length * (1 + impactProg * 0.5);
          const ex = cx + Math.cos(ray.angle) * rayLen;
          const ey = cy + Math.sin(ray.angle) * rayLen;

          const rayGrad = ctx.createLinearGradient(cx, cy, ex, ey);
          rayGrad.addColorStop(0, `rgba(255, 255, 255, ${ray.alpha * flashAlpha})`);
          rayGrad.addColorStop(0.5, `rgba(200, 200, 200, ${ray.alpha * flashAlpha * 0.6})`);
          rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = ray.width * (1 - impactProg * 0.3);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        });
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 6. Draw 3D Chrome NEXXUS Logo (Frames 00:02 - 00:04)
      // -------------------------------------------------------------
      if (timeSec >= 2.05) {
        const logoAge = timeSec - 2.05;

        // Scale entrance: starts small at z-depth, quickly scales into full position with ease-out
        let logoScale = 1;
        let logoAlpha = 1;

        if (logoAge < 0.35) {
          const entranceRatio = logoAge / 0.35;
          // Ease-out expo
          const ease = 1 - Math.pow(1 - entranceRatio, 3);
          logoScale = 0.2 + ease * 0.8;
          logoAlpha = Math.min(1, entranceRatio * 1.5);
        } else if (timeSec >= 4.6) {
          // Outro transition: smooth zoom in and fade
          const outroRatio = (timeSec - 4.6) / 1.0;
          logoScale = 1.0 + outroRatio * 0.15;
          logoAlpha = Math.max(0, 1 - outroRatio);
        }

        ctx.save();
        ctx.translate(cx, cy - 25);
        ctx.scale(logoScale, logoScale);
        ctx.globalAlpha = logoAlpha;

        // Draw Floor Reflection of Logo
        ctx.save();
        ctx.translate(0, 95);
        ctx.scale(1, -0.45); // Invert vertically for floor reflection
        const reflectionMask = ctx.createLinearGradient(0, -50, 0, 60);
        reflectionMask.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
        reflectionMask.addColorStop(0.8, 'rgba(255, 255, 255, 0.03)');
        reflectionMask.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = reflectionMask;

        drawNexxusLogo(ctx, 0, 0, true);
        ctx.restore();

        // Draw Ambient Glow Behind Logo
        const logoBackglow = ctx.createRadialGradient(0, 0, 40, 0, 0, 360);
        logoBackglow.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
        logoBackglow.addColorStop(0.5, 'rgba(255, 255, 255, 0.06)');
        logoBackglow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = logoBackglow;
        ctx.beginPath();
        ctx.arc(0, 0, 360, 0, Math.PI * 2);
        ctx.fill();

        // Draw Main 3D Chrome Logo
        drawNexxusLogo(ctx, 0, 0, false);

        // Lens Flare Sweep (Frame 00:03 - sweeps across logo t=3.1s to 4.3s)
        if (timeSec >= 3.1 && timeSec <= 4.4) {
          const flareProg = (timeSec - 3.1) / 1.3; // 0 to 1
          const flareX = -320 + flareProg * 640;
          const flareY = -5;

          const flareAlpha = Math.sin(flareProg * Math.PI) * 0.95;

          // Anamorphic horizontal streak
          const streakGrad = ctx.createLinearGradient(flareX - 220, flareY, flareX + 220, flareY);
          streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          streakGrad.addColorStop(0.45, `rgba(255, 255, 255, ${flareAlpha * 0.8})`);
          streakGrad.addColorStop(0.5, `rgba(255, 255, 255, ${flareAlpha})`);
          streakGrad.addColorStop(0.55, `rgba(255, 255, 255, ${flareAlpha * 0.8})`);
          streakGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(flareX - 220, flareY);
          ctx.lineTo(flareX + 220, flareY);
          ctx.stroke();

          // Star flare center
          const flareCore = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 35);
          flareCore.addColorStop(0, `rgba(255, 255, 255, ${flareAlpha})`);
          flareCore.addColorStop(0.3, `rgba(255, 255, 255, ${flareAlpha * 0.7})`);
          flareCore.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = flareCore;
          ctx.beginPath();
          ctx.arc(flareX, flareY, 35, 0, Math.PI * 2);
          ctx.fill();

          // Vertical flare spike
          ctx.strokeStyle = `rgba(255, 255, 255, ${flareAlpha * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(flareX, flareY - 50);
          ctx.lineTo(flareX, flareY + 50);
          ctx.stroke();
        }

        ctx.restore();
      }

      // -------------------------------------------------------------
      // 7. Global Outro Fade Transition
      // -------------------------------------------------------------
      if (timeSec >= 4.8) {
        const fadeOut = Math.min(1, (timeSec - 4.8) / 0.8);
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeOut})`;
        ctx.fillRect(0, 0, width, height);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  // Helper function to draw the exact chrome beveled NEXXUS logo
  const drawNexxusLogo = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isReflection: boolean
  ) => {
    ctx.save();
    ctx.translate(x, y);

    const logoWidth = 540;
    const fontSize = Math.min(window.innerWidth * 0.11, 88);
    ctx.font = `900 ${fontSize}px 'Syne', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Letters spacing configuration
    const letters = [
      { char: 'N', x: -220, y: 0 },
      { char: 'E', x: -130, y: 0 },
      { char: 'X', x: -45, y: 0 },
      { char: 'X', x: 45, y: 0, special: true }, // The extended slash X
      { char: 'U', x: 135, y: 0 },
      { char: 'S', x: 220, y: 0 },
    ];

    if (!isReflection) {
      // 1. Bottom 3D Extrusion Shadow Layer
      ctx.fillStyle = '#09090b';
      for (let offset = 8; offset >= 1; offset--) {
        letters.forEach((l) => {
          ctx.fillText(l.char, l.x, l.y + offset);
        });
      }

      // 2. Beveled stroke outline
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 4;
      letters.forEach((l) => {
        ctx.strokeText(l.char, l.x, l.y);
      });
    }

    // 3. Polished Metallic Chrome Face Gradient
    const chromeGrad = ctx.createLinearGradient(0, -fontSize * 0.55, 0, fontSize * 0.55);
    if (isReflection) {
      chromeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      chromeGrad.addColorStop(0.5, 'rgba(161, 161, 170, 0.15)');
      chromeGrad.addColorStop(1, 'rgba(24, 24, 27, 0.05)');
    } else {
      chromeGrad.addColorStop(0, '#FFFFFF'); // Top bright highlight
      chromeGrad.addColorStop(0.2, '#E4E4E7');
      chromeGrad.addColorStop(0.48, '#A1A1AA'); // Middle metal shelf
      chromeGrad.addColorStop(0.52, '#27272A'); // High contrast chrome cut
      chromeGrad.addColorStop(0.7, '#71717A');
      chromeGrad.addColorStop(0.9, '#E4E4E7');
      chromeGrad.addColorStop(1, '#52525B');
    }

    ctx.fillStyle = chromeGrad;
    letters.forEach((l) => {
      ctx.fillText(l.char, l.x, l.y);
    });

    // 4. Draw the iconic extended blade slash on the second X (from video)
    if (!isReflection) {
      ctx.save();
      const bladeGrad = ctx.createLinearGradient(20, -20, 80, 75);
      bladeGrad.addColorStop(0, '#FFFFFF');
      bladeGrad.addColorStop(0.4, '#D4D4D8');
      bladeGrad.addColorStop(0.5, '#27272A');
      bladeGrad.addColorStop(0.8, '#A1A1AA');
      bladeGrad.addColorStop(1, '#3F3F46');

      ctx.fillStyle = bladeGrad;
      ctx.beginPath();
      // Elongated diagonal blade cutting down past the baseline
      ctx.moveTo(32, 10);
      ctx.lineTo(46, -10);
      ctx.lineTo(84, 52);
      ctx.lineTo(66, 62);
      ctx.closePath();
      ctx.fill();

      // Sharp blade highlight edge
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(46, -10);
      ctx.lineTo(84, 52);
      ctx.stroke();
      ctx.restore();
    }

    // 5. Specular highlight line along top chamfer
    if (!isReflection) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.2;
      letters.forEach((l) => {
        ctx.strokeText(l.char, l.x, l.y - 1);
      });
    }

    ctx.restore();
  };

  const handleUserClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      playSynthesizedIntroAudio();
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      if (!next && audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return next;
    });
  };

  return (
    <div
      id="nexxus-intro-overlay"
      onClick={handleUserClick}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black cursor-pointer select-none overflow-hidden"
    >
      {/* 60fps Canvas Stage */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full block pointer-events-none"
      />

      {/* Top Bar Controls */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        {/* Brand mark */}
        <div className="flex items-center gap-2 rounded-sm border border-zinc-800/80 bg-black/60 px-3 py-1 font-mono text-xs text-zinc-400 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-white animate-ping" />
          <span className="font-bold text-white uppercase tracking-wider">NEXXUS</span>
          <span className="text-zinc-600">// CINEMATIC INTRO</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            id="intro-sound-toggle"
            onClick={toggleAudio}
            className="flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-black/70 px-3 py-1.5 font-mono text-xs text-zinc-300 backdrop-blur-md transition-colors hover:border-white hover:text-white"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-zinc-500" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-white" />
                <span className="hidden sm:inline">AUDIO ON</span>
              </>
            )}
          </button>

          {/* Skip Button */}
          <button
            id="intro-skip-btn"
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="flex items-center gap-1.5 rounded-sm border border-white bg-white px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-90 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.25)]"
            title="Skip directly to games library [ESC]"
          >
            <FastForward className="h-3.5 w-3.5 fill-black" />
            <span>SKIP INTRO</span>
            <span className="hidden sm:inline text-[10px] text-zinc-600 font-normal">
              [ESC]
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Progress Bar & Hint */}
      <div className="relative z-10 flex flex-col items-center pb-6 sm:pb-8 px-4">
        <p className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase animate-pulse mb-3">
          CLICK ANYWHERE TO INTERACT &bull; PRESS ESC TO SKIP
        </p>

        {/* Animated Loading Bar */}
        <div className="h-1 w-full max-w-md rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-white transition-all ease-linear"
            style={{
              animation: `introProgress ${totalDuration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes introProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};
