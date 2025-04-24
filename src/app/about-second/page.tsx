'use client';

import React, { useEffect, useRef } from 'react';
import './about-second.css';

const AboutSecondPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      d: Math.random() * 0.5 + 0.1,
    }));

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffee';
        ctx.fill();
        s.y += s.d;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <main className="about-second-container">
      <canvas ref={canvasRef} className="starfield" />

      <section className="intro">
        <h1 className="glow-title">👽 Welcome to Tusk</h1>
        <p className="glow-subtitle">You didn’t just land on a website. You were summoned.</p>
      </section>

      <section className="glyphs">
        <div className="glyph" data-reveal="We perform in quantum logic">𓂀</div>
        <div className="glyph" data-reveal="We connect teams across dimensions">ᚠ</div>
        <div className="glyph" data-reveal="You are not alone">۞</div>
      </section>

      <section className="bio-cards">
        {[1, 2, 3].map((n) => (
          <div key={n} className="float-card">
            <h2>Team Member {n}</h2>
            <p>Specialty: Galactic UX</p>
          </div>
        ))}
      </section>

      <section className="alien-message">
        <div className="glitch-text">TRANSMISSION INCOMING...</div>
      </section>
    </main>
  );
};

export default AboutSecondPage;
