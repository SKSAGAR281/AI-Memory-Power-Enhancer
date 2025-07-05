import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, RefreshCw, Brain, Target, Star, Award } from 'lucide-react';
import { TestResult } from '../types';

interface MemoryTestProps {
  onTestComplete: (result: TestResult) => void;
}

interface TestQuestion {
  id: string;
  type: 'working' | 'shortTerm' | 'longTerm' | 'visual' | 'auditory' | 'processing' | 'attention';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  sequence?: (string | number)[];
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const MemoryTest: React.FC<MemoryTestProps> = ({ onTestComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [testPhase, setTestPhase] = useState<'instructions' | 'testing' | 'completed'>('instructions');
  const [currentSequence, setCurrentSequence] = useState<(string | number)[]>([]);
  const [userInput, setUserInput] = useState('');
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Dynamic question generation
  const generateDynamicQuestions = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    const questionPools = {
      working: {
        easy: [
          { sequence: generateRandomSequence(4, 10), timeLimit: 15 },
          { sequence: generateRandomSequence(3, 20), timeLimit: 12 },
          { sequence: generateRandomSequence(5, 15), timeLimit: 18 }
        ],
        medium: [
          { sequence: generateRandomSequence(6, 50), timeLimit: 12 },
          { sequence: generateRandomSequence(7, 30), timeLimit: 15 },
          { sequence: generateRandomSequence(5, 100), timeLimit: 10 }
        ],
        hard: [
          { sequence: generateRandomSequence(8, 100), timeLimit: 10 },
          { sequence: generateRandomSequence(9, 50), timeLimit: 12 },
          { sequence: generateRandomSequence(7, 200), timeLimit: 8 }
        ]
      },
      shortTerm: {
        easy: [
          { words: generateRandomWords(4), timeLimit: 8 },
          { words: generateRandomWords(3), timeLimit: 10 },
          { words: generateRandomWords(5), timeLimit: 12 }
        ],
        medium: [
          { words: generateRandomWords(6), timeLimit: 10 },
          { words: generateRandomWords(7), timeLimit: 8 },
          { words: generateRandomWords(5), timeLimit: 6 }
        ],
        hard: [
          { words: generateRandomWords(8), timeLimit: 8 },
          { words: generateRandomWords(9), timeLimit: 6 },
          { words: generateRandomWords(7), timeLimit: 5 }
        ]
      },
      processing: {
        easy: [
          { math: generateMathProblem('easy'), timeLimit: 8 },
          { pattern: generatePattern('easy'), timeLimit: 10 }
        ],
        medium: [
          { math: generateMathProblem('medium'), timeLimit: 6 },
          { pattern: generatePattern('medium'), timeLimit: 8 }
        ],
        hard: [
          { math: generateMathProblem('hard'), timeLimit: 5 },
          { pattern: generatePattern('hard'), timeLimit: 6 }
        ]
      }
    };

    const questions: TestQuestion[] = [];
    
    // Generate working memory questions
    const workingPool = questionPools.working[selectedDifficulty];
    const workingQ = workingPool[Math.floor(Math.random() * workingPool.length)];
    questions.push({
      id: `wm_${Date.now()}`,
      type: 'working',
      question: 'Remember this sequence and enter it in reverse order:',
      sequence: workingQ.sequence,
      correctAnswer: workingQ.sequence.slice().reverse().join(','),
      timeLimit: workingQ.timeLimit,
      difficulty: selectedDifficulty
    });

    // Generate short-term memory questions
    const shortTermPool = questionPools.shortTerm[selectedDifficulty];
    const shortTermQ = shortTermPool[Math.floor(Math.random() * shortTermPool.length)];
    const randomIndex = Math.floor(Math.random() * shortTermQ.words.length);
    questions.push({
      id: `st_${Date.now()}`,
      type: 'shortTerm',
      question: `Memorize these words: ${shortTermQ.words.join(', ')}. What was the ${getOrdinal(randomIndex + 1)} word?`,
      options: [...shortTermQ.words, ...generateRandomWords(2)].sort(() => Math.random() - 0.5),
      correctAnswer: shortTermQ.words[randomIndex],
      timeLimit: shortTermQ.timeLimit,
      difficulty: selectedDifficulty
    });

    // Generate processing speed questions
    const processingPool = questionPools.processing[selectedDifficulty];
    const processingQ = processingPool[Math.floor(Math.random() * processingPool.length)];
    if (processingQ.math) {
      questions.push({
        id: `ps_${Date.now()}`,
        type: 'processing',
        question: `Solve quickly: ${processingQ.math.question}`,
        options: processingQ.math.options,
        correctAnswer: processingQ.math.answer,
        timeLimit: 5,
        difficulty: selectedDifficulty
      });
    }

    // Add more dynamic questions...
    questions.push(...generateAdditionalQuestions(selectedDifficulty));

    return questions;
  };

  const generateRandomSequence = (length: number, max: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
  };

  const generateRandomWords = (count: number): string[] => {
    const wordBank = [
      'apple', 'book', 'chair', 'door', 'elephant', 'flower', 'guitar', 'house',
      'island', 'jacket', 'kitchen', 'laptop', 'mountain', 'notebook', 'ocean',
      'pencil', 'queen', 'rainbow', 'sunset', 'telescope', 'umbrella', 'violin',
      'window', 'xylophone', 'yellow', 'zebra', 'butterfly', 'camera', 'diamond',
      'engine', 'forest', 'garden', 'horizon', 'journey', 'knowledge', 'library'
    ];
    
    const shuffled = [...wordBank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const generateMathProblem = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const answer = a + b;
        return {
          question: `${a} + ${b}`,
          answer: answer.toString(),
          options: [answer.toString(), (answer + 1).toString(), (answer - 1).toString(), (answer + 2).toString()]
        };
      case 'medium':
        const c = Math.floor(Math.random() * 12) + 2;
        const d = Math.floor(Math.random() * 12) + 2;
        const answer2 = c * d;
        return {
          question: `${c} × ${d}`,
          answer: answer2.toString(),
          options: [answer2.toString(), (answer2 + c).toString(), (answer2 - d).toString(), (answer2 + d).toString()]
        };
      case 'hard':
        const e = Math.floor(Math.random() * 15) + 5;
        const f = Math.floor(Math.random() * 8) + 2;
        const answer3 = e * e - f;
        return {
          question: `${e}² - ${f}`,
          answer: answer3.toString(),
          options: [answer3.toString(), (answer3 + 5).toString(), (answer3 - 3).toString(), (answer3 + 8).toString()]
        };
      default:
        return generateMathProblem('medium');
    }
  };

  const generatePattern = (difficulty: string) => {
    const patterns = {
      easy: ['A-B-A-B-?', 'Red-Blue-Red-Blue-?', '1-2-1-2-?'],
      medium: ['A-B-C-A-B-C-?', '1-4-7-10-?', 'Mon-Wed-Fri-?'],
      hard: ['2-6-18-54-?', 'A-C-F-J-?', '1-1-2-3-5-8-?']
    };
    
    const patternList = patterns[difficulty as keyof typeof patterns];
    return patternList[Math.floor(Math.random() * patternList.length)];
  };

  const generateAdditionalQuestions = (difficulty: string): TestQuestion[] => {
    const questions: TestQuestion[] = [];
    
    // Visual memory question
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const selectedColors = colors.slice(0, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
    questions.push({
      id: `vm_${Date.now()}`,
      type: 'visual',
      question: `Which colors were shown? (Select all that apply)`,
      sequence: selectedColors,
      options: colors,
      correctAnswer: selectedColors.join(','),
      timeLimit: 8,
      difficulty
    });

    // Attention question
    const distractors = ['cat', 'dog', 'bird', 'car', 'tree'];
    const target = 'elephant';
    questions.push({
      id: `at_${Date.now()}`,
      type: 'attention',
      question: `Find the odd one out: ${[...distractors, target].sort(() => Math.random() - 0.5).join(', ')}`,
      options: [...distractors, target],
      correctAnswer: target,
      timeLimit: 6,
      difficulty
    });

    return questions;
  };

  const getOrdinal = (num: number): string => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  useEffect(() => {
    if (testPhase === 'testing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && testPhase === 'testing') {
      handleNext();
    }
  }, [timeLeft, testPhase]);

  const startTest = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    const dynamicQuestions = generateDynamicQuestions(selectedDifficulty);
    setTestQuestions(dynamicQuestions);
    setTestPhase('testing');
    setStartTime(new Date());
    setCurrentQuestion(0);
    setAnswers([]);
    
    const firstQuestion = dynamicQuestions[0];
    setTimeLeft(firstQuestion.timeLimit || 30);
    
    if (firstQuestion.sequence) {
      setCurrentSequence(firstQuestion.sequence);
      setShowSequence(true);
      setTimeout(() => setShowSequence(false), 3000);
    }
  };

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    handleNext();
  };

