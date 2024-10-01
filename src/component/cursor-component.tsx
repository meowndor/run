'use client'

import React, { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

const CursorBarChart: React.FC = () => {
  const numBars = 100; // Number of bars
  const maxHeight = 200; // Maximum height of a bar in pixels

  const [barHeights, setBarHeights] = useState<number[]>([]);
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 });
  const [isSnapped, setIsSnapped] = useState<boolean>(false);
  const [snapTargetPosition, setSnapTargetPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    // Generate random heights for the bars
    const heights = Array.from({ length: numBars }, () => Math.random() * maxHeight);
    setBarHeights(heights);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX + window.scrollX;
      const mouseY = event.clientY + window.scrollY;

      setCursorPosition({ x: mouseX, y: mouseY });

      if (isSnapped) {
        // Update the y-position while keeping x snapped
        setSnapTargetPosition((prev) => ({
          x: prev.x,
          y: mouseY,
        }));
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isSnapped]);

  const handleBarMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const container = target.parentElement!;
    const containerRect = container.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;

    // Calculate the bar's center x-position
    const centerX =
      rect.left +
      3 +
      window.scrollX +
      scrollLeft -
      containerRect.left;
    const mouseY = event.clientY + window.scrollY;

    setSnapTargetPosition({ x: centerX, y: mouseY });
    setIsSnapped(true);
  };

  const handleMouseLeave = () => {
    setIsSnapped(false);
  };

  return (
    <>
      {/* Custom Cursor */}
      <div
        style={{
          position: 'absolute',
          left: (isSnapped ? snapTargetPosition.x : cursorPosition.x) + 'px',
          top: (isSnapped ? snapTargetPosition.y : cursorPosition.y) + 'px',
          width: '2px',
          height: '250px',
          borderRadius: '50%',
          backgroundColor: 'red',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          transition: isSnapped ? 'left 0.2s ease-in-out, top 0.2s ease-in-out' : 'none',
        }}
      />

      {/* Bar Chart Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          height: '300px',
          overflowX: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          cursor: 'none', // Hide default cursor over the chart
        }}
      >
        {barHeights.map((height, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              width: '7px', // Total width: 1px bar + 6px gap
              height: '100%', // Span the full height
            }}
            onMouseEnter={handleBarMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Actual Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '3px', // Center the bar in the container
                width: '1px',
                height: `${height}px`,
                backgroundColor: 'blue',
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CursorBarChart;
