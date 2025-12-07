'use server';

import { enhanceDiagramClarity, EnhanceDiagramClarityInput } from '@/ai/flows/enhance-diagram-clarity';
import { generateDiagramFromPrompt, GenerateDiagramFromPromptInput } from '@/ai/flows/generate-diagram-from-prompt';

export async function handleEnhanceDiagram(
  input: EnhanceDiagramClarityInput
): Promise<{ enhancedDiagramDataUri?: string; error?: string }> {
  try {
    if (!input.diagramDataUri) {
      return { error: 'No diagram data provided.' };
    }

    const result = await enhanceDiagramClarity(input);

    if (result.enhancedDiagramDataUri) {
      return { enhancedDiagramDataUri: result.enhancedDiagramDataUri };
    } else {
      return { error: 'Failed to enhance diagram. The AI model did not return an image.' };
    }
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `An error occurred while enhancing the diagram: ${errorMessage}` };
  }
}

export async function handleGenerateDiagram(
  input: GenerateDiagramFromPromptInput
): Promise<{ diagramDataUri?: string; error?: string }> {
  try {
    if (!input.prompt) {
      return { error: 'No prompt provided.' };
    }

    const result = await generateDiagramFromPrompt(input);

    if (result.diagramDataUri) {
      return { diagramDataUri: result.diagramDataUri };
    } else {
      return { error: 'Failed to generate diagram. The AI model did not return an image.' };
    }
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `An error occurred while generating the diagram: ${errorMessage}` };
  }
}
