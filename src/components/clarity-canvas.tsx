'use client';

import { useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { useDrawing } from '@/hooks/use-drawing';
import { Toolbar } from './toolbar';
import { handleEnhanceDiagram } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { Loader2, Sparkles } from 'lucide-react';

type Tool = 'pen' | 'eraser';

export function ClarityCanvas() {
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onDraw = useCallback(({ ctx, currentPoint, prevPoint }: { ctx: CanvasRenderingContext2D; currentPoint: { x: number; y: number }; prevPoint: { x: number; y: number } | null }) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 4; // Make eraser bigger
    }

    ctx.beginPath();
    if (prevPoint) {
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    }
    // Draw a circle at the current point to make the line feel smoother
    ctx.arc(currentPoint.x, currentPoint.y, ctx.lineWidth / 2, 0, 2 * Math.PI);
    ctx.fill();

  }, [tool, color, lineWidth]);

  const { canvasRef, isDrawing } = useDrawing(onDraw);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setEnhancedImage(null);
  };

  const handleEnhance = async () => {
    if (isDrawing()) {
      toast({
        title: 'Still Drawing',
        description: 'Please finish drawing before enhancing.',
        variant: 'destructive',
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixelBuffer = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    const isEmpty = !pixelBuffer.some(color => color !== 0);

    if (isEmpty) {
      toast({
        title: 'Canvas is empty',
        description: 'Please draw something before enhancing.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setEnhancedImage(null);

    const diagramDataUri = canvas.toDataURL('image/png');
    const result = await handleEnhanceDiagram({ diagramDataUri });

    if (result.error) {
      toast({
        title: 'Enhancement Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.enhancedDiagramDataUri) {
      setEnhancedImage(result.enhancedDiagramDataUri);
      toast({
        title: 'Diagram Enhanced!',
        description: 'The AI has successfully redrawn your diagram.',
        className: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Your Whiteboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Toolbar 
              tool={tool}
              setTool={setTool}
              color={color}
              setColor={setColor}
              lineWidth={lineWidth}
              setLineWidth={setLineWidth}
              onClear={handleClear}
              onEnhance={handleEnhance}
              isLoading={isLoading}
            />
            <div className="aspect-video w-full bg-white rounded-b-lg overflow-hidden border-t cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">AI Enhanced Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden border p-2">
              {isLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 text-center p-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground font-medium">The AI is redrawing your diagram...</p>
                  <p className="text-sm text-muted-foreground/80">This may take a few seconds.</p>
                </div>
              ) : enhancedImage ? (
                <Image
                  src={enhancedImage}
                  alt="Enhanced diagram"
                  width={1280}
                  height={720}
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="text-center text-muted-foreground p-8 space-y-2">
                  <Sparkles className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="font-bold text-lg">Magic Awaits</p>
                  <p className="text-sm">Draw on the whiteboard, then click '✨ Enhance' to see the AI transform your sketch!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
