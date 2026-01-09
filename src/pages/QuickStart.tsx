import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ApiKeyWarning } from '@/components/ApiKeyWarning';
import AIThinkingLoader from '@/components/AIThinkingLoader';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  fetchLevelContent,
  useLoadingState,
  type LevelData
} from '@/lib/masterLevelService';

// Simplified Quick Start - only Level 0 and Level 1, then assignment
const QuickStart = () => {
  const [currentStep, setCurrentStep] = useState<'level0' | 'level1' | 'assignment'>('level0');
  const [level0Data, setLevel0Data] = useState<LevelData | null>(null);
  const [level1Data, setLevel1Data] = useState<LevelData | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: isApiLoading, message: loadingMessage } = useLoadingState();

  // Load Level 0 on mount
  useEffect(() => {
    const loadLevel0 = async () => {
      setIsLoading(true);
      try {
        const storedFiles = sessionStorage.getItem('uploadedFiles');
        if (!storedFiles) {
          toast({
            title: "No files uploaded",
            description: "Please upload your assignment first.",
            variant: "destructive"
          });
          navigate('/upload', { state: { helpType: 'quick-start' } });
          return;
        }

        const files = JSON.parse(storedFiles);
        const data = await fetchLevelContent(0, files);
        setLevel0Data(data);
      } catch (error) {
        console.error("Error loading Level 0:", error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLevel0();
  }, [navigate, toast]);

  const handleAnswerQuestion = (questionId: string, selectedAnswers: string[]) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionId]: selectedAnswers
    }));
  };

  const handleCompleteLevel0 = async () => {
    // Check if all questions are answered
    if (!level0Data || level0Data.assessment_questions.length === 0) {
      toast({
        title: "No questions available",
        description: "Please wait for the content to load.",
        variant: "destructive"
      });
      return;
    }

    const allAnswered = level0Data.assessment_questions.every(q =>
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

    setIsLoading(true);
    try {
      const storedFiles = sessionStorage.getItem('uploadedFiles');
      const files = storedFiles ? JSON.parse(storedFiles) : {};

      const data = await fetchLevelContent(1, files, {
        questions: level0Data.assessment_questions,
        answers: answeredQuestions
      });

      setLevel1Data(data);
      setCurrentStep('level1');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error loading Level 1:", error);
      toast({
        title: "Error",
        description: "Failed to load Level 1 content.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteQuickStart = () => {
    toast({
      title: "Quick Start Complete!",
      description: "You've completed the basics. Now tackle your assignment!",
    });
    navigate('/assignment');
  };

  if (isLoading || isApiLoading) {
    return <AIThinkingLoader message={loadingMessage || "Loading content..."} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <Navbar />
      <ApiKeyWarning />

      <div className="container mx-auto py-8 px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'level0' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {currentStep !== 'level0' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-medium">Level 0: Overview</span>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1 mx-4" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'level1' ? 'bg-blue-500 text-white' :
                currentStep === 'assignment' ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600'
              }`}>
                {currentStep === 'assignment' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className={`font-medium ${currentStep === 'level0' ? 'text-gray-400' : ''}`}>
                Level 1: Basics
              </span>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1 mx-4" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'assignment' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600'
              }`}>
                3
              </div>
              <span className={`font-medium ${currentStep !== 'assignment' ? 'text-gray-400' : ''}`}>
                Assignment
              </span>
            </div>
          </div>
        </div>

        {/* Level 0 Content */}
        {currentStep === 'level0' && level0Data && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <h1 className="text-3xl font-bold">Assignment Overview</h1>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {level0Data.assignment_summary_md || level0Data.main_content_md || ''}
                </ReactMarkdown>
              </CardContent>
            </Card>

            {/* Assessment Questions */}
            {level0Data.assessment_questions.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Quick Assessment</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Answer these questions to help us understand your current level
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {level0Data.assessment_questions.map((question, idx) => (
                    <div key={question.id} className="space-y-3">
                      <p className="font-medium">
                        {idx + 1}. {question.question_text}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => (
                          <label
                            key={optIdx}
                            className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
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
              <Button onClick={handleCompleteLevel0} size="lg">
                Continue to Level 1
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Level 1 Content */}
        {currentStep === 'level1' && level1Data && (
          <div className="max-w-4xl mx-auto space-y-6">
            {level1Data.feedback_md && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Your Progress</h2>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{level1Data.feedback_md}</ReactMarkdown>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Core Concepts</h2>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{level1Data.main_content_md || ''}</ReactMarkdown>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleCompleteQuickStart} size="lg" className="bg-green-600 hover:bg-green-700">
                Start Assignment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickStart;
