# Clarity Canvas

Clarity Canvas is a modern web application that transforms your hand-drawn diagrams into clean, precise, and professional-looking visuals using the power of AI. Simply sketch on the digital whiteboard, and with a single click, our AI assistant will redraw your work with enhanced clarity and neatness.

![Clarity Canvas Screenshot](https://storage.googleapis.com/studioprompt/asset-library/clarity-canvas-demo.png)

## Features

-   **Interactive Whiteboard**: A responsive canvas for drawing your ideas.
-   **Drawing Tools**: Includes a pen and an eraser with adjustable color and line width.
-   **AI-Powered Enhancement**: Utilizes Google's Gemini Pro Vision model to analyze and redraw your diagrams.
-   **Side-by-Side Comparison**: Instantly view the original sketch and the AI-enhanced version.
-   **Modern UI**: Built with a clean and intuitive interface using ShadCN UI and Tailwind CSS.

## Tech Stack

This project is built with a modern, performant, and scalable tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **AI Integration**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
-   **UI**: [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **Drawing**: HTML5 Canvas API with React Hooks
-   **Deployment**: Firebase App Hosting

## Project Structure

The codebase is organized to maintain a clean separation of concerns:

```
.
├── src
│   ├── app                 # Next.js App Router: pages, layouts, and server actions.
│   │   ├── actions.ts      # Server Actions for handling form submissions.
│   │   ├── page.tsx        # The main entry point and homepage.
│   │   └── layout.tsx      # The root layout for the application.
│   │
│   ├── ai                  # AI-related logic and Genkit flows.
│   │   └── flows           # Genkit flows that define AI interactions.
│   │
│   ├── components          # Reusable React components.
│   │   ├── ui              # Auto-generated ShadCN UI components.
│   │   └── clarity-canvas.tsx # The core whiteboard component.
│   │
│   ├── hooks               # Custom React hooks (e.g., use-drawing).
│   │
│   └── lib                 # Utility functions and library configurations.
│
├── public                  # Static assets (images, favicons, etc.).
├── package.json            # Project dependencies and scripts.
└── next.config.ts          # Next.js configuration.
```

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm, pnpm, or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/clarity-canvas.git
    cd clarity-canvas
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_google_ai_api_key
    ```

### Running the Development Server

You can run the application in development mode with hot-reloading:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

### Running Genkit Inspector (Optional)

To inspect and debug your AI flows, you can run the Genkit inspector:

```bash
npm run genkit:watch
```

This will start a local server, typically at [http://localhost:4000](http://localhost:4000), where you can view traces of your AI flow executions.

## How It Works

1.  **Drawing**: The user draws a diagram on the HTML5 canvas in `ClarityCanvas`. The `useDrawing` hook manages the canvas state and pointer events.
2.  **Enhance Request**: When the "Enhance" button is clicked, the canvas content is converted to a `dataURI` (a Base64 encoded PNG image).
3.  **Server Action**: The `dataURI` is sent to the `handleEnhanceDiagram` Server Action.
4.  **Genkit Flow**: The Server Action invokes the `enhanceDiagramClarity` Genkit flow, passing the image data.
5.  **AI Processing**: The flow sends the image and a specific text prompt to the Gemini 2.5 Flash model. The model is instructed to redraw the diagram cleanly.
6.  **Response**: The model returns the enhanced diagram as a new image `dataURI`.
7.  **Display**: The new `dataURI` is sent back to the client, where it is displayed in the "AI Enhanced Diagram" card.
