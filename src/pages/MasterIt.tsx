import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Bookmark, BookOpen, CheckCircle, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { 
  fetchLevelContent, 
  submitAnswersAndGetNextLevel,
  type Flashcard,
  type AssessmentQuestion,
  type LevelData
} from '@/lib/masterLevelService';

// Custom components for enhanced markdown rendering
const MarkdownComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-3xl font-bold mb-6 pb-2 border-b border-purple-200 dark:border-purple-800">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-4 text-purple-900 dark:text-purple-300">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xl font-medium mt-5 mb-3 text-purple-800 dark:text-purple-400">{children}</h3>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 ml-4 mb-4">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 ml-4 mb-4">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start">
      <span className="inline-block w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-600 mt-2 mr-2 flex-shrink-0"></span>
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="pl-4 border-l-4 border-purple-300 dark:border-purple-700 italic text-gray-700 dark:text-gray-300 my-4">{children}</blockquote>
  ),
  code: ({ children, className }: { children: React.ReactNode, className?: string }) => {
    if (className?.includes('language-')) {
      // Code block with language
      return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden mb-4 shadow-sm">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-1 text-xs text-gray-600 dark:text-gray-400">
            {className.replace('language-', '')}
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className={className}>{children}</code>
          </pre>
        </div>
      );
    }
    // Inline code
    return (
      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md text-purple-600 dark:text-purple-400 font-mono text-sm">{children}</code>
    );
  },
  a: ({ href, children }: { href?: string, children: React.ReactNode }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      {children}
    </a>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="my-4 leading-relaxed">{children}</p>
  ),
};

// Level titles based on status
const levelTitles: Record<string, string> = {
  'LEVEL_0_OVERVIEW': 'Assignment Overview',
  'LEVEL_1_BASIC_UNDERSTANDING': 'Basic Understanding',
  'LEVEL_2_ADVANCED_UNDERSTANDING': 'Advanced Understanding',
  'LEVEL_3_PRACTICAL_APPLICATION': 'Practical Application',
  'LEVEL_4_EXPERT_IMPLEMENTATION': 'Expert Implementation',
  'LEVEL_5_MASTERY': 'Mastery'
};

// Progress states for tracking user progress through the content
type ProgressState = 'reading' | 'flashcards' | 'questions' | 'completed';

// Available levels
const availableLevels = [
  { id: 0, title: 'Assignment Overview' },
  { id: 1, title: 'Basic Understanding' },
  { id: 2, title: 'Advanced Understanding' },
  { id: 3, title: 'Practical Application' },
  { id: 4, title: 'Expert Implementation' },
  { id: 5, title: 'Mastery' }
];

