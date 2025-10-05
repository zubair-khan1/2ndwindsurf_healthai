# Setup Instructions

## API Configuration

To enable AI-powered report analysis, you need to configure an API key:

### Google Gemini (Currently Configured)
1. Get your API key from: https://aistudio.google.com/app/apikey
2. Open `.env.local` file in the root directory
3. Add your key:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key-here
   ```

### Alternative: OpenAI
1. Get your API key from: https://platform.openai.com/api-keys
2. Open `.env.local` file in the root directory
3. Add your key:
   ```
   OPENAI_API_KEY=sk-your-openai-key-here
   ```
   (Note: You'll need to update the API routes to use OpenAI instead of Gemini)

## Running the Application

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Add your API key to `.env.local` (see above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Features

- **File Upload**: Upload PDF, JPG, or PNG lab reports (max 10MB)
- **AI Analysis**: Get detailed, patient-friendly explanations of your results
- **Video Script Generation**: Generate multilingual video explanations
- **AI Call**: Request an AI voice call to discuss your report
- **Doctor Call**: Schedule a callback with a real doctor

## Troubleshooting

### "Failed to analyze report" error
- Make sure you've added your API key to `.env.local`
- Restart the dev server after adding the key
- Check that your API key is valid and has credits

### File upload fails
- Ensure file is PDF, JPG, or PNG
- File size must be under 10MB
- Check file is not corrupted
