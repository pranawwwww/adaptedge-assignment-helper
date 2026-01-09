import { LevelData } from './masterLevelService';

// --- Security Warning ---
// API key is fetched from environment variables
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// --- Configuration ---
const API_BASE_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL_NAME = 'gpt-4o-mini'; // Using GPT-4o-mini - fast, affordable, great quality

// --- Input File Types ---
interface FileInput {
  name: string;
  content: string;
  encoding: 'text' | 'base64';
}

interface FilesInput {
  assignment?: FileInput;
  resources?: FileInput[];
}

/**
 * Fetch a prompt from the prompts directory.
 * @param level The level number (e.g., 0-6)
 * @returns Promise resolving to the prompt text content.
 */
export async function fetchPrompt(level: number): Promise<string> {
  if (level < 0 || level > 6) {
    console.error(`Invalid level requested: ${level}`);
    throw new Error(`Invalid level: ${level}. Must be between 0 and 6.`);
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  const promptPath = `${baseUrl}prompts/level${level}.txt`;
  try {
    const response = await fetch(promptPath);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} fetching ${promptPath}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching prompt for level ${level} from ${promptPath}:`, error);
    throw new Error(`Failed to load prompt for level ${level}. ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Process files into text format for OpenAI.
 * @param files Files to process
 * @returns String containing all file contents
 */
export async function processFilesForOpenAI(files: FilesInput): Promise<string> {
  let filesText = '';

  try {
    // Process assignment file
    if (files.assignment) {
      const file = files.assignment;
      if (file.encoding === 'base64') {
        filesText += `\n\n--- Assignment File: ${file.name} (Binary file - content may not be fully readable) ---\n\n`;
        // For base64 files, we'll note them but can't process binary data in text
        filesText += `[Binary file: ${file.name}]\n`;
      } else {
        filesText += `\n\n--- Assignment File: ${file.name} ---\n\n${file.content}\n\n--- End Assignment File ---\n`;
      }
    }

    // Process resource files
    if (files.resources && Array.isArray(files.resources)) {
      for (const resource of files.resources) {
        if (resource.encoding === 'base64') {
          filesText += `\n\n--- Resource File: ${resource.name} (Binary file - content may not be fully readable) ---\n\n`;
          filesText += `[Binary file: ${resource.name}]\n`;
        } else {
          filesText += `\n\n--- Resource File: ${resource.name} ---\n\n${resource.content}\n\n--- End Resource File ---\n`;
        }
      }
    }

    return filesText;
  } catch (error) {
    console.error('Error processing files for OpenAI:', error);
    throw new Error('Failed to process files for OpenAI API request.');
  }
}

/**
 * Parse OpenAI response into LevelData format.
 * @param responseText The text response from OpenAI.
 * @param level The level number.
 * @returns LevelData formatted object.
 */
export function parseOpenAIResponse(responseText: string, level: number): LevelData {
  try {
    // Try to parse as JSON first
    let parsedJson: any;

    // Clean the response text - remove any markdown wrapper if present
    let cleanedText = responseText.trim();

    // Remove outer markdown code fences if present
    const outerJsonMatch = cleanedText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
    if (outerJsonMatch && outerJsonMatch[1]) {
      cleanedText = outerJsonMatch[1];
    }

    // Parse the JSON
    parsedJson = JSON.parse(cleanedText);

    console.log(`Parsed JSON response for level ${level}:`, parsedJson);

    // Validate and return
    if (parsedJson && typeof parsedJson === 'object') {
      // Special handling for Level 5 structure
      if (level === 5) {
        let mainContent = parsedJson.main_content_md || '';

        if (parsedJson.practice_assignment_md) {
          mainContent += (mainContent ? '\n\n' : '') + parsedJson.practice_assignment_md;
        }

        if (parsedJson.solution_md) {
          mainContent += (mainContent ? '\n\n' : '') + parsedJson.solution_md;
        }

        if (mainContent) {
          parsedJson.main_content_md = mainContent;
        }
      }

      return {
        status: parsedJson.status || "LEVEL_" + level + "_OVERVIEW",
        main_content_md: parsedJson.main_content_md || parsedJson.main_conent_md || "",
        assignment_summary_md: parsedJson.assignment_summary_md || "",
        feedback_md: parsedJson.feedback_md || "",
        flashcards: Array.isArray(parsedJson.flashcards) ? parsedJson.flashcards : [],
        assessment_questions: Array.isArray(parsedJson.assessment_questions) ? parsedJson.assessment_questions : [],
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Critical error during OpenAI response parsing:', error);
    return {
      status: "error",
      main_content_md: `Failed to parse OpenAI response. Error: ${error instanceof Error ? error.message : String(error)}\n\nRaw Response:\n${responseText}`,
      flashcards: [],
      assessment_questions: []
    };
  }
}

/**
 * Call the OpenAI API with prompt, files, and optional questionnaire data.
 * @param level The level to get content for.
 * @param files Object containing files data.
 * @param questionnaireData Optional previous level questions and answers.
 * @param answersDocument Optional answers document for level 6.
 * @returns Promise resolving to LevelData.
 */
export async function callOpenAI(
  level: number,
  files: FilesInput,
  questionnaireData?: {
    questions: any[];
    answers: Record<string, string[]>;
  },
  answersDocument?: {
    name: string;
    content: string;
    type: string;
  }
): Promise<LevelData> {
  if (!API_KEY) {
    console.error('OpenAI API key is missing. Please configure VITE_OPENAI_API_KEY.');
    return {
      status: "error",
      main_content_md: "Configuration error: OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file.",
      flashcards: [],
      assessment_questions: []
    };
  }

  try {
    // 1. Fetch the prompt
    const promptTemplate = await fetchPrompt(level);

    // 2. Process files
    const filesContent = await processFilesForOpenAI(files);

    // 3. Prepare the final user prompt text
    let userPromptText = promptTemplate;

    // For level 6, inject the answers document content
    if (level === 6 && answersDocument) {
      userPromptText = userPromptText.replace('{{ANSWERS_DOCUMENT}}', answersDocument.content);
      console.log(`Inserted answers document content (${answersDocument.content.length} characters) into prompt for level 6.`);
    }

    // Add questionnaire data if applicable
    if (level > 0 && questionnaireData && questionnaireData.questions?.length > 0) {
      const { questions, answers } = questionnaireData;
      const questionnaireSummary = questions.map((q, i) => {
        const questionId = q?.id;
        if (!questionId) return `Question ${i + 1}: (Missing ID) ${q?.question_text || 'Unknown Question'}`;

        const userAnswers = answers[questionId] || [];
        const answersString = userAnswers.length > 0 ? userAnswers.join(', ') : 'No answer provided';
        return `Previous Question ${i + 1} (ID: ${questionId}): ${q.question_text}\nUser's Answer: ${answersString}`;
      }).join('\n\n');

      userPromptText += `\n\n--- PREVIOUS LEVEL ASSESSMENT RESPONSES ---\n${questionnaireSummary}\n--- END PREVIOUS RESPONSES ---`;
    } else if (level > 0) {
      userPromptText += `\n\n--- PREVIOUS LEVEL ASSESSMENT RESPONSES ---\n(No previous assessment data provided or applicable)\n--- END PREVIOUS RESPONSES ---`;
    }

    // 4. Construct the request payload
    const requestBody = {
      model: MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational AI assistant specializing in creating personalized learning materials. You MUST respond with valid JSON only - no markdown code blocks, no extra formatting. If you need to include code examples in your content, use escaped strings within the JSON values, not markdown code blocks. All code examples should be plain text within the JSON string values.'
        },
        {
          role: 'user',
          content: userPromptText + filesContent
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    };

    // 5. Make the API request
    console.log(`%c🚀 Calling OpenAI API (Level ${level}) Model: ${MODEL_NAME}`, 'background:#10a37f; color:white; padding:4px; border-radius:3px;');

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody),
    });

    // 6. Handle API response
    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
        console.error('OpenAI API Error Response:', errorBody);
      } catch (e) {
        errorBody = await response.text();
        console.error('OpenAI API Error Response (non-JSON):', errorBody);
      }
      const errorMessage = errorBody?.error?.message || response.statusText || `HTTP error ${response.status}`;
      throw new Error(`OpenAI API request failed: ${response.status} ${errorMessage}`);
    }

    const responseData = await response.json();

    // 7. Extract the generated content
    const assistantMessage = responseData.choices?.[0]?.message?.content;
    if (!assistantMessage) {
      console.warn("OpenAI API returned empty response.", responseData);
      return {
        status: "error",
        main_content_md: "OpenAI returned an empty response.",
        flashcards: [],
        assessment_questions: []
      };
    }

    console.log(`%c📝 OPENAI RAW RESPONSE (Level ${level}):`, 'background:#10a37f; color:white; padding:4px; border-radius:3px; font-weight:bold;');
    console.log(assistantMessage);

    // 8. Parse the response
    return parseOpenAIResponse(assistantMessage, level);

  } catch (error: any) {
    console.error(`Error in callOpenAI for level ${level}:`, error);
    return {
      status: "error",
      main_content_md: `An error occurred while processing Level ${level}: ${error.message || String(error)}`,
      flashcards: [],
      assessment_questions: []
    };
  }
}
