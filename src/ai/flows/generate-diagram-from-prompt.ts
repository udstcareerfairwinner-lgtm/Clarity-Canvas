'use server';

/**
 * @fileOverview Generates a diagram from a text prompt.
 *
 * - generateDiagramFromPrompt - A function that takes a text prompt and creates a diagram image.
 * - GenerateDiagramFromPromptInput - The input type for the function.
 * - GenerateDiagramFromPromptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiagramFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe('A text description of the diagram to generate.'),
});
export type GenerateDiagramFromPromptInput = z.infer<typeof GenerateDiagramFromPromptInputSchema>;

const GenerateDiagramFromPromptOutputSchema = z.object({
  diagramDataUri: z
    .string()
    .describe('The generated diagram as a data URI.'),
});
export type GenerateDiagramFromPromptOutput = z.infer<typeof GenerateDiagramFromPromptOutputSchema>;

export async function generateDiagramFromPrompt(
  input: GenerateDiagramFromPromptInput
): Promise<GenerateDiagramFromPromptOutput> {
  return generateDiagramFromPromptFlow(input);
}

const instruction = `You are an AI assistant that generates clear, professional diagrams from text descriptions.
The user will provide a prompt describing a diagram (e.g., a flowchart, mind map, architecture diagram).
Create a clean, visually appealing diagram based on the user's prompt. The diagram should be simple, use standard shapes, and have clear connecting lines.
Output the generated diagram as a PNG image.`;


const generateDiagramFromPromptFlow = ai.defineFlow(
  {
    name: 'generateDiagramFromPromptFlow',
    inputSchema: GenerateDiagramFromPromptInputSchema,
    outputSchema: GenerateDiagramFromPromptOutputSchema,
  },
  async input => {

    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `${instruction}\n\nPrompt: "${input.prompt}"`,
    });

    return {diagramDataUri: media?.url ?? ''};
  }
);