  const handleNext = () => {
    if (currentQuestion < testQuestions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      const nextQ = testQuestions[nextQuestion];
      setTimeLeft(nextQ.timeLimit || 30);
      setUserInput('');
      
      if (nextQ.sequence) {
        setCurrentSequence(nextQ.sequence);
        setShowSequence(true);
        setTimeout(() => setShowSequence(false), 3000);
      }
    } else {
      completeTest();
    }
  };

  const completeTest = () => {
    const endTime = new Date();
    const timeSpent = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    // Calculate scores by category with color-coded feedback
    const scores = {
      working: 0,
      shortTerm: 0,
      longTerm: 0,
      visual: 0,
      auditory: 0,
      processing: 0,
      attention: 0
    };

    const questionCounts = {
      working: 0,
      shortTerm: 0,
      longTerm: 0,
      visual: 0,
      auditory: 0,
      processing: 0,
      attention: 0
    };

    testQuestions.forEach((question, index) => {
      questionCounts[question.type]++;
      const userAnswer = answers[index];
      const isCorrect = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer.includes(userAnswer)
        : userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        scores[question.type]++;
      }
    });

    // Convert to percentages with difficulty multipliers
    const difficultyMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1.0;
    const percentageScores = {
      workingMemoryScore: Math.round((questionCounts.working ? (scores.working / questionCounts.working) * 100 : 0) * difficultyMultiplier),
      shortTermMemoryScore: Math.round((questionCounts.shortTerm ? (scores.shortTerm / questionCounts.shortTerm) * 100 : 0) * difficultyMultiplier),
      longTermMemoryScore: Math.round((questionCounts.longTerm ? (scores.longTerm / questionCounts.longTerm) * 100 : 0) * difficultyMultiplier),
      visualMemoryScore: Math.round((questionCounts.visual ? (scores.visual / questionCounts.visual) * 100 : 0) * difficultyMultiplier),
      auditoryMemoryScore: Math.round((questionCounts.auditory ? (scores.auditory / questionCounts.auditory) * 100 : 0) * difficultyMultiplier),
      processingSpeedScore: Math.round((questionCounts.processing ? (scores.processing / questionCounts.processing) * 100 : 0) * difficultyMultiplier),
      attentionScore: Math.round((questionCounts.attention ? (scores.attention / questionCounts.attention) * 100 : 0) * difficultyMultiplier)
    };

