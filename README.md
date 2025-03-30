# AdaptEdge Assignment Helper

An interactive learning application that helps students master assignments through guided, adaptive learning experiences.

## New Feature: Gemini API Integration

The application now supports direct API calls to Google's Gemini AI from the frontend. This lets users get AI-powered responses for their assignments without requiring a backend server.

### How It Works

1. The app uses pre-built prompts stored in the `public/prompts/` folder
2. These prompts are organized by levels (0-5), each providing different depths of assistance:
   - Level 0: Assignment Overview
   - Level 1: Basic Understanding
   - Level 2: Advanced Understanding
   - Level 3: Practical Application
   - Level 4: Expert Implementation
   - Level 5: Mastery

3. When a user uploads assignment PDFs and helper materials, the app sends these directly to the Gemini API along with the appropriate level-specific prompt.

4. The response from Gemini is then processed and displayed in a structured format including:
   - Main content
   - Flashcards
   - Assessment questions

### Getting Started

To use this feature, you need to:

1. Get a Gemini API key from the [Google AI Studio](https://ai.google.dev/)
2. Create a `.env` file in the project root with:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   VITE_USE_MOCK_DATA=false
   VITE_MAX_UPLOAD_SIZE_MB=10
   VITE_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.txt,.rtf,.ppt,.pptx
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```

### Customizing Prompts

You can customize how the AI responds by editing the prompt files in the `public/prompts/` directory:

- `level0.txt` - Assignment overview prompt
- `level1.txt` - Basic understanding prompt
- ...and so on

Each prompt file contains instructions that tell Gemini how to structure its response for that specific learning level.

## Development

If you don't have a Gemini API key, the application will fall back to using mock data in development mode. Set `VITE_USE_MOCK_DATA=true` in your `.env` file to enable this behavior.

## Technologies

- React
- TypeScript
- Vite
- Google Generative AI SDK
- TailwindCSS
- Shadcn UI Components
