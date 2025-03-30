import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function ApiKeyWarning() {
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  useEffect(() => {
    // Check if the Gemini API key is configured
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    setApiKeyMissing(!apiKey || apiKey.trim() === '');
  }, []);

  if (!apiKeyMissing) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Gemini API Key Not Configured</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          You need to configure a Gemini API key to use the direct API integration. 
          Without a valid API key, the application will fall back to mock data.
        </p>
        <ol className="list-decimal list-inside mb-2 text-sm">
          <li>Create a <span className="font-mono">.env</span> file in the project root</li>
          <li>Add <span className="font-mono">VITE_GEMINI_API_KEY=your_api_key_here</span></li>
          <li>Restart the development server</li>
        </ol>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => window.open('https://ai.google.dev/tutorials/setup', '_blank')}
        >
          Learn how to get a Gemini API key
        </Button>
      </AlertDescription>
    </Alert>
  );
}