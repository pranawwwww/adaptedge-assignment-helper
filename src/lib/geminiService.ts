import { LevelData } from './masterLevelService';
// Assuming fileToBase64 is correctly implemented elsewhere if needed,
// but it's not directly used in this service based on the input structure.
// import { fileToBase64 } from './fileUploadService';

// --- Security Warning ---
// API key is fetched from either GitHub environment variables or local .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// --- Configuration ---
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';
const MODEL_NAME = 'gemini-1.5-flash-latest';
const API_URL = `${API_BASE_URL}${MODEL_NAME}:generateContent`;


// --- Gemini API Types ---
interface GeminiRequestPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string; // base64 encoded data
  };
  // Add fileData for v1beta file API if you use that approach
  // fileData?: {
  //   mimeType: string;
  //   fileUri: string; // URI obtained from File API upload
  // };
}

interface GeminiContent {
  role: 'user' | 'model'; // Typically 'user' for requests, 'model' for responses/history
  parts: GeminiRequestPart[];
}

interface GeminiRequest {
  contents: GeminiContent[];
  // Add generationConfig, safetySettings if needed
  // generationConfig?: { temperature?: number; maxOutputTokens?: number; ... };
  // safetySettings?: { category: string; threshold: string; }[];
}

interface GeminiResponseCandidate {
  content: GeminiContent;
  finishReason: string;
  // Add safetyRatings, citationMetadata, etc. if needed
}

interface GeminiResponse {
  candidates: GeminiResponseCandidate[];
  // Add promptFeedback if needed
}

