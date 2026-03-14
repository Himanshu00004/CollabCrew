'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SpaceBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SpaceBackground({ className, children, ...props }: SpaceBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // 1. Static/Twinkling stars
    const stars = Array.from({ length: 300 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      twinkleSpeed: 0.005 + Math.random() * 0.015,
    }));

    // 2. Falling stars (top-right to bottom-center)
    const fallingStars = Array.from({ length: 25 }).map(() => ({
      x: canvas.width * 0.5 + Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      length: 15 + Math.random() * 30,
      speed: 0.5 + Math.random() * 1.5, // Slower falling stars
      alpha: 0.3 + Math.random() * 0.6,
    }));

    let time = 0;

    const draw = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background twinkling stars
      stars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0.1) star.twinkleSpeed *= -1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        ctx.fill();
      });

      // Draw falling stars (top-right to bottom-center)
      fallingStars.forEach(fs => {
        fs.x -= fs.speed * 0.8;
        fs.y += fs.speed * 1.5;

        if (fs.y > canvas.height || fs.x < 0) {
          fs.x = canvas.width * 0.5 + Math.random() * canvas.width;
          fs.y = -Math.random() * 500;
          fs.speed = 0.5 + Math.random() * 1.5; // Ensure slower speed when regenerating
        }

        ctx.beginPath();
        ctx.moveTo(fs.x, fs.y);
        ctx.lineTo(fs.x + fs.length * 0.8, fs.y - fs.length * 1.5);
        ctx.strokeStyle = `rgba(180, 200, 255, ${fs.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={cn("relative size-full overflow-hidden bg-[#020617]", className)} {...props}>
      {/* Nebula glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-blue-900/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] bg-indigo-900/20 rounded-full blur-[130px] pointer-events-none mix-blend-screen" />

      {/* Stars canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 block size-full pointer-events-none opacity-80" />

      {/* Static Earth Image - Corner to corner, max 30% height, transparent black bg */}
      <div 
        className="absolute left-0 bottom-0 w-full pointer-events-none flex justify-center items-end"
        style={{ 
           height: '30vh',
           mixBlendMode: 'screen' 
        }}
      >
         <img
            src="/earth-texture.jpg" // Using the exact image from your reference
            alt="Earth"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center top' }}
         />
      </div>

      {/* Main page content container sitting above all backgrounds */}
      <div className="relative z-20 size-full">{children}</div>
    </div>
  );
}
