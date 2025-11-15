'use client';

import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

export function useDrawing(
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPointRef = useRef<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getPointerPosition = (e: MouseEvent | TouchEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      const currentPoint = getPointerPosition(e);
      onDraw({ ctx, currentPoint, prevPoint: currentPoint }); // Allows for single dot drawing
      prevPointRef.current = currentPoint;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const currentPoint = getPointerPosition(e);
      onDraw({ ctx, currentPoint, prevPoint: prevPointRef.current });
      prevPointRef.current = currentPoint;
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      prevPointRef.current = null;
    };

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
    };
  }, [onDraw]);

  return { canvasRef, isDrawing };
}