// --- Input File Types ---
interface FileInput {
  name: string;
  content: string; // Can be text or base64 data
  encoding: 'text' | 'base64'; // Explicitly define encoding
  // mimeType could be pre-calculated and added here if known reliably
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
  // Consider making the path/levels more dynamic if needed
  if (level < 0 || level > 6) { // Updated to include level 6
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
    // Re-throw a more specific error for the caller
    throw new Error(`Failed to load prompt for level ${level}. ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get a best-effort MIME type based on file extension.
 * Note: Gemini Vision has specific supported MIME types for inlineData.
 * Office formats (.doc, .ppt) are generally NOT directly supported as inlineData.
 * Consider converting them to text or PDF first.
 * See: https://ai.google.dev/gemini-api/docs/prompting_with_media#supported_files
 */
function getMimeType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    // Common types likely supported by Vision API
    case 'pdf': return 'application/pdf';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'webp': return 'image/webp';
    case 'heic': return 'image/heic';
    case 'heif': return 'image/heif';
    // Audio/Video (check docs for specific codecs if using)
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'mp4': return 'video/mp4';
    // Text-based types
    case 'txt': return 'text/plain';
    case 'md': return 'text/markdown';
    case 'html': return 'text/html';
    case 'css': return 'text/css';
    case 'js': return 'text/javascript';
    case 'json': return 'application/json';
    case 'csv': return 'text/csv';
    // Types *unlikely* to be supported directly as inlineData by Gemini Vision
    case 'doc': return 'application/msword'; // Consider text extraction
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // Consider text extraction or PDF conversion
    case 'ppt': return 'application/vnd.ms-powerpoint'; // Consider PDF conversion
    case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; // Consider PDF conversion
    case 'rtf': return 'application/rtf'; // Consider text extraction
    // Default fallback
    default: return 'application/octet-stream';
  }
}

/**
 * Process files into Gemini-compatible format (GeminiRequestPart[]).
 * @param files Files to process, adhering to the FilesInput structure.
 * @returns Array of GeminiRequestPart objects.
 */
export async function processFilesForGemini(
  files: FilesInput
): Promise<GeminiRequestPart[]> {
  const parts: GeminiRequestPart[] = [];

  try {
    // Process assignment file
    if (files.assignment) {
      const file = files.assignment;
      if (file.encoding === 'base64') {
        const mimeType = getMimeType(file.name);
        console.warn(`Attempting to send ${file.name} (${mimeType}) as inlineData. Ensure this MIME type is supported by the Gemini model.`);
        parts.push({
          inlineData: { mimeType, data: file.content }
        });
      } else { // Text content
        parts.push({
          text: `--- Assignment File: ${file.name} ---\n\n${file.content}\n\n--- End Assignment File ---`
        });
      }
    }

    // Process resource files
    if (files.resources && Array.isArray(files.resources)) {
      for (const resource of files.resources) {
        if (resource.encoding === 'base64') {
          const mimeType = getMimeType(resource.name);
           console.warn(`Attempting to send ${resource.name} (${mimeType}) as inlineData. Ensure this MIME type is supported by the Gemini model.`);
          parts.push({
            inlineData: { mimeType, data: resource.content }
          });
        } else { // Text content
          parts.push({
            text: `--- Resource File: ${resource.name} ---\n\n${resource.content}\n\n--- End Resource File ---`
          });
        }
      }
    }

    return parts;
  } catch (error) {
    console.error('Error processing files for Gemini:', error);
    throw new Error('Failed to process files for Gemini API request.');
  }
}


/**
 * Extracts JSON content, potentially cleaning it up (e.g., removing markdown code fences).
 * @param text The raw text potentially containing JSON.
 * @returns The parsed JSON object or null if parsing fails.
 */
function extractAndParseJson(text: string): any | null {
    try {
        // Attempt 1: Direct parsing
        return JSON.parse(text);
    } catch (e1) {
        // Attempt 2: Look for JSON within markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            try {
                return JSON.parse(jsonMatch[1]);
            } catch (e2) {
                console.warn("Found JSON code block, but parsing failed:", e2);
                // Fall through to structured text parsing if enabled
            }
        }
        // console.warn("Direct JSON parsing failed, and no valid JSON code block found.", e1); // Optional logging
        return null; // Indicate JSON parsing failed
    }
}

/**
 * Parse Gemini response (ideally JSON) into LevelData format.
 * **Recommendation:** Modify prompts to ask Gemini for JSON output.
 * The structured text fallback is brittle and less reliable.
 * @param responseText The text response from Gemini.
 * @param level The level number (used for fallback context).
 * @returns LevelData formatted object.
 */
export function parseGeminiResponse(responseText: string, level: number): LevelData {
    try {
        // --- Preferred Method: Parse JSON ---
        const parsedJson = extractAndParseJson(responseText);

        if (parsedJson && typeof parsedJson === 'object') {
            console.log(`Parsed JSON response for level ${level}:`, parsedJson);
            
            // Basic validation: check for expected top-level keys
            if ('main_content_md' in parsedJson || 'flashcards' in parsedJson || 'assessment_questions' in parsedJson || 
                (level === 5 && ('feedback_md' in parsedJson || 'practice_assignment_md' in parsedJson || 'solution_md' in parsedJson))) {
                console.log("Successfully parsed JSON response from Gemini.");
                 
                // Special handling for Level 5 structure
                if (level === 5) {
                    // Create or enhance main_content_md by combining practice assignment and solution
                    let mainContent = parsedJson.main_content_md || '';
                    
                    if (parsedJson.practice_assignment_md) {
                        mainContent += (mainContent ? '\n\n' : '') + parsedJson.practice_assignment_md;
                    }
                    
                    if (parsedJson.solution_md) {
                        mainContent += (mainContent ? '\n\n' : '') + parsedJson.solution_md;
                    }
                    
                    // Update the main_content_md with our combined content
                    if (mainContent) {
                        parsedJson.main_content_md = mainContent;
                    }
                    
                    console.log("Processed level 5 content with specialized handling");
                }
                 
                // Build the final response object
                return {
                    status: parsedJson.status || "LEVEL_" + level + "_OVERVIEW",
                    // Use || '' or || [] for graceful fallback if keys exist but are null/undefined
                    main_content_md: parsedJson.main_content_md || parsedJson.main_conent_md || "", // Handle common typo too
                    assignment_summary_md: parsedJson.assignment_summary_md || "", 
                    feedback_md: parsedJson.feedback_md || "", 
                    flashcards: Array.isArray(parsedJson.flashcards) ? parsedJson.flashcards : [],
                    assessment_questions: Array.isArray(parsedJson.assessment_questions) ? parsedJson.assessment_questions : [],
                };
            } else {
                console.warn("Parsed JSON, but it doesn't contain expected keys. Proceeding with text parsing attempt.");
            }
        } else {
            console.log("Response was not valid JSON or couldn't be extracted. Attempting structured text parsing.");
        }

        // --- Fallback Method: Structured Text Parsing (Less Reliable) ---
        // If you *must* use text parsing, make it as robust as possible,
        // but strongly advise switching prompts to output JSON.
        console.warn("Parsing Gemini response as structured text. This is less reliable than JSON output.");
        const result: LevelData = {
            status: "success", // Assume success unless parsing completely fails
            main_content_md: "",
            flashcards: [],
            assessment_questions: []
        };

        // Use regex with flexible whitespace matching (\s*) and case-insensitivity (i flag) if needed
        const flashcardHeader = /###\s*FLASHCARDS/i;
        const assessmentHeader = /###\s*ASSESSMENT/i;
        const questionSeparator = /####\s+/; // Matches '#### '

        let remainingText = responseText;

        // Extract main content
        const flashcardMatch = remainingText.search(flashcardHeader);
        const assessmentMatchAfterMain = remainingText.search(assessmentHeader);
        let endOfMainContent = -1;

        if (flashcardMatch !== -1 && assessmentMatchAfterMain !== -1) {
            endOfMainContent = Math.min(flashcardMatch, assessmentMatchAfterMain);
        } else if (flashcardMatch !== -1) {
            endOfMainContent = flashcardMatch;
        } else if (assessmentMatchAfterMain !== -1) {
            endOfMainContent = assessmentMatchAfterMain;
        }

        if (endOfMainContent !== -1) {
            result.main_content_md = remainingText.substring(0, endOfMainContent).trim();
            remainingText = remainingText.substring(endOfMainContent);
        } else {
             // Assume the whole text is main content if no headers found
             result.main_content_md = remainingText.trim();
             remainingText = ""; // No more text left
             console.warn("Could not find '### FLASHCARDS' or '### ASSESSMENT' headers. Assuming entire response is main content.");
        }

        // Extract flashcards
        const flashcardBlockMatch = remainingText.match(new RegExp(flashcardHeader.source + '\\s*([\\s\\S]*?)(?=' + assessmentHeader.source + '|$)','i'));
        if (flashcardBlockMatch && flashcardBlockMatch[1]) {
            const flashcardsText = flashcardBlockMatch[1].trim();
            const flashcardBlocks = flashcardsText.split(questionSeparator).filter(b => b.trim()); // Split by #### and filter empty

            for (const block of flashcardBlocks) {
                const lines = block.trim().split('\n');
                const heading = lines[0]?.trim();
                const content = lines.slice(1).join('\n').trim();
                if (heading && content) {
                    result.flashcards.push({ heading, flashcard_content: content });
                } else {
                     console.warn("Skipping malformed flashcard block:", block);
                }
            }
             // Adjust remainingText for assessment parsing
             const assessmentIndexInRemaining = remainingText.search(assessmentHeader);
             if (assessmentIndexInRemaining !== -1) {
                 remainingText = remainingText.substring(assessmentIndexInRemaining);
             } else {
                 remainingText = ""; // No assessment found after flashcards
             }
        } else if (result.main_content_md !== responseText.trim()) { // Only warn if headers were expected
             console.warn("Could not find or parse content under '### FLASHCARDS'.");
        }


        // Extract assessment questions
        const assessmentBlockMatch = remainingText.match(new RegExp(assessmentHeader.source + '\\s*([\\s\\S]*?)$','i'));
        if (assessmentBlockMatch && assessmentBlockMatch[1]) {
            const assessmentText = assessmentBlockMatch[1].trim();
            const questionBlocks = assessmentText.split(questionSeparator).filter(b => b.trim()); // Split by #### and filter empty

            for (let i = 0; i < questionBlocks.length; i++) {
                 const block = questionBlocks[i];
                 const lines = block.trim().split('\n').filter(line => line.trim());
                 if (lines.length < 3) { // Need at least question, one option, answer line
                     console.warn(`Skipping malformed assessment question block ${i + 1}:`, block);
                     continue;
                 }

                 const questionText = lines[0].trim();
                 // Find the line indicating the correct answer
                 let correctAnswerLineIndex = -1;
                 let correctAnswerLetter = '';
                 for(let j = lines.length - 1; j >= 1; j--) { // Search from bottom up
                    const answerMatch = lines[j].match(/Correct Answer:\s*([A-Z])/i);
                    if (answerMatch) {
                        correctAnswerLineIndex = j;
                        correctAnswerLetter = answerMatch[1].toUpperCase();
                        break;
                    }
                 }

                 if (correctAnswerLineIndex === -1) {
                    console.warn(`Could not find 'Correct Answer: X' line for question block ${i + 1}:`, block);
                    continue; // Skip if answer not found
                 }

                 // Options are lines between question and answer line
                 const options = lines.slice(1, correctAnswerLineIndex).map(line =>
                     line.replace(/^[A-Z][.)]\s*/, '').trim() // Remove "A.", "B)", etc.
                 );

                 if (options.length === 0) {
                     console.warn(`Could not extract options for question block ${i + 1}:`, block);
                     continue;
                 }

                 const correctAnswerIndex = correctAnswerLetter.charCodeAt(0) - 'A'.charCodeAt(0);
                 const correctAnswerText = options[correctAnswerIndex];

                 if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length || !correctAnswerText) {
                     console.warn(`Correct answer letter '${correctAnswerLetter}' is invalid or out of bounds for options in question block ${i + 1}:`, block);
                     // Fallback or skip? Let's skip for now.
                     continue;
                 }

                 result.assessment_questions.push({
                    id: `q${level}-${i + 1}`, // Make ID more unique
                    concept_focus: `Level ${level} concept`, // Could be improved if provided by AI
                    type: 'MCQ',
                    question_text: questionText,
                    options: options,
                    correct_answers: [correctAnswerText] // Store the text of the correct answer
                 });
            }
        } else if (result.main_content_md !== responseText.trim()) { // Only warn if headers were expected
             console.warn("Could not find or parse content under '### ASSESSMENT'.");
        }

        // Final check: if after all text parsing, nothing was populated, maybe it's an error state
        if (!result.main_content_md && result.flashcards.length === 0 && result.assessment_questions.length === 0) {
             console.warn("Text parsing yielded no content. Returning potentially empty result.");
             // Optionally, you could change status to "error" here if empty is unexpected
             // result.status = "error";
             // result.main_content_md = "Failed to parse structured text response from Gemini.";
        }

        return result;

    } catch (error) {
        console.error('Critical error during Gemini response parsing:', error);
        return {
            status: "error",
            main_content_md: `Failed to parse Gemini response. Error: ${error instanceof Error ? error.message : String(error)} \n\nRaw Response:\n${responseText}`,
            flashcards: [],
            assessment_questions: []
        };
    }
}

/**
 * Call the Gemini API with prompt, files, and optional questionnaire data.
 * @param level The level to get content for.
 * @param files Object containing files data according to FilesInput interface.
 * @param questionnaireData Optional previous level questions and answers.
 * @param answersDocument Optional answers document for level 6 final review.
 * @returns Promise resolving to LevelData.
 */
export async function callGeminiAPI(
  level: number,
  files: FilesInput,
  questionnaireData?: {
    questions: any[]; // Keep any for now, refine if Question structure is known
    answers: Record<string, string[]>; // Map of question ID to selected answer(s)
  },
  answersDocument?: {
    name: string;
    content: string;
    type: string;
  }
): Promise<LevelData> {
  if (!API_KEY) {
    console.error('Gemini API key is missing. Please configure VITE_GEMINI_API_KEY.');
    // Don't throw raw error, return structured error response
    return {
       status: "error",
       main_content_md: "Configuration error: Gemini API key is missing.",
       flashcards: [],
       assessment_questions: []
    };
  }

  try {
    // 1. Fetch the prompt
    const promptTemplate = await fetchPrompt(level);

    // 2. Process files
    const fileParts = await processFilesForGemini(files);

    // 3. Prepare the final user prompt text, including questionnaire data if applicable
    let userPromptText = promptTemplate;

    // For level 6, inject the answers document content into the prompt
    if (level === 6 && answersDocument) {
      userPromptText = userPromptText.replace('{{ANSWERS_DOCUMENT}}', answersDocument.content);
      console.log(`Inserted answers document content (${answersDocument.content.length} characters) into prompt for level 6.`);
    }

    if (level > 0 && questionnaireData && questionnaireData.questions?.length > 0) {
      const { questions, answers } = questionnaireData;
      const questionnaireSummary = questions.map((q, i) => {
        const questionId = q?.id; // Use optional chaining
        if (!questionId) return `Question ${i + 1}: (Missing ID) ${q?.question_text || 'Unknown Question'}`;

        const userAnswers = answers[questionId] || [];
        const answersString = userAnswers.length > 0 ? userAnswers.join(', ') : 'No answer provided';
        return `Previous Question ${i + 1} (ID: ${questionId}): ${q.question_text}\nUser's Answer: ${answersString}`;
      }).join('\n\n');