const MasterIt = () => {
  const { levelId = '0' } = useParams<{ levelId: string }>();
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string[]>>({});
  const [progressState, setProgressState] = useState<ProgressState>('reading');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>[]>([]);
  const [previousQuestions, setPreviousQuestions] = useState<AssessmentQuestion[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Add refs for scrolling
  const flashcardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flashcardsHeaderRef = useRef<HTMLHeadingElement>(null);
  const questionsHeaderRef = useRef<HTMLHeadingElement>(null);

  // Load level content when levelId changes
  useEffect(() => {
    const fetchCurrentLevel = async () => {
      setIsLoading(true);
      try {
        const levelIdNumber = parseInt(levelId);

        // For level 0, we don't need questionnaire
        if (levelIdNumber === 0) {
          // For demo purposes, you might need to populate uploadedFiles from localStorage
          // In a real app, these would come from the file upload component
          const levelData = await fetchLevelContent(levelIdNumber, uploadedFiles);
          setCurrentLevel(levelData);
          // Store current level's questions for later use
          setPreviousQuestions(levelData.assessment_questions);
          
          // Reset level-specific state
          setCurrentFlashcardIndex(0);
          setShowAnswer(false);
          setAnsweredQuestions({});
          setProgressState('reading');
        } else {
          // For higher levels, we need the questionnaire from the previous level
          const levelData = await fetchLevelContent(
            levelIdNumber,
            uploadedFiles,
            {
              questions: previousQuestions,
              answers: answeredQuestions
            }
          );
          setCurrentLevel(levelData);
          // Store current level's questions for next level
          setPreviousQuestions(levelData.assessment_questions);
          
          // Reset level-specific state
          setCurrentFlashcardIndex(0);
          setShowAnswer(false);
          setAnsweredQuestions({});
          setProgressState('reading');
        }
      } catch (error) {
        console.error("Error fetching level content:", error);
        toast({
          title: "Error loading content",
          description: "Failed to load level content. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        // Scroll to top when changing levels
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    fetchCurrentLevel();
  }, [levelId, toast]);

  // Set up refs for flashcards and questions when current level changes
  useEffect(() => {
    if (currentLevel) {
      flashcardRefs.current = Array(currentLevel.flashcards.length).fill(null);
      questionRefs.current = Array(currentLevel.assessment_questions.length).fill(null);
    }
  }, [currentLevel]);

  // Store uploaded files from session storage when component mounts
  useEffect(() => {
    const storedFiles = sessionStorage.getItem('uploadedFiles');
    console.log("MasterIt: Checking for stored files in sessionStorage:", storedFiles ? "Found" : "Not found");
    
    if (storedFiles) {
      try {
        const parsedFiles = JSON.parse(storedFiles);
        console.log("MasterIt: Parsed files from storage:", parsedFiles.length, "files");
        setUploadedFiles(parsedFiles);
      } catch (error) {
        console.error("MasterIt: Error parsing stored files:", error);
        toast({
          title: "Error loading files",
          description: "There was a problem loading your uploaded files. You may need to upload them again.",
          variant: "destructive"
        });
      }
    } else {
      console.warn("MasterIt: No files found in session storage");
    }
  }, [toast]);

  const handleSelectLevel = (id: number) => {
    navigate(`/master-it/${id}`);
  };

  const handleNextFlashcard = () => {
    if (!currentLevel) return;
    
    if (currentFlashcardIndex < currentLevel.flashcards.length - 1) {
      setCurrentFlashcardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // If we've reached the last flashcard, move to questions
      setProgressState('questions');
      // Scroll to questions section with a delay to allow rendering
      setTimeout(() => {
        questionsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handlePrevFlashcard = () => {
    if (!currentLevel) return;
    
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const handleAnswerQuestion = (
    questionId: string, 
    answer: string, 
    questionIndex: number,
    questionType: 'MCQ' | 'MAQ'
  ) => {
    setAnsweredQuestions(prev => {
      const updatedAnswers = { ...prev };
      
      // For MCQ, replace the answer
      if (questionType === 'MCQ') {
        updatedAnswers[questionId] = [answer];
      } 
      // For MAQ, toggle the answer in the array
      else {
        const currentAnswers = updatedAnswers[questionId] || [];
        if (currentAnswers.includes(answer)) {
          updatedAnswers[questionId] = currentAnswers.filter(a => a !== answer);
        } else {
          updatedAnswers[questionId] = [...currentAnswers, answer];
        }
      }
      
      return updatedAnswers;
    });
    
    // For MCQ, scroll to the next question after selection
    if (questionType === 'MCQ') {
      // Scroll to the next question after a short delay
      setTimeout(() => {
        const nextQuestionIndex = questionIndex + 1;
        if (nextQuestionIndex < questionRefs.current.length) {
          questionRefs.current[nextQuestionIndex]?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        } else {
          // If this was the last question, mark as completed
          setProgressState('completed');
        }
      }, 300);
    }
  };

  // Show answer and auto-scroll to next flashcard after delay
  const handleShowAnswer = () => {
    setShowAnswer(true);
    
    // Auto-advance to next card after viewing the answer
    setTimeout(() => {
      handleNextFlashcard();
    }, 1500); // Delay before moving to next card
  };

  // Move from reading to flashcards section
  const handleContinueToFlashcards = () => {
    setProgressState('flashcards');
    // Scroll to flashcards section with a delay to allow rendering
    setTimeout(() => {
      flashcardsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle submission of answers to current level
  const handleSubmitAnswers = async () => {
    if (!currentLevel) return;
    
    setIsLoading(true);
    try {
      // Call the API to submit answers and get next level content
      const nextLevelId = parseInt(levelId) + 1;
      
      // Submit answers and get next level
      toast({
        title: "Submitting answers",
        description: "Analyzing your answers and generating next level content...",
      });
      
      // Make sure we have the files from session storage
      let filesForSubmission = uploadedFiles;
      if (filesForSubmission.length === 0) {
        // Try to get files directly from session storage as a fallback
        const storedFiles = sessionStorage.getItem('uploadedFiles');
        if (storedFiles) {
          try {
            filesForSubmission = JSON.parse(storedFiles);
            console.log("Retrieved files from session storage for submission:", filesForSubmission.length);
          } catch (error) {
            console.error("Error parsing stored files during submission:", error);
          }
        }
      }
      
      // Log what we're submitting
      console.log(`Submitting answers for level ${levelId} with ${filesForSubmission.length} files included`);
      
      // Submit answers and get next level - making sure to include the files
      await submitAnswersAndGetNextLevel(
        parseInt(levelId),
        currentLevel.assessment_questions,
        answeredQuestions,
        filesForSubmission
      );
      
      // Navigate to the next level page
      navigate(`/master-it/${nextLevelId}`);
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast({
        title: "Error submitting answers",
        description: "Failed to submit your answers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !currentLevel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading level content...</p>
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600 dark:text-gray-400">No content available for this level.</p>
        <Button 
          onClick={() => navigate('/master-it/0')} 
          className="mt-4"
        >
          Return to Level 0
        </Button>
      </div>
    );
  }

  // Calculate completion status and check if all questions answered
  const answeredCount = Object.keys(answeredQuestions).filter(
    questionId => {
      // Find this question to check its type
      const question = currentLevel.assessment_questions.find(q => q.id === questionId);
      if (!question) return false;
      
      // For MCQ, just check if there's an answer
      if (question.type === 'MCQ') {
        return answeredQuestions[questionId]?.length > 0;
      }
      // For MAQ, it's valid to have selected 0 options too
      return true;
    }
  ).length;
  
  const completionStatus = `${answeredCount}/${currentLevel.assessment_questions.length}`;
  const allQuestionsAnswered = answeredCount === currentLevel.assessment_questions.length;
  
  // Get the main content - handle both spellings (main_content_md and main_conent_md)
  const mainContent = currentLevel.main_content_md || currentLevel.main_conent_md || '';
  
  // Get title from status mapping
  const levelTitle = levelTitles[currentLevel.status] || `Level ${levelId}`;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
        <Sidebar variant="inset" className="border-r">
          <SidebarHeader>
            <div className="px-2 py-2">
              <h2 className="text-xl font-bold">Master It</h2>
              <p className="text-sm text-muted-foreground">Track your learning progress</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Levels</SidebarGroupLabel>
              <SidebarMenu>
                {availableLevels.map((level) => (
                  <SidebarMenuItem key={level.id}>
                    <SidebarMenuButton 
                      isActive={level.id === parseInt(levelId)}
                      onClick={() => handleSelectLevel(level.id)}
                      className="flex items-center justify-between"
                      // Only enable levels that are available (= level ID less than or equal to current level)
                      disabled={level.id > parseInt(levelId)}
                    >
                      <span className="flex items-center">
                        {level.id < 6 ? (
                          <BookOpen className="mr-2 h-4 w-4" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        <span>{level.title}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="overflow-y-auto">
          <Navbar />
          <div className="container max-w-4xl mx-auto p-6">
            {/* Feedback Section - Only shown if there is feedback */}
            {currentLevel.feedback_md && (
              <div className="mb-8">
                <Card className="p-6 bg-white dark:bg-gray-800 shadow-md overflow-hidden border-l-4 border-blue-500">
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Previous Level Feedback</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown components={MarkdownComponents as any}>
                      {currentLevel.feedback_md}
                    </ReactMarkdown>
                  </div>
                </Card>
              </div>
            )}

            {/* Content Section */}
            <div className="mb-8">
              <Card className="p-6 bg-white dark:bg-gray-800 shadow-md overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold">{levelTitle}</h1>
                  <div className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full">
                    Level {levelId}
                  </div>
                </div>
                
                {/* Enhanced markdown rendering with custom components */}
                <div className="prose dark:prose-invert max-w-none prose-headings:text-purple-900 dark:prose-headings:text-purple-300 prose-a:text-blue-600 dark:prose-a:text-blue-400">
                  <ReactMarkdown components={MarkdownComponents as any}>
                    {mainContent}
                  </ReactMarkdown>
                </div>
                
                {/* Continue button */}
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={handleContinueToFlashcards} 
                    className="px-8"
                  >
                    Continue to Flashcards
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Flashcards Section - Only shown after reading content */}
            {progressState !== 'reading' && currentLevel.flashcards.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4" ref={flashcardsHeaderRef}>
                  <h2 className="text-2xl font-bold flex items-center">
                    <Bookmark className="mr-2 h-5 w-5 text-purple-600" />
                    Flashcards
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {currentFlashcardIndex + 1} of {currentLevel.flashcards.length}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {currentLevel.flashcards.map((flashcard, index) => (
                    <Card 
                      key={`${flashcard.heading}-${index}`} 
                      className={`p-6 bg-white dark:bg-gray-800 shadow-md border transition-all duration-300 ${
                        index === currentFlashcardIndex ? 'border-purple-500 dark:border-purple-400' : 'border-purple-100/50 dark:border-purple-900/50'
                      }`}
                      ref={el => flashcardRefs.current[index] = el}
                    >
                      <div className="min-h-[180px] flex flex-col">
                        <div className="flex-1 mb-4">
                          <h3 className="text-lg font-medium mb-3 text-purple-700 dark:text-purple-300">
                            {index === currentFlashcardIndex && showAnswer ? "Answer:" : "Question:"}
                          </h3>
                          <div className="p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-lg">
                              {index === currentFlashcardIndex && showAnswer 
                                ? flashcard.flashcard_content 
                                : flashcard.heading}
                            </p>
                          </div>
                        </div>
                        {index === currentFlashcardIndex && (
                          <div className="flex justify-between">
                            <Button 
                              variant="outline" 
                              onClick={handlePrevFlashcard}
                              disabled={currentFlashcardIndex === 0}
                            >
                              Previous
                            </Button>
                            <Button 
                              variant="secondary"
                              onClick={showAnswer ? () => setShowAnswer(false) : handleShowAnswer}
                              className="min-w-24"
                            >
                              {showAnswer ? 'Hide Answer' : 'Show Answer'}
                            </Button>
                            <Button 
                              onClick={handleNextFlashcard}
                            >
                              {currentFlashcardIndex < currentLevel.flashcards.length - 1 ? 'Next' : 'Continue to Questions'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
                
                {currentFlashcardIndex === currentLevel.flashcards.length - 1 && showAnswer && (
                  <div className="mt-8 flex justify-center">
                    <Button 
                      onClick={() => {
                        setProgressState('questions');
                        setTimeout(() => {
                          questionsHeaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      className="px-8"
                    >
                      Continue to Questions
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Questions Section - Only shown after flashcards */}
            {(progressState === 'questions' || progressState === 'completed') && currentLevel.assessment_questions.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4" ref={questionsHeaderRef}>
                  <h2 className="text-2xl font-bold">Questions</h2>
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                    {completionStatus} completed
                  </div>
                </div>
                
                <div className="space-y-6">
                  {currentLevel.assessment_questions.map((q, index) => {
                    // Only show questions up to the first unanswered one for MCQ
                    const previousQuestionsAnswered = index === 0 || 
                      Object.keys(answeredQuestions).includes(
                        currentLevel.assessment_questions[index - 1].id
                      );
                    
                    // For MCQ, enforce sequential answering
                    if (q.type === 'MCQ' && !previousQuestionsAnswered && !answeredQuestions[q.id]) {
                      return null;
                    }
                    
                    // Show question type indicator
                    const questionTypeLabel = q.type === 'MCQ' 
                      ? 'Select one answer' 
                      : 'Select all that apply';
                    
                    // For MCQ, check if this question is answered
                    const isQuestionAnswered = answeredQuestions[q.id]?.length > 0;
                    
                    // For MAQ, get the currently selected answers
                    const selectedAnswers = answeredQuestions[q.id] || [];

                    return (
                      <Card 
                        key={q.id} 
                        className={`p-6 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${
                          isQuestionAnswered ? 'border-l-4 border-purple-500' : ''
                        }`}
                        ref={el => questionRefs.current[index] = el}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {q.concept_focus}
                          </span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {questionTypeLabel}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium mb-4">{q.question_text}</h3>
                        <div className="space-y-2">
                          {q.options.map((option) => {
                            // For MCQ, button is selected if it's the answer
                            // For MAQ, button is selected if it's in the answers array
                            const isSelected = q.type === 'MCQ' 
                              ? answeredQuestions[q.id]?.[0] === option 
                              : selectedAnswers.includes(option);
                            
                            // For MCQ, disable all options once answered
                            // For MAQ, never disable options
                            const isDisabled = q.type === 'MCQ' && isQuestionAnswered;
                            
                            return (
                              <Button
                                key={option}
                                variant={isSelected ? "default" : "outline"}
                                className="w-full justify-start text-left"
                                onClick={() => handleAnswerQuestion(q.id, option, index, q.type)}
                                disabled={isDisabled}
                              >
                                {option}
                              </Button>
                            );
                          })}
                        </div>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Show next level button when all questions are answered */}
                {allQuestionsAnswered && (
                  <div className="mt-8 flex justify-center">
                    <Button 
                      onClick={handleSubmitAnswers} 
                      className="px-8"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit & Continue
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MasterIt;