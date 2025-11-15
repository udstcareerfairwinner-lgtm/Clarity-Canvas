'use client';

import { PenLine, Eraser, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

type Tool = 'pen' | 'eraser';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  onClear: () => void;
  onEnhance: () => void;
  isLoading: boolean;
}

export function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  onClear,
  onEnhance,
  isLoading,
}: ToolbarProps) {
  return (
    <TooltipProvider>
      <div className="p-2 border-b flex items-center justify-between flex-wrap gap-4 bg-card">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === 'pen' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setTool('pen')}
                aria-label="Select pen tool"
              >
                <PenLine className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pen</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === 'eraser' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setTool('eraser')}
                aria-label="Select eraser tool"
              >
                <Eraser className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eraser</p>
            </TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-8 mx-2" />

          <div className="flex items-center gap-2">
            <Label htmlFor="color-picker" className="sr-only">Color</Label>
            <Input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 p-1 cursor-pointer"
              disabled={tool !== 'pen'}
              aria-label="Color picker"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="line-width" className="text-sm">Width</Label>
            <Input
              id="line-width"
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-24 cursor-pointer"
              aria-label="Line width slider"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onClear} aria-label="Clear canvas">
                <Trash2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>

          <Button onClick={onEnhance} disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Enhance
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