      // Append clearly marked section
      userPromptText += `\n\n--- PREVIOUS LEVEL ASSESSMENT RESPONSES ---\n${questionnaireSummary}\n--- END PREVIOUS RESPONSES ---`;
    } else if (level > 0) {
         userPromptText += `\n\n--- PREVIOUS LEVEL ASSESSMENT RESPONSES ---\n(No previous assessment data provided or applicable)\n--- END PREVIOUS RESPONSES ---`;
    }

    // 4. Construct the request payload
    const requestBody: GeminiRequest = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: userPromptText }, // Main text prompt part
            ...fileParts             // Parts generated from files
          ]
        }
        // Add model history here if implementing multi-turn conversation
        // { role: 'model', parts: [...] },
        // { role: 'user', parts: [...] }
      ],
      // Add generationConfig or safetySettings if needed
      // generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    };

    // 5. Make the API request
    console.log(`%c🚀 Calling Gemini API (Level ${level}) Model: ${MODEL_NAME}`, 'background:#f0f0f0; color:#333; padding:4px; border-radius:3px;');
    // console.log("Request Body:", JSON.stringify(requestBody, null, 2)); // Optional: Log request body for debugging

    const url = `${API_URL}?key=${API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // 6. Handle API response
    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json(); // Try to parse error JSON from Gemini
        console.error('Gemini API Error Response:', errorBody);
      } catch (e) {
        errorBody = await response.text(); // Fallback to text
        console.error('Gemini API Error Response (non-JSON):', errorBody);
      }
      // Construct a meaningful error message
      const errorMessage = errorBody?.error?.message || response.statusText || `HTTP error ${response.status}`;
      throw new Error(`Gemini API request failed: ${response.status} ${errorMessage}`);
    }

    const responseData: GeminiResponse = await response.json();

    // 7. Extract and parse the generated content
    // Handle cases where candidates might be empty or lack content
    const candidate = responseData.candidates?.[0];
    if (!candidate) {
        console.error("Gemini response missing candidates array.", responseData);
        throw new Error("Gemini API returned an unexpected response structure (no candidates).");
    }
     if (candidate.finishReason !== "STOP" && candidate.finishReason !== "MAX_TOKENS") {
         console.warn(`Gemini generation finished with reason: ${candidate.finishReason}. Output might be incomplete or blocked.`);
         // Potentially inspect safetyRatings if reason is SAFETY related
     }

    // Combine text parts if the response happens to split them (though usually not for simple text)
    const responseText = candidate.content?.parts?.map(part => part.text || '').join('') || '';

    if (!responseText) {
        console.warn("Gemini API returned a candidate but with no text content.", candidate);
        // Decide how to handle: error or empty success? Returning error for now.
         return {
            status: "error",
            main_content_md: "Gemini returned an empty response.",
            flashcards: [],
            assessment_questions: []
         };
    }

    console.log(`%c📝 GEMINI RAW RESPONSE (Level ${level}):`, 'background:#4285F4; color:white; padding:4px; border-radius:3px; font-weight:bold;');
    console.log(responseText); // Log raw text before parsing

    // 8. Parse the response text into LevelData
    return parseGeminiResponse(responseText, level);

  } catch (error: any) {
    console.error(`Error in callGeminiAPI for level ${level}:`, error);
    // Return a structured error in the expected LevelData format
    return {
      status: "error",
      main_content_md: `An error occurred while processing Level ${level}: ${error.message || String(error)}`,
      flashcards: [],
      assessment_questions: []
    };
  }
}