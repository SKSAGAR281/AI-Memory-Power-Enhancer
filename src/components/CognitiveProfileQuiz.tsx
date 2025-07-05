import React, { useState } from 'react';
import { Brain, Eye, Ear, Hand, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';

interface CognitiveProfileQuizProps {
  onComplete: (profile: CognitiveProfile) => void;
}

export interface CognitiveProfile {
  primaryStyle: 'visual' | 'auditory' | 'kinesthetic' | 'verbal';
  secondaryStyle: 'visual' | 'auditory' | 'kinesthetic' | 'verbal';
  scores: {
    visual: number;
    auditory: number;
    kinesthetic: number;
    verbal: number;
  };
  strengths: string[];
  recommendations: string[];
  aiExplanation: string;
}

const CognitiveProfileQuiz: React.FC<CognitiveProfileQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: "When learning something new, I prefer to:",
      options: [
        { text: "See diagrams, charts, or visual demonstrations", style: 'visual', icon: Eye },
        { text: "Listen to explanations or audio recordings", style: 'auditory', icon: Ear },
        { text: "Practice hands-on or through physical activity", style: 'kinesthetic', icon: Hand },
        { text: "Read detailed written instructions", style: 'verbal', icon: MessageSquare }
      ]
    },
    {
      question: "When I need to remember a phone number, I:",
      options: [
        { text: "Visualize the numbers in my mind", style: 'visual', icon: Eye },
        { text: "Repeat it out loud several times", style: 'auditory', icon: Ear },
        { text: "Write it down or type it", style: 'kinesthetic', icon: Hand },
        { text: "Break it into word patterns", style: 'verbal', icon: MessageSquare }
      ]
    },
    {
      question: "In a meeting, I remember information best when:",
      options: [
        { text: "I can see slides, charts, or visual aids", style: 'visual', icon: Eye },
        { text: "I listen carefully to the discussion", style: 'auditory', icon: Ear },
        { text: "I take notes or doodle", style: 'kinesthetic', icon: Hand },
        { text: "I can ask questions and discuss", style: 'verbal', icon: MessageSquare }
      ]
    },
    {
      question: "When giving directions, I typically:",
      options: [
        { text: "Draw a map or point to landmarks", style: 'visual', icon: Eye },
        { text: "Describe the route verbally", style: 'auditory', icon: Ear },
        { text: "Walk through the route physically", style: 'kinesthetic', icon: Hand },
        { text: "Write down step-by-step instructions", style: 'verbal', icon: MessageSquare }
      ]
    },
    {
      question: "I concentrate best when:",
      options: [
        { text: "My workspace is visually organized", style: 'visual', icon: Eye },
        { text: "There's background music or white noise", style: 'auditory', icon: Ear },
        { text: "I can move around or fidget", style: 'kinesthetic', icon: Hand },
        { text: "I can think through problems verbally", style: 'verbal', icon: MessageSquare }
      ]
    },
    {
      question: "When solving problems, I:",
      options: [
        { text: "Create mental images or diagrams", style: 'visual', icon: Eye },
        { text: "Talk through the problem aloud", style: 'auditory', icon: Ear },
        { text: "Try different approaches hands-on", style: 'kinesthetic', icon: Hand },
        { text: "Write out pros and cons", style: 'verbal', icon: MessageSquare }
      ]
    },
    {
      question: "I remember faces better when:",
      options: [
        { text: "I focus on visual features", style: 'visual', icon: Eye },
        { text: "I remember their voice or name", style: 'auditory', icon: Ear },
        { text: "I recall our physical interaction", style: 'kinesthetic', icon: Hand },
        { text: "I associate them with stories", style: 'verbal', icon: MessageSquare }
      ]
    },
    {
      question: "When stressed, I prefer to:",
      options: [
        { text: "Look at calming images or organize visually", style: 'visual', icon: Eye },
        { text: "Listen to music or talk to someone", style: 'auditory', icon: Ear },
        { text: "Exercise or do physical activities", style: 'kinesthetic', icon: Hand },
        { text: "Write in a journal or read", style: 'verbal', icon: MessageSquare }
      ]
    }
  ];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (allAnswers: number[]) => {
    const scores = { visual: 0, auditory: 0, kinesthetic: 0, verbal: 0 };
    
    allAnswers.forEach((answerIndex, questionIndex) => {
      const selectedOption = questions[questionIndex].options[answerIndex];
      scores[selectedOption.style]++;
    });

    // Convert to percentages
    const total = questions.length;
    const percentageScores = {
      visual: Math.round((scores.visual / total) * 100),
      auditory: Math.round((scores.auditory / total) * 100),
      kinesthetic: Math.round((scores.kinesthetic / total) * 100),
      verbal: Math.round((scores.verbal / total) * 100)
    };

    // Find primary and secondary styles
    const sortedStyles = Object.entries(percentageScores)
      .sort(([,a], [,b]) => b - a)
      .map(([style]) => style as keyof typeof percentageScores);

    const primaryStyle = sortedStyles[0];
    const secondaryStyle = sortedStyles[1];

    const profile: CognitiveProfile = {
      primaryStyle,
      secondaryStyle,
      scores: percentageScores,
      strengths: getStrengths(primaryStyle, secondaryStyle),
      recommendations: getRecommendations(primaryStyle, secondaryStyle),
      aiExplanation: generateAIExplanation(primaryStyle, secondaryStyle, percentageScores)
    };

    setShowResults(true);
    onComplete(profile);
  };

  const getStrengths = (primary: string, secondary: string): string[] => {
    const strengthMap = {
      visual: [
        "Excellent spatial awareness",
        "Strong pattern recognition",
        "Great at remembering faces and places",
        "Effective with mind maps and diagrams"
      ],
      auditory: [
        "Superior listening skills",
        "Great at remembering conversations",
        "Strong musical and rhythmic memory",
        "Excellent at following verbal instructions"
      ],
      kinesthetic: [
        "Learn best through hands-on experience",
        "Strong muscle memory",
        "Great at remembering procedures",
        "Excellent coordination and timing"
      ],
      verbal: [
        "Strong language processing",
        "Excellent reading comprehension",
        "Great at remembering stories and facts",
        "Superior analytical thinking"
      ]
    };

    return [...strengthMap[primary as keyof typeof strengthMap].slice(0, 2), 
            ...strengthMap[secondary as keyof typeof strengthMap].slice(0, 1)];
  };

  const getRecommendations = (primary: string, secondary: string): string[] => {
    const recommendationMap = {
      visual: [
        "Use colorful mind maps and diagrams",
        "Create visual associations for abstract concepts",
        "Practice with image-based memory techniques"
      ],
      auditory: [
        "Use verbal repetition and rhymes",
        "Study with background music",
        "Practice explaining concepts aloud"
      ],
      kinesthetic: [
        "Use physical movements while learning",
        "Practice with hands-on activities",
        "Take frequent breaks to move around"
      ],
      verbal: [
        "Use acronyms and word associations",
        "Create stories to remember information",
        "Practice with written exercises"
      ]
    };

    return [...recommendationMap[primary as keyof typeof recommendationMap], 
            ...recommendationMap[secondary as keyof typeof recommendationMap].slice(0, 1)];
  };

  const generateAIExplanation = (primary: string, secondary: string, scores: any): string => {
    const explanations = {
      visual: "Your brain excels at processing visual information. You naturally create mental images and spatial relationships, making you particularly good at remembering faces, places, and patterns. This visual dominance means you'll benefit most from colorful, organized, and diagram-rich learning materials.",
      
      auditory: "Your cognitive profile shows strong auditory processing abilities. You naturally tune into sounds, rhythms, and verbal information. Your brain is wired to remember through hearing, making you excellent at recalling conversations, music, and spoken instructions.",
      
      kinesthetic: "Your brain learns best through physical engagement and movement. You have strong body-brain connections that help you remember through muscle memory and hands-on experience. This kinesthetic preference means you'll excel when learning involves physical practice and movement.",
      
      verbal: "Your cognitive profile indicates strong verbal-linguistic processing. You excel at understanding and manipulating language, making you naturally good at reading, writing, and verbal reasoning. Your brain organizes information through words and logical structures."
    };

    const combinedExplanation = `${explanations[primary as keyof typeof explanations]} 

Your secondary strength in ${secondary} processing (${scores[secondary]}%) complements your primary style beautifully. This combination gives you a versatile cognitive toolkit - you can adapt your learning strategies based on the situation while leveraging your natural ${primary} strengths.

This unique cognitive fingerprint suggests you'll perform best when memory training incorporates both ${primary} and ${secondary} elements, creating a multi-modal approach that maximizes your brain's natural preferences.`;

    return combinedExplanation;
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return Eye;
      case 'auditory': return Ear;
      case 'kinesthetic': return Hand;
      case 'verbal': return MessageSquare;
      default: return Brain;
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'visual': return 'from-blue-500 to-indigo-600';
      case 'auditory': return 'from-green-500 to-emerald-600';
      case 'kinesthetic': return 'from-orange-500 to-red-600';
      case 'verbal': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cognitive Profile</h1>
            <p className="text-gray-600">Understanding how your brain learns best</p>
          </div>

          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                You are a <span className="text-indigo-600 capitalize">{answers.length > 0 ? 
                  questions[0].options[answers[0]].style : 'visual'}</span> Learner
              </h2>
              <p className="text-gray-600">with strong secondary preferences</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Your Cognitive Strengths</h3>
              {getStrengths('visual', 'auditory').map((strength, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">{strength}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Personalized Recommendations</h3>
              {getRecommendations('visual', 'auditory').map((rec, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">AI Analysis: Why This Profile Suits You</h3>
            <p className="text-gray-700 leading-relaxed">
              {generateAIExplanation('visual', 'auditory', { visual: 40, auditory: 30, kinesthetic: 20, verbal: 10 })}
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Continue to Personalized Training
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{question.question}</h2>
        </div>

        {/* Options */}
        <div className="grid gap-4">
          {question.options.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getStyleColor(option.style)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900 font-medium">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CognitiveProfileQuiz;