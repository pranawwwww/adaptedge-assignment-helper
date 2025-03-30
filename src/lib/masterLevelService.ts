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
  assignment_summary_md?: string; // For level 0 assignment overview
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

// Import Gemini API service
import { callGeminiAPI } from './geminiService';
import { create } from 'zustand';

// Create a store for the loading state to track API calls throughout the app
interface LoadingState {
  isLoading: boolean;
  message: string;
  setLoading: (isLoading: boolean, message?: string) => void;
}

export const useLoadingState = create<LoadingState>((set) => ({
  isLoading: false,
  message: "Processing your request...",
  setLoading: (isLoading, message = "Processing your request...") => set({ 
    isLoading,
    message: isLoading ? message : ""
  }),
}));

/**
 * Fetches level content using Gemini API
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
  console.log('=== fetchLevelContent ===');
  console.log('Level:', level);
  console.log('Files provided:', files ? 'Yes' : 'No');
  console.log('Questionnaire provided:', questionnaire ? 'Yes' : 'No');
  console.log('API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'Present' : 'Missing');
  
  // Set loading state
  const setLoading = useLoadingState.getState().setLoading;
  setLoading(true, getLevelLoadingMessage(level));
  
  try {
    // Ensure we have files for the API request
    let filesForRequest = files;
    
    // If no files were provided, try to get them from session storage
    if (!filesForRequest || Object.keys(filesForRequest).length === 0) {
      console.log('No files provided directly, attempting to retrieve from session storage');
      const storedFiles = sessionStorage.getItem('uploadedFiles');
      if (storedFiles) {
        try {
          filesForRequest = JSON.parse(storedFiles);
          console.log(`Retrieved files from session storage for API request: ${
            typeof filesForRequest === 'object' ? JSON.stringify(Object.keys(filesForRequest)) : 'none'
          }`);
        } catch (error) {
          console.error('Error parsing stored files for API request:', error);
        }
      } else {
        console.warn('No files found in session storage');
      }
    }
    
    // For level 6, check for answers document in session storage
    let answersDocument = null;
    if (level === 6) {
      console.log('Level 6 detected, looking for answers document in session storage');
      const storedAnswersDoc = sessionStorage.getItem('answersDocument');
      if (storedAnswersDoc) {
        try {
          answersDocument = JSON.parse(storedAnswersDoc);
          console.log('Retrieved answers document from session storage:', answersDocument.name);
        } catch (error) {
          console.error('Error parsing answers document:', error);
        }
      } else {
        console.warn('No answers document found in session storage for level 6');
      }
    }
    
    console.log('Calling Gemini API with:');
    console.log(`- Level: ${level}`);
    console.log(`- Files: ${filesForRequest ? Object.keys(filesForRequest).length : 0} items`);
    console.log(`- Questionnaire: ${questionnaire ? 'Yes' : 'No'}`);
    console.log(`- Answers document: ${answersDocument ? 'Yes' : 'No'}`);
    
    // Use our Gemini API service to get content
    try {
      const result = await callGeminiAPI(level, filesForRequest || {}, questionnaire, answersDocument);
      console.log('Successfully received Gemini API response');
      console.log(`- Flashcards: ${result.flashcards.length}`);
      console.log(`- Questions: ${result.assessment_questions.length}`);
      console.log(`- Main content length: ${result.main_content_md?.length || 0} chars`);
      return result;
    } catch (error: any) {
      console.error('Error from Gemini API:', error.message);
      throw new Error(`Failed to get content from Gemini: ${error.message}`);
    }
  } catch (error) {
    console.error('Error fetching level content:', error);
    throw error;
  } finally {
    // Clear loading state
    setLoading(false);
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

  // Set loading state with submission-specific message
  const setLoading = useLoadingState.getState().setLoading;
  setLoading(true, `Analyzing your answers and generating Level ${currentLevel + 1} content...`);
  
  try {
    // Fetch the next level content
    return await fetchLevelContent(currentLevel + 1, files, questionnaire);
  } finally {
    // Clear loading state
    setLoading(false);
  }
};

/**
 * Helper function to generate level-specific loading messages
 */
function getLevelLoadingMessage(level: number): string {
  switch(level) {
    case 0:
      return "Analyzing your assignment materials...";
    case 1:
      return "Building your basic understanding content...";
    case 2: 
      return "Developing advanced concepts for your assignment...";
    case 3:
      return "Creating practical application examples...";
    case 4:
      return "Generating expert implementation guidance...";
    case 5:
      return "Preparing mastery level content...";
    case 6:
      return "Evaluating your submitted assignment...";
    default:
      return "Processing your request...";
  }
}