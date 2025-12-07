'use client';

import { useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { useDrawing } from '@/hooks/use-drawing';
import { Toolbar } from './toolbar';
import { handleEnhanceDiagram, handleGenerateDiagram } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';

type Tool = 'pen' | 'eraser';

export function ClarityCanvas() {
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
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
    }
    ctx.stroke();
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
    setGeneratedImage(null);
  };

  const handleEnhance = async () => {
    if (isDrawing()) {
      toast({
        title: 'Still Drawing',
        description: 'Please finish your drawing before enhancing.',
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
        title: 'Canvas is Empty',
        description: 'Please draw something before enhancing.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    const diagramDataUri = canvas.toDataURL('image/png');
    const result = await handleEnhanceDiagram({ diagramDataUri });

    if (result.error) {
      toast({
        title: 'Enhancement Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.enhancedDiagramDataUri) {
      setGeneratedImage(result.enhancedDiagramDataUri);
      toast({
        title: 'Diagram Enhanced!',
        description: 'The AI has successfully redrawn your diagram.',
        className: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700',
      });
    }

    setIsLoading(false);
  };

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: 'Prompt is Empty',
        description: 'Please describe the diagram you want to generate.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    const result = await handleGenerateDiagram({ prompt });
    
    if (result.error) {
      toast({
        title: 'Generation Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.diagramDataUri) {
      setGeneratedImage(result.diagramDataUri);
      toast({
        title: 'Diagram Generated!',
        description: 'The AI has successfully generated your diagram.',
        className: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Tabs defaultValue="draw" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">Draw & Enhance</TabsTrigger>
            <TabsTrigger value="generate">Generate from Prompt</TabsTrigger>
          </TabsList>
          <TabsContent value="draw">
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
          </TabsContent>
          <TabsContent value="generate">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Describe Your Diagram</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea 
                    id="prompt" 
                    placeholder="e.g., A flowchart for a user login process."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    disabled={isLoading}
                  />
                </div>
                <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand className="mr-2 h-4 w-4" />
                  )}
                  Generate Diagram
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">AI Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden border p-2">
              {isLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 text-center p-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground font-medium">The AI is working its magic...</p>
                  <p className="text-sm text-muted-foreground/80">This may take a few seconds.</p>
                </div>
              ) : generatedImage ? (
                <Image
                  src={generatedImage}
                  alt="Generated diagram"
                  width={1280}
                  height={720}
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="text-center text-muted-foreground p-8 space-y-2">
                  <Sparkles className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="font-bold text-lg">Magic Awaits</p>
                  <p className="text-sm">Your enhanced or generated diagram will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
