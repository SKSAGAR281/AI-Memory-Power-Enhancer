import React, { useState, useEffect } from 'react';
import { Zap, Clock, Target, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface SpeedSortingGameProps {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

interface SortItem {
  id: string;
  content: string;
  category: string;
  emoji: string;
}

const SpeedSortingGame: React.FC<SpeedSortingGameProps> = ({ userId, difficulty, onComplete }) => {
  const [currentItem, setCurrentItem] = useState<SortItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [gamePhase, setGamePhase] = useState<'instructions' | 'playing' | 'result'>('instructions');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(15);
  const [timeLeft, setTimeLeft] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [itemStartTime, setItemStartTime] = useState(0);
  const [speed, setSpeed] = useState(3000); // Initial time per item

  const itemSets = {
    easy: {
      categories: ['Colors', 'Animals', 'Food'],
      items: [
        { content: 'Red', category: 'Colors', emoji: '🔴' },
        { content: 'Blue', category: 'Colors', emoji: '🔵' },
        { content: 'Green', category: 'Colors', emoji: '🟢' },
        { content: 'Dog', category: 'Animals', emoji: '🐕' },
        { content: 'Cat', category: 'Animals', emoji: '🐱' },
        { content: 'Bird', category: 'Animals', emoji: '🐦' },
        { content: 'Apple', category: 'Food', emoji: '🍎' },
        { content: 'Banana', category: 'Food', emoji: '🍌' },
        { content: 'Pizza', category: 'Food', emoji: '🍕' }
      ]
    },
    medium: {
      categories: ['Emotions', 'Vehicles', 'Nature', 'Technology'],
      items: [
        { content: 'Happy', category: 'Emotions', emoji: '😊' },
        { content: 'Sad', category: 'Emotions', emoji: '😢' },
        { content: 'Angry', category: 'Emotions', emoji: '😠' },
        { content: 'Car', category: 'Vehicles', emoji: '🚗' },
        { content: 'Plane', category: 'Vehicles', emoji: '✈️' },
        { content: 'Bike', category: 'Vehicles', emoji: '🚲' },
        { content: 'Tree', category: 'Nature', emoji: '🌳' },
        { content: 'Mountain', category: 'Nature', emoji: '⛰️' },
        { content: 'Ocean', category: 'Nature', emoji: '🌊' },
        { content: 'Phone', category: 'Technology', emoji: '📱' },
        { content: 'Computer', category: 'Technology', emoji: '💻' },
        { content: 'Robot', category: 'Technology', emoji: '🤖' }
      ]
    },
    hard: {
      categories: ['Abstract Concepts', 'Professions', 'Sciences', 'Arts', 'Sports'],
      items: [
        { content: 'Freedom', category: 'Abstract Concepts', emoji: '🕊️' },
        { content: 'Justice', category: 'Abstract Concepts', emoji: '⚖️' },
        { content: 'Love', category: 'Abstract Concepts', emoji: '❤️' },
        { content: 'Doctor', category: 'Professions', emoji: '👨‍⚕️' },
        { content: 'Teacher', category: 'Professions', emoji: '👨‍🏫' },
        { content: 'Engineer', category: 'Professions', emoji: '👨‍💻' },
        { content: 'Physics', category: 'Sciences', emoji: '⚛️' },
        { content: 'Chemistry', category: 'Sciences', emoji: '🧪' },
        { content: 'Biology', category: 'Sciences', emoji: '🧬' },
        { content: 'Painting', category: 'Arts', emoji: '🎨' },
        { content: 'Music', category: 'Arts', emoji: '🎵' },
        { content: 'Dance', category: 'Arts', emoji: '💃' },
        { content: 'Soccer', category: 'Sports', emoji: '⚽' },
        { content: 'Basketball', category: 'Sports', emoji: '🏀' },
        { content: 'Tennis', category: 'Sports', emoji: '🎾' }
      ]
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && gamePhase === 'playing') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 100);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'playing') {
      handleTimeout();
    }
  }, [timeLeft, gamePhase]);

  const startGame = () => {
    const itemSet = itemSets[difficulty];
    setCategories(itemSet.categories);
    setGamePhase('playing');
    setScore(0);
    setCurrentRound(1);
    setReactionTimes([]);
    setSpeed(3000);
    showNextItem();
  };

  const showNextItem = () => {
    const itemSet = itemSets[difficulty];
    const randomItem = itemSet.items[Math.floor(Math.random() * itemSet.items.length)];
    
    setCurrentItem({
      id: Date.now().toString(),
      ...randomItem
    });
    
    setTimeLeft(speed);
    setItemStartTime(Date.now());
  };

  const handleCategorySelect = (selectedCategory: string) => {
    if (!currentItem) return;
    
    const reactionTime = Date.now() - itemStartTime;
    setReactionTimes(prev => [...prev, reactionTime]);
    
    const isCorrect = selectedCategory === currentItem.category;
    
    if (isCorrect) {
      let points = 10;
      
      // Speed bonus
      if (reactionTime < speed * 0.3) points += 15;
      else if (reactionTime < speed * 0.5) points += 10;
      else if (reactionTime < speed * 0.7) points += 5;
      
      // Difficulty multiplier
      if (difficulty === 'medium') points *= 1.2;
      if (difficulty === 'hard') points *= 1.5;
      
      setScore(prev => prev + Math.round(points));
      
      // Increase speed after every 3 correct answers
      if (currentRound % 3 === 0) {
        setSpeed(prev => Math.max(1000, prev - 200));
      }
    }
    
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setTimeout(showNextItem, 500);
    } else {
      setGamePhase('result');
      onComplete(score);
    }
  };

  const handleTimeout = () => {
    // Treat timeout as incorrect answer
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      showNextItem();
    } else {
      setGamePhase('result');
      onComplete(score);
    }
  };

  const renderInstructions = () => (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Speed Sorting Challenge</h3>
      <div className="bg-yellow-50 rounded-xl p-6">
        <h4 className="font-semibold text-yellow-900 mb-3">How to Play:</h4>
        <div className="text-yellow-800 space-y-2 text-left">
          <p>• Items will flash on screen quickly</p>
          <p>• Sort each item into the correct category</p>
          <p>• Speed increases as you progress</p>
          <p>• React quickly for bonus points</p>
          <p>• Complete {totalRounds} items as fast as possible!</p>
        </div>
      </div>
      <button
        onClick={startGame}
        className="bg-yellow-600 text-white px-8 py-4 rounded-xl hover:bg-yellow-700 transition-colors font-semibold text-lg"
      >
        Start Speed Sorting
      </button>
    </div>
  );

  const renderGame = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center space-x-8 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{currentRound}</div>
          <div className="text-sm text-gray-600">of {totalRounds}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{(timeLeft / 10).toFixed(1)}s</div>
          <div className="text-sm text-gray-600">Time Left</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className="bg-red-500 h-3 rounded-full transition-all duration-100"
          style={{ width: `${(timeLeft / speed) * 100}%` }}
        ></div>
      </div>

      {/* Current Item */}
      <div className="bg-gray-100 rounded-2xl p-12 mb-6">
        {currentItem && (
          <div className="space-y-4">
            <div className="text-6xl">{currentItem.emoji}</div>
            <div className="text-3xl font-bold text-gray-900">{currentItem.content}</div>
          </div>
        )}
      </div>

      {/* Category Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className="p-4 bg-white border-2 border-gray-300 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 transition-all font-semibold text-gray-900"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );

  const renderResult = () => {
    const avgReactionTime = reactionTimes.length > 0 ? 
      reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length : 0;
    const accuracy = (score / (totalRounds * 10)) * 100;

    return (
      <div className="text-center space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
          accuracy >= 70 ? 'bg-green-100' : accuracy >= 50 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {accuracy >= 50 ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900">Speed Challenge Complete!</h3>
        <p className="text-lg text-gray-600">Final Score: {score} points</p>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Speed Performance</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{(avgReactionTime / 1000).toFixed(2)}s</div>
              <div className="text-sm text-gray-600">Avg Reaction Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{accuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
          <p className="text-yellow-800 text-sm">
            {avgReactionTime < 1000 ? "Lightning fast reflexes! Your decision speed is excellent." :
             avgReactionTime < 2000 ? "Great reaction time! Your categorization skills are sharp." :
             "Good effort! Practice more to improve your decision speed."}
          </p>
        </div>

        <button
          onClick={() => {
            setGamePhase('instructions');
            setScore(0);
            setCurrentRound(1);
            setReactionTimes([]);
          }}
          className="bg-yellow-600 text-white px-6 py-3 rounded-xl hover:bg-yellow-700 transition-colors flex items-center space-x-2 mx-auto"
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
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <div className="flex justify-center items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-gray-600">Decision Speed Training</span>
        </div>
      </div>

      {gamePhase === 'instructions' && renderInstructions()}
      {gamePhase === 'playing' && renderGame()}
      {gamePhase === 'result' && renderResult()}
    </div>
  );
};

export default SpeedSortingGame;