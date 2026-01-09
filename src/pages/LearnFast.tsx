import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ApiKeyWarning } from '@/components/ApiKeyWarning';
import AIThinkingLoader from '@/components/AIThinkingLoader';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Lightbulb, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  fetchLevelContent,
  submitAnswersAndGetNextLevel,
  useLoadingState,
  type LevelData
} from '@/lib/masterLevelService';

// Learn Fast - shows hints with questions, progresses through levels 0-3
const LearnFast = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string[]>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: isApiLoading, message: loadingMessage } = useLoadingState();

  // Load current level
  useEffect(() => {
    const loadLevel = async () => {
      setIsLoading(true);
      try {
        const storedFiles = sessionStorage.getItem('uploadedFiles');
        if (!storedFiles) {
          toast({
            title: "No files uploaded",
            description: "Please upload your assignment first.",
            variant: "destructive"
          });
          navigate('/upload', { state: { helpType: 'learn-fast' } });
          return;
        }

        const files = JSON.parse(storedFiles);

        // For level 0, no questionnaire needed
        if (currentLevel === 0) {
          const data = await fetchLevelContent(0, files);
          setLevelData(data);
        } else {
          // For higher levels, we'd need previous level data
          // For now, just load the level
          const data = await fetchLevelContent(currentLevel, files);
          setLevelData(data);
        }
      } catch (error) {
        console.error(`Error loading Level ${currentLevel}:`, error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLevel();
  }, [currentLevel, navigate, toast]);

  const handleAnswerQuestion = (questionId: string, selectedAnswers: string[]) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionId]: selectedAnswers
    }));
  };

  const toggleHint = (questionId: string) => {
    setShowHints(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const generateHint = (question: any): string => {
    // Generate helpful hints without revealing answers
    const conceptFocus = question.concept_focus || "the concept";

    // Different hint strategies based on question type
    if (question.type === 'MCQ') {
      const hints = [
        `💡 Think about the fundamental definition of ${conceptFocus}. Which option aligns most closely with that definition?`,
        `💡 Try eliminating options that contain absolute statements or seem too broad/narrow compared to ${conceptFocus}.`,
        `💡 Consider real-world applications of ${conceptFocus}. Which option makes the most practical sense?`,
        `💡 Review the key characteristics of ${conceptFocus} mentioned in the learning materials above.`
      ];
      // Simple hash based on question id to consistently pick the same hint for same question
      const index = Math.abs(question.id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % hints.length;
      return hints[index];
    } else {
      const hints = [
        `💡 This question has multiple correct answers. Think about different aspects or properties of ${conceptFocus}.`,
        `💡 Consider each option independently. Some statements might be partially correct - which are fully correct?`,
        `💡 Look for options that describe distinct features or applications of ${conceptFocus}.`,
        `💡 Ask yourself: Which of these statements would always be true about ${conceptFocus}?`
      ];
      const index = Math.abs(question.id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % hints.length;
      return hints[index];
    }
  };

  const handleCompleteLevel = async () => {
    if (!levelData || levelData.assessment_questions.length === 0) {
      // If no questions, just move to next level
      if (currentLevel >= 3) {
        toast({
          title: "Learn Fast Complete!",
          description: "You've covered the essential concepts. Ready for your assignment!",
        });
        navigate('/assignment');
        return;
      }
      setCurrentLevel(prev => prev + 1);
      return;
    }

    const allAnswered = levelData.assessment_questions.every(q =>
      answeredQuestions[q.id] && answeredQuestions[q.id].length > 0
    );

    if (!allAnswered) {
      toast({
        title: "Incomplete answers",
        description: "Please answer all questions before continuing.",
        variant: "destructive"
      });
      return;
    }

    if (currentLevel >= 3) {
      toast({
        title: "Learn Fast Complete!",
        description: "You've covered the essential concepts. Ready for your assignment!",
      });
      navigate('/assignment');
    } else {
      setCurrentLevel(prev => prev + 1);
      setAnsweredQuestions({});
      setShowHints({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading || isApiLoading) {
    return <AIThinkingLoader message={loadingMessage || "Loading content..."} />;
  }

  const levelTitles = [
    'Assignment Overview',
    'Basic Understanding',
    'Advanced Concepts',
    'Practical Application'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <Navbar />
      <ApiKeyWarning />

      <div className="container mx-auto py-8 px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Learn Fast</h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Level {currentLevel} of 3
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentLevel) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Level Content */}
        {levelData && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-3xl font-bold">{levelTitles[currentLevel]}</h2>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                {currentLevel === 0 && levelData.assignment_summary_md && (
                  <ReactMarkdown>{levelData.assignment_summary_md}</ReactMarkdown>
                )}
                {levelData.feedback_md && (
                  <ReactMarkdown>{levelData.feedback_md}</ReactMarkdown>
                )}
                {levelData.main_content_md && (
                  <ReactMarkdown>{levelData.main_content_md}</ReactMarkdown>
                )}
              </CardContent>
            </Card>

            {/* Flashcards */}
            {levelData.flashcards.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Key Points</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {levelData.flashcards.map((card, idx) => (
                    <Alert key={idx} className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <p className="font-semibold mb-2">{card.heading}</p>
                        <div className="prose dark:prose-invert text-sm">
                          <ReactMarkdown>{card.flashcard_content}</ReactMarkdown>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Assessment Questions with Hints */}
            {levelData.assessment_questions.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Practice Questions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stuck? Click the hint button for guidance!
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {levelData.assessment_questions.map((question, idx) => (
                    <div key={question.id} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <p className="font-medium flex-1">
                          {idx + 1}. {question.question_text}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleHint(question.id)}
                          className="ml-2"
                        >
                          {showHints[question.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="ml-1 text-xs">Hint</span>
                        </Button>
                      </div>

                      {/* Hint */}
                      {showHints[question.id] && (
                        <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-sm">
                            {generateHint(question)}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Options */}
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => (
                          <label
                            key={optIdx}
                            className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <input
                              type={question.type === 'MCQ' ? 'radio' : 'checkbox'}
                              name={question.id}
                              value={option}
                              checked={answeredQuestions[question.id]?.includes(option) || false}
                              onChange={(e) => {
                                if (question.type === 'MCQ') {
                                  handleAnswerQuestion(question.id, [option]);
                                } else {
                                  const current = answeredQuestions[question.id] || [];
                                  const updated = e.target.checked
                                    ? [...current, option]
                                    : current.filter(a => a !== option);
                                  handleAnswerQuestion(question.id, updated);
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button onClick={handleCompleteLevel} size="lg" className="bg-pink-600 hover:bg-pink-700">
                {currentLevel >= 3 ? 'Start Assignment' : 'Continue to Next Level'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnFast;