    const overallScore = Math.round(Object.values(percentageScores).reduce((sum, score) => sum + score, 0) / Object.values(percentageScores).length);

    const result: TestResult = {
      id: Date.now().toString(),
      date: new Date(),
      overallScore: Math.min(100, overallScore),
      ...Object.fromEntries(Object.entries(percentageScores).map(([key, value]) => [key, Math.min(100, value)])),
      timeSpent,
      difficulty
    } as TestResult;

    setTestPhase('completed');
    onTestComplete(result);
  };

  const renderDifficultySelection = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Dynamic Memory Assessment</h1>
          <p className="text-lg text-slate-600">
            Each test is uniquely generated with fresh content. Choose your challenge level:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => startTest('easy')}
            className="p-6 border-2 border-emerald-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 text-center group"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Easy</h3>
            <p className="text-slate-600 text-sm mb-3">Gentle introduction with basic challenges</p>
            <div className="text-xs text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              4-5 items • 10-15 seconds
            </div>
          </button>

          <button
            onClick={() => startTest('medium')}
            className="p-6 border-2 border-indigo-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-center group"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Medium</h3>
            <p className="text-slate-600 text-sm mb-3">Balanced challenge for most users</p>
            <div className="text-xs text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
              6-7 items • 8-12 seconds
            </div>
          </button>

          <button
            onClick={() => startTest('hard')}
            className="p-6 border-2 border-red-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all duration-200 text-center group"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200">
              <Award className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hard</h3>
            <p className="text-slate-600 text-sm mb-3">Advanced challenges for experts</p>
            <div className="text-xs text-red-700 bg-red-100 px-3 py-1 rounded-full">
              8-9 items • 5-8 seconds
            </div>
          </button>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl p-6 border border-indigo-200">
          <h3 className="font-semibold text-slate-900 mb-3">🧠 What Makes This Different</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="text-slate-700 text-sm space-y-1">
              <li>• Every test is uniquely generated</li>
              <li>• Dynamic difficulty adjustment</li>
              <li>• Fresh content each time</li>
            </ul>
            <ul className="text-slate-700 text-sm space-y-1">
              <li>• Color-coded performance feedback</li>
              <li>• Detailed strength/weakness analysis</li>
              <li>• AI-powered insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  if (testPhase === 'instructions') {
    return renderDifficultySelection();
  }

  if (testPhase === 'testing') {
    const question = testQuestions[currentQuestion];
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">
                Question {currentQuestion + 1} of {testQuestions.length}
              </span>
              {question.timeLimit && (
                <div className="flex items-center space-x-2 text-sm font-medium text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft}s</span>
                </div>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{question.question}</h2>
            
            {/* Sequence Display */}
            {question.sequence && showSequence && (
              <div className="bg-indigo-50 rounded-xl p-6 mb-6">
                <p className="text-indigo-900 font-semibold mb-3">Memorize this sequence:</p>
                <div className="flex justify-center space-x-4 flex-wrap">
                  {question.sequence.map((item, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-lg animate-pulse"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input for sequence questions */}
            {question.sequence && !showSequence && (
              <div className="mb-6">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter your answer (e.g., 1,2,3,4,5)"
                  className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                />
                <button
                  onClick={() => handleAnswer(userInput)}
                  className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Submit Answer
                </button>
              </div>
            )}

            {/* Multiple choice options */}
            {question.options && !question.sequence && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-left font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Assessment Complete!</h1>
        <p className="text-lg text-slate-600 mb-6">
          Your results are being processed. You'll see your detailed score and personalized recommendations next.
        </p>
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default MemoryTest;