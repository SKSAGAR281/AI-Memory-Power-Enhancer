import React, { useState, useEffect } from 'react';
import { Image, Brain, CheckCircle, XCircle, RefreshCw, Star } from 'lucide-react';

interface WordImageMatchGameProps {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

interface MatchItem {
  image: string;
  emoji: string;
  correctWords: string[];
  options: string[];
  explanation: string;
}

const WordImageMatchGame: React.FC<WordImageMatchGameProps> = ({ userId, difficulty, onComplete }) => {
  const [currentItem, setCurrentItem] = useState<MatchItem | null>(null);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [gamePhase, setGamePhase] = useState<'instructions' | 'playing' | 'result'>('instructions');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(10);
  const [feedback, setFeedback] = useState<string>('');
  const [semanticAccuracy, setSemanticAccuracy] = useState<number>(0);

  const matchItems = {
    easy: [
      {
        image: 'Tree',
        emoji: '🌳',
        correctWords: ['green', 'nature', 'wood'],
        options: ['green', 'metal', 'water', 'fire'],
        explanation: 'Trees are green, part of nature, and made of wood.'
      },
      {
        image: 'Sun',
        emoji: '☀️',
        correctWords: ['bright', 'hot', 'yellow'],
        options: ['bright', 'cold', 'dark', 'blue'],
        explanation: 'The sun is bright, hot, and appears yellow.'
      },
      {
        image: 'Ocean',
        emoji: '🌊',
        correctWords: ['blue', 'water', 'deep'],
        options: ['blue', 'red', 'dry', 'small'],
        explanation: 'Oceans are blue, made of water, and very deep.'
      },
      {
        image: 'Fire',
        emoji: '🔥',
        correctWords: ['hot', 'red', 'dangerous'],
        options: ['hot', 'cold', 'safe', 'blue'],
        explanation: 'Fire is hot, often red, and can be dangerous.'
      }
    ],
    medium: [
      {
        image: 'Brain',
        emoji: '🧠',
        correctWords: ['thinking', 'smart', 'complex'],
        options: ['thinking', 'simple', 'empty', 'slow'],
        explanation: 'The brain is associated with thinking, intelligence, and complexity.'
      },
      {
        image: 'Heart',
        emoji: '❤️',
        correctWords: ['love', 'emotion', 'vital'],
        options: ['love', 'hate', 'unimportant', 'cold'],
        explanation: 'Hearts symbolize love, emotion, and are vital for life.'
      },
      {
        image: 'Mountain',
        emoji: '⛰️',
        correctWords: ['tall', 'rocky', 'majestic'],
        options: ['tall', 'flat', 'tiny', 'liquid'],
        explanation: 'Mountains are tall, rocky, and often considered majestic.'
      },
      {
        image: 'Book',
        emoji: '📚',
        correctWords: ['knowledge', 'learning', 'wisdom'],
        options: ['knowledge', 'ignorance', 'confusion', 'emptiness'],
        explanation: 'Books represent knowledge, learning, and wisdom.'
      }
    ],
    hard: [
      {
        image: 'Clock',
        emoji: '🕐',
        correctWords: ['temporal', 'cyclical', 'precise'],
        options: ['temporal', 'spatial', 'chaotic', 'imprecise'],
        explanation: 'Clocks relate to time (temporal), work in cycles, and measure precisely.'
      },
      {
        image: 'Key',
        emoji: '🔑',
        correctWords: ['access', 'solution', 'unlock'],
        options: ['access', 'barrier', 'problem', 'lock'],
        explanation: 'Keys provide access, represent solutions, and unlock things.'
      },
      {
        image: 'Bridge',
        emoji: '🌉',
        correctWords: ['connection', 'transition', 'spanning'],
        options: ['connection', 'separation', 'stagnation', 'blocking'],
        explanation: 'Bridges create connections, enable transitions, and span distances.'
      },
      {
        image: 'Lighthouse',
        emoji: '🗼',
        correctWords: ['guidance', 'beacon', 'safety'],
        options: ['guidance', 'confusion', 'danger', 'darkness'],
        explanation: 'Lighthouses provide guidance, serve as beacons, and ensure safety.'
      }
    ]
  };

  const startGame = () => {
    setGamePhase('playing');
    setScore(0);
    setCurrentRound(1);
    showNextItem();
  };

  const showNextItem = () => {
    const items = matchItems[difficulty];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setCurrentItem(randomItem);
    setSelectedWord('');
    setFeedback('');
    setSemanticAccuracy(0);
  };

  const calculateSemanticAccuracy = (selectedWord: string, correctWords: string[]): number => {
    // Simple semantic similarity calculation
    // In a real app, you'd use vector embeddings or NLP models
    
    if (correctWords.includes(selectedWord.toLowerCase())) {
      return 100;
    }
    
    // Check for partial matches or related concepts
    const relatedWords: { [key: string]: string[] } = {
      'green': ['nature', 'plant', 'leaf', 'forest'],
      'blue': ['water', 'sky', 'ocean', 'sea'],
      'hot': ['warm', 'fire', 'sun', 'heat'],
      'bright': ['light', 'shiny', 'luminous', 'radiant'],
      'thinking': ['mind', 'brain', 'thought', 'cognitive'],
      'love': ['heart', 'emotion', 'feeling', 'affection'],
      'tall': ['high', 'big', 'large', 'elevated'],
      'knowledge': ['wisdom', 'learning', 'education', 'smart']
    };
    
    for (const correctWord of correctWords) {
      if (relatedWords[correctWord]?.includes(selectedWord.toLowerCase())) {
        return 75;
      }
    }
    
    // Check for opposite meanings (negative score)
    const opposites: { [key: string]: string[] } = {
      'hot': ['cold', 'cool', 'freezing'],
      'bright': ['dark', 'dim', 'black'],
      'big': ['small', 'tiny', 'little'],
      'love': ['hate', 'dislike']
    };
    
    for (const correctWord of correctWords) {
      if (opposites[correctWord]?.includes(selectedWord.toLowerCase())) {
        return 20;
      }
    }
    
    return 40; // Default for unrelated words
  };

  const handleWordSelect = (word: string) => {
    if (!currentItem) return;
    
    setSelectedWord(word);
    const accuracy = calculateSemanticAccuracy(word, currentItem.correctWords);
    setSemanticAccuracy(accuracy);
    
    let points = 0;
    let feedbackText = '';
    
    if (accuracy >= 90) {
      points = 15;
      feedbackText = `Perfect! "${word}" is ${accuracy}% semantically accurate. ${currentItem.explanation}`;
    } else if (accuracy >= 70) {
      points = 12;
      feedbackText = `Excellent! "${word}" is ${accuracy}% related. ${currentItem.explanation}`;
    } else if (accuracy >= 50) {
      points = 8;
      feedbackText = `Good connection! "${word}" is ${accuracy}% related. ${currentItem.explanation}`;
    } else if (accuracy >= 30) {
      points = 4;
      feedbackText = `Some connection. "${word}" is ${accuracy}% related. ${currentItem.explanation}`;
    } else {
      points = 1;
      feedbackText = `Not quite. "${word}" is only ${accuracy}% related. ${currentItem.explanation}`;
    }
    
    // Difficulty multiplier
    if (difficulty === 'medium') points *= 1.2;
    if (difficulty === 'hard') points *= 1.5;
    
    setScore(prev => prev + Math.round(points));
    setFeedback(feedbackText);
    
    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound(prev => prev + 1);
        showNextItem();
      } else {
        setGamePhase('result');
        onComplete(score + Math.round(points));
      }
    }, 3000);
  };

  const renderInstructions = () => (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Word-Image Match Challenge</h3>
      <div className="bg-indigo-50 rounded-xl p-6">
        <h4 className="font-semibold text-indigo-900 mb-3">How to Play:</h4>
        <div className="text-indigo-800 space-y-2 text-left">
          <p>• Look at the image/emoji shown</p>
          <p>• Choose the word most related to the image</p>
          <p>• AI will calculate semantic accuracy (0-100%)</p>
          <p>• Higher accuracy = more points</p>
          <p>• Train your semantic memory connections!</p>
        </div>
      </div>
      <button
        onClick={startGame}
        className="bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-lg"
      >
        Start Semantic Challenge
      </button>
    </div>
  );

  const renderGame = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center space-x-8 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{currentRound}</div>
          <div className="text-sm text-gray-600">of {totalRounds}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
        {semanticAccuracy > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{semanticAccuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        )}
      </div>

      {currentItem && (
        <>
          <div className="bg-gray-100 rounded-2xl p-12 mb-6">
            <div className="space-y-4">
              <div className="text-8xl">{currentItem.emoji}</div>
              <div className="text-2xl font-bold text-gray-900">{currentItem.image}</div>
            </div>
          </div>

          {!selectedWord ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700 font-medium">
                Which word is most related to this image?
              </p>
              <div className="grid grid-cols-2 gap-4">
                {currentItem.options.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordSelect(word)}
                    className="p-4 bg-white border-2 border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-semibold text-gray-900"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-6 rounded-xl ${
                semanticAccuracy >= 70 ? 'bg-green-50 border border-green-200' :
                semanticAccuracy >= 50 ? 'bg-yellow-50 border border-yellow-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  {semanticAccuracy >= 70 ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-orange-600" />
                  )}
                  <span className="font-semibold text-lg">
                    {semanticAccuracy}% Semantic Accuracy
                  </span>
                </div>
                <p className="text-gray-700">{feedback}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderResult = () => {
    const avgAccuracy = score / totalRounds;

    return (
      <div className="text-center space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
          avgAccuracy >= 12 ? 'bg-green-100' : avgAccuracy >= 8 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {avgAccuracy >= 8 ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900">Semantic Challenge Complete!</h3>
        <p className="text-lg text-gray-600">Total Score: {score} points</p>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Semantic Performance</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{avgAccuracy.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Points/Round</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((avgAccuracy / 15) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Semantic Strength</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
          <p className="text-indigo-800 text-sm">
            {avgAccuracy >= 12 ? "Outstanding semantic understanding! Your word-concept connections are excellent." :
             avgAccuracy >= 8 ? "Great semantic skills! You understand word relationships well." :
             avgAccuracy >= 5 ? "Good progress! Continue practicing to strengthen semantic connections." :
             "Keep training! Semantic memory improves with practice and exposure."}
          </p>
        </div>

        <button
          onClick={() => {
            setGamePhase('instructions');
            setScore(0);
            setCurrentRound(1);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Play Again</span>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div className="flex justify-center items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-gray-600">Semantic Memory Training</span>
        </div>
      </div>

      {gamePhase === 'instructions' && renderInstructions()}
      {gamePhase === 'playing' && renderGame()}
      {gamePhase === 'result' && renderResult()}
    </div>
  );
};

export default WordImageMatchGame;