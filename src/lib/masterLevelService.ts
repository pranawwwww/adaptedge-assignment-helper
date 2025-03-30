// API interfaces for content structure
export interface Flashcard {
  heading: string;
  flashcard_content: string;
}

export interface AssessmentQuestion {
  id: string;
  concept_focus: string;
  type: 'MCQ' | 'MAQ';
  question_text: string;
  options: string[];
  correct_answers: string[];
}

export interface LevelData {
  status: string;
  main_content_md?: string;
  main_conent_md?: string; // Handle both spellings
  feedback_md?: string;
  flashcards: Flashcard[];
  assessment_questions: AssessmentQuestion[];
}

export interface LLMContentRequest {
  type: string;
  level: number;
  files: Record<string, any>; // Changed from array to object format
  questionnaire?: {
    questions: AssessmentQuestion[];
    answers: Record<string, string[]>;
  };
}

export interface LLMContentResponse {
  response: LevelData;
  level: number;
  type: string;
}

// For development and testing, we'll use mock data from files
import mockLevel0 from '@/data/mockLevel0.json';
import mockLevel1 from '@/data/mockLevel1.json';
import mockLevel2 from '@/data/mockLevel2.json';

// API base URL configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Map of levels to mock data (for development/fallback)
const mockLevelData: Record<number, LevelData> = {
  0: mockLevel0,
  1: mockLevel1,
  2: mockLevel2,
};

/**
 * Fetches level content from the API or falls back to mock data
 * @param level The level number to fetch
 * @param files Files processed for API submission
 * @param questionnaire Previous level answers (needed for levels > 0)
 * @returns LevelData for the requested level
 */
export const fetchLevelContent = async (
  level: number, 
  files?: Record<string, any>,
  questionnaire?: {
    questions: AssessmentQuestion[];
    answers: Record<string, string[]>;
  }
): Promise<LevelData> => {
  // For development, decide whether to use mock data or API
  const USE_MOCK_DATA = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === 'true';
  
  console.log('=== fetchLevelContent ===');
  console.log('Level:', level);
  console.log('Files provided:', files ? 'Yes' : 'No');
  console.log('Questionnaire provided:', questionnaire ? 'Yes' : 'No');
  console.log('USE_MOCK_DATA setting:', USE_MOCK_DATA);
  console.log('Environment mode:', import.meta.env.DEV ? 'development' : 'production');
  console.log('API Base URL:', BASE_URL);
  
  if (USE_MOCK_DATA && mockLevelData[level]) {
    console.log(`Using mock data for level ${level}`);
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockLevelData[level];
  }
  
  try {
    // Ensure we have files for the API request
    let filesForRequest = files;
    
    // If no files were provided, try to get them from session storage
    if (!filesForRequest || Object.keys(filesForRequest).length === 0) {
      const storedFiles = sessionStorage.getItem('uploadedFiles');
      if (storedFiles) {
        try {
          filesForRequest = JSON.parse(storedFiles);
          console.log(`Retrieved files from session storage for API request`);
        } catch (error) {
          console.error('Error parsing stored files for API request:', error);
        }
      }
    }
    
    // Prepare request body
    const requestBody: LLMContentRequest = {
      type: 'master-it',
      level,
      files: filesForRequest || {},
      ...(questionnaire && { questionnaire })
    };

    console.log('Making API request to:', `${BASE_URL}/api/llm/content`);
    console.log('Request payload structure:', 
      `Files: ${filesForRequest && filesForRequest.assignment ? 'Assignment included' : 'No assignment'}, ` +
      `Resources: ${filesForRequest && filesForRequest.resources ? filesForRequest.resources.length + ' resources' : 'No resources'}`);

    // Make API request to backend
    const response = await fetch(`${BASE_URL}/api/llm/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `Failed to fetch level ${level} content: ${response.status}`;
      } catch (jsonError) {
        // If we can't parse the JSON response
        errorMessage = `Failed to fetch level ${level} content: ${response.status} ${response.statusText}`;
      }
      
      console.error('API error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data: LLMContentResponse = await response.json();
    console.log('API response data received successfully');
    return data.response;
  } catch (error) {
    console.error('Error fetching level content:', error);
    
    // Fallback to mock data if available
    if (mockLevelData[level]) {
      console.warn(`Falling back to mock data for level ${level}`);
      return mockLevelData[level];
    }
    
    throw error;
  }
};

/**
 * Submits user answers to the current level and fetches the next level content
 * @param currentLevel The current level number
 * @param questions The assessment questions from the current level
 * @param answers User's answers to the questions
 * @param files Files processed for API submission
 * @returns LevelData for the next level
 */
export const submitAnswersAndGetNextLevel = async (
  currentLevel: number,
  questions: AssessmentQuestion[],
  answers: Record<string, string[]>,
  files: Record<string, any>
): Promise<LevelData> => {
  // Package the questionnaire
  const questionnaire = {
    questions,
    answers
  };
  
  // Fetch the next level content
  return fetchLevelContent(currentLevel + 1, files, questionnaire);
};