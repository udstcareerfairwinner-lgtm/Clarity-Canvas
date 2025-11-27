'use client';

import { useEffect, useRef, useCallback } from 'react';

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
  const isDrawingRef = useRef(false);

  const isDrawing = useCallback(() => isDrawingRef.current, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getPointerPosition = (e: MouseEvent | TouchEvent): Point | null => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX;
      const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY;

      if (clientX === undefined || clientY === undefined) return null;

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      if ('button' in e && e.button !== 0) return; // Only draw with left mouse button
      e.preventDefault();
      const currentPoint = getPointerPosition(e);
      if (!currentPoint) return;

      isDrawingRef.current = true;
      onDraw({ ctx, currentPoint, prevPoint: currentPoint }); // Allows for single dot drawing
      prevPointRef.current = currentPoint;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const currentPoint = getPointerPosition(e);
      if (!currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPointRef.current });
      prevPointRef.current = currentPoint;
    };

    const stopDrawing = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
    };

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing); // Listen on window to catch mouseup outside canvas
    window.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      window.removeEventListener('mouseup', stopDrawing);
      window.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
    };
  }, [onDraw]);

  return { canvasRef, isDrawing };
}
