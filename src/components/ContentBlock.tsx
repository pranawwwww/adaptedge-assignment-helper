import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

/**
 * ContentBlock types supported by the application
 * These represent the different types of content that can be displayed
 * in a learning experience
 */
export type ContentBlockType = 
  | 'text'       // Regular text/markdown content
  | 'code'       // Code snippets with syntax highlighting
  | 'example'    // Example use cases or scenarios
  | 'interactive'// Interactive elements like quizzes or exercises
  | 'image'      // Image content
  | 'video'      // Video content or embed
  | 'note'       // Special callout notes or tips
  | 'warning'    // Warning messages
  | 'challenge'  // Challenge for the user
  | 'resource'   // External resource links

/**
 * Content block interface that defines the structure
 * for all content blocks in the application
 */
export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  metadata?: {
    language?: string;  // For code blocks
    title?: string;     // Optional title
    url?: string;       // For resources or links
    [key: string]: any; // Other metadata
  };
}

interface ContentBlockProps {
  block: ContentBlock;
}

/**
 * Generic component for rendering different types of content blocks
 */
export const ContentBlock: React.FC<ContentBlockProps> = ({ block }) => {
  const [copied, setCopied] = useState(false);

  // Handle copying code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render different block types with appropriate styling
  switch (block.type) {
    case 'text':
      return (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{block.content}</ReactMarkdown>
        </div>
      );
      
    case 'code':
      return (
        <Card className="relative mb-4 overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center border-b">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {block.metadata?.language || 'code'}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyCode}
              className="h-8 w-8 p-0"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{block.content}</code>
          </pre>
        </Card>
      );
      
    case 'example':
      return (
        <Card className="p-4 mb-4 border-l-4 border-l-blue-500">
          <h3 className="text-lg font-medium mb-2">Example</h3>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        </Card>
      );
      
    case 'note':
      return (
        <Card className="p-4 mb-4 border-l-4 border-l-green-500">
          <h3 className="text-lg font-medium mb-2">Note</h3>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        </Card>
      );
      
    case 'warning':
      return (
        <Card className="p-4 mb-4 border-l-4 border-l-yellow-500">
          <h3 className="text-lg font-medium mb-2">Warning</h3>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        </Card>
      );
      
    case 'resource':
      return (
        <Card className="p-4 mb-4 flex items-center">
          <div className="flex-1">
            <h3 className="text-lg font-medium">
              {block.metadata?.title || 'Additional Resource'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{block.content}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="ml-4"
          >
            <a href={block.metadata?.url} target="_blank" rel="noreferrer">
              <ExternalLink size={16} className="mr-2" />
              Open
            </a>
          </Button>
        </Card>
      );
      
    // Add more case handlers for other content types
      
    default:
      return (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{block.content}</ReactMarkdown>
        </div>
      );
  }
};

export default ContentBlock;