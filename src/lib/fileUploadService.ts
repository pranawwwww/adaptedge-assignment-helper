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
    console.log('📁 [FileUpload] Processing files for upload:', files.length, 'files');
    files.forEach((file, i) => {
      console.log(`📁 [FileUpload] File ${i+1}: ${file.name} (${file.type}, ${file.size} bytes)`);
    });
    
    // The backend API expects an object with specific keys
    const result: Record<string, any> = {};
    
    // First file is considered the assignment
    if (files.length > 0) {
      const assignmentFile = files[0];
      console.log(`📁 [FileUpload] Processing assignment file: ${assignmentFile.name}`);
      
      // For text files, convert to plain text
      if (
        assignmentFile.type === 'text/plain' ||
        assignmentFile.name.endsWith('.txt') ||
        assignmentFile.name.endsWith('.md')
      ) {
        console.log('📁 [FileUpload] Converting assignment file to text');
        const content = await fileToText(assignmentFile);
        result.assignment = {
          name: assignmentFile.name,
          content: content
        };
        console.log(`📁 [FileUpload] Assignment text length: ${content.length} chars`);
      } else {
        // For other files, use base64
        console.log('📁 [FileUpload] Converting assignment file to base64');
        const content = await fileToBase64(assignmentFile);
        result.assignment = {
          name: assignmentFile.name,
          content: content,
          encoding: 'base64'
        };
        console.log(`📁 [FileUpload] Assignment base64 length: ${content.length} chars`);
      }
    }
    
    // Additional files are considered resources
    if (files.length > 1) {
      result.resources = [];
      console.log(`📁 [FileUpload] Processing ${files.length - 1} resource files`);
      
      for (let i = 1; i < files.length; i++) {
        const resourceFile = files[i];
        console.log(`📁 [FileUpload] Processing resource file ${i}: ${resourceFile.name}`);
        
        // For text files, convert to plain text
        if (
          resourceFile.type === 'text/plain' ||
          resourceFile.name.endsWith('.txt')
        ) {
          console.log(`📁 [FileUpload] Converting resource file ${i} to text`);
          const content = await fileToText(resourceFile);
          result.resources.push({
            name: resourceFile.name,
            content: content
          });
          console.log(`📁 [FileUpload] Resource ${i} text length: ${content.length} chars`);
        } else {
          // For other files, use base64
          console.log(`📁 [FileUpload] Converting resource file ${i} to base64`);
          const content = await fileToBase64(resourceFile);
          result.resources.push({
            name: resourceFile.name,
            content: content,
            encoding: 'base64'
          });
          console.log(`📁 [FileUpload] Resource ${i} base64 length: ${content.length} chars`);
        }
      }
    }
    
    console.log('📁 [FileUpload] File processing complete:', 
      result.assignment ? 'Assignment present' : 'No assignment',
      result.resources ? `${result.resources.length} resources` : 'No resources');
    
    return result;
  } catch (error) {
    console.error('📁 [FileUpload] Error processing files:', error);
    throw error;
  }
};