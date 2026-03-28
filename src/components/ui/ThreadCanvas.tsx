'use client';

import { useEffect, useRef } from 'react';

const THREAD_COLORS = [
  '#D4537E', // pink
  '#EF9F27', // amber
  '#7F77DD', // purple
  '#1D9E75', // teal
  '#639922', // green
  '#C5A055', // gold
  '#C5A055', // gold (weighted higher)
];

type Thread = {
  x: number;
  y: number;
  points: { x: number; y: number }[];
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  maxLen: number;
  life: number;
  maxLife: number;
};

function makeThread(w: number, h: number): Thread {
  const color = THREAD_COLORS[Math.floor(Math.random() * THREAD_COLORS.length)];
  const sx = Math.random() * w;
  const sy = Math.random() * h;
  return {
    x: sx, y: sy,
    points: [{ x: sx, y: sy }],
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    color,
    alpha: Math.random() * 0.055 + 0.018,
    maxLen: Math.floor(Math.random() * 70) + 50,
    life: 0,
    maxLife: Math.floor(Math.random() * 260) + 180,
  };
}

export function ThreadCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threadsRef = useRef<Thread[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      threadsRef.current = Array.from({ length: 24 }, () =>
        makeThread(canvas.width, canvas.height)
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      threadsRef.current.forEach((t, i) => {
        t.x += t.vx + Math.sin(t.life * 0.018) * 0.28;
        t.y += t.vy + Math.cos(t.life * 0.016) * 0.22;
        t.points.push({ x: t.x, y: t.y });
        if (t.points.length > t.maxLen) t.points.shift();
        t.life++;

        if (t.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(t.points[0].x, t.points[0].y);
          for (let j = 1; j < t.points.length; j++) {
            ctx.lineTo(t.points[j].x, t.points[j].y);
          }
          ctx.strokeStyle = t.color;
          ctx.globalAlpha = t.alpha * Math.min(1, t.points.length / 25);
          ctx.lineWidth = 0.75;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Reset thread when it dies or leaves viewport
        if (
          t.life > t.maxLife ||
          t.x < -80 || t.x > canvas.width + 80 ||
          t.y < -80 || t.y > canvas.height + 80
        ) {
          threadsRef.current[i] = makeThread(canvas.width, canvas.height);
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="thread-canvas"
      aria-hidden="true"
    />
  );
}
