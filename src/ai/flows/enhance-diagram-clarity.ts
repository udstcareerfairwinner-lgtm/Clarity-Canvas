'use server';

/**
 * @fileOverview Enhances the clarity of diagrams drawn on a whiteboard.
 *
 * - enhanceDiagramClarity - A function that takes a diagram data URI and redraws it in a cleaner, more precise form.
 * - EnhanceDiagramClarityInput - The input type for the enhanceDiagramClarity function.
 * - EnhanceDiagramClarityOutput - The return type for the enhanceDiagramClarity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceDiagramClarityInputSchema = z.object({
  diagramDataUri: z
    .string()
    .describe(
      'A diagram drawn on a whiteboard, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected description
    ),
});
export type EnhanceDiagramClarityInput = z.infer<typeof EnhanceDiagramClarityInputSchema>;

const EnhanceDiagramClarityOutputSchema = z.object({
  enhancedDiagramDataUri: z
    .string()
    .describe('The enhanced diagram as a data URI.'),
});
export type EnhanceDiagramClarityOutput = z.infer<typeof EnhanceDiagramClarityOutputSchema>;

export async function enhanceDiagramClarity(
  input: EnhanceDiagramClarityInput
): Promise<EnhanceDiagramClarityOutput> {
  return enhanceDiagramClarityFlow(input);
}

const instruction = `You are an AI assistant that redraws diagrams to make them cleaner and more precise.

You will be given a diagram as a data URI. Redraw this diagram, cleaning up any imperfections and making the shapes more precise.
Output the redrawn diagram as a data URI.

Redrawn Diagram:`;

const enhanceDiagramClarityFlow = ai.defineFlow(
  {
    name: 'enhanceDiagramClarityFlow',
    inputSchema: EnhanceDiagramClarityInputSchema,
    outputSchema: EnhanceDiagramClarityOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          media: {url: input.diagramDataUri},
        },
        {
          text: instruction,
        },
      ],
      config: {
        responseModalities: ['IMAGE'], // We only need an image back
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
        ],
      },
    });

    return {enhancedDiagramDataUri: media?.url ?? ''};
  }
);
