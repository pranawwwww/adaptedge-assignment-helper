/**
 * Service for handling file uploads and converting them to formats needed for API requests
 */

/**
 * Converts a File object to base64 encoding
 * @param file The file to convert
 * @returns Promise resolving to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract the base64 content from the data URL
      const base64String = reader.result?.toString().split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts a File object to text content
 * @param file The file to convert
 * @returns Promise resolving to file text content
 */
export const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error('Failed to read file content'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Process files for API submission in the correct format
 * @param files Array of files to process
 * @returns Promise resolving to the formatted files object expected by the API
 */
export const processFilesForUpload = async (
  files: File[]
): Promise<Record<string, any>> => {
  try {
    // The backend API expects an object with specific keys
    const result: Record<string, any> = {};
    
    // First file is considered the assignment
    if (files.length > 0) {
      const assignmentFile = files[0];
      // For text files, convert to plain text
      if (
        assignmentFile.type === 'text/plain' ||
        assignmentFile.name.endsWith('.txt') ||
        assignmentFile.name.endsWith('.md')
      ) {
        const content = await fileToText(assignmentFile);
        result.assignment = {
          name: assignmentFile.name,
          content: content
        };
      } else {
        // For other files, use base64
        const content = await fileToBase64(assignmentFile);
        result.assignment = {
          name: assignmentFile.name,
          content: content,
          encoding: 'base64'
        };
      }
    }
    
    // Additional files are considered resources
    if (files.length > 1) {
      result.resources = [];
      
      for (let i = 1; i < files.length; i++) {
        const resourceFile = files[i];
        // For text files, convert to plain text
        if (
          resourceFile.type === 'text/plain' ||
          resourceFile.name.endsWith('.txt')
        ) {
          const content = await fileToText(resourceFile);
          result.resources.push({
            name: resourceFile.name,
            content: content
          });
        } else {
          // For other files, use base64
          const content = await fileToBase64(resourceFile);
          result.resources.push({
            name: resourceFile.name,
            content: content,
            encoding: 'base64'
          });
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error processing files:', error);
    throw error;
  }
};