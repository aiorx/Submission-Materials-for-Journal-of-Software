// src/PolygonBackground.js
/*
this backround is Built via standard programming aids
*/


import React, { useRef, useEffect } from 'react';

function PolygonBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set initial canvas size
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Increase the number of moving points
    const numPoints = 50; 
    // Distance threshold for connecting lines between points
    const maxDistance = 150;

    // Generate random points with positions and velocities
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,  // random horizontal velocity
        vy: (Math.random() - 0.5) * 0.5   // random vertical velocity
      });
    }

    // Main animation loop
    function animate() {
      // Clear the previous frame
      ctx.clearRect(0, 0, width, height);

      // Update positions and bounce off edges
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width)  p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // Draw lines between points within maxDistance
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const p1 = points[i];
          const p2 = points[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < maxDistance) {
            ctx.strokeStyle = 'rgb(63, 62, 62)';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();

    // Handle window resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,  // Keep the canvas behind the content
        width: '100%',
        height: '100%'
      }}
    />
  );
}

export default PolygonBackground;
