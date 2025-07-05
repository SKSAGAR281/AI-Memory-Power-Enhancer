import React, { useState, useEffect } from 'react';
import { Hash, Clock, CheckCircle, XCircle, RefreshCw, Target } from 'lucide-react';

interface NumberSequenceGameProps {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

const NumberSequenceGame: React.FC<NumberSequenceGameProps> = ({ userId, difficulty, onComplete }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState('');
  const [phase, setPhase] = useState<'showing' | 'input' | 'result'>('showing');
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [showingIndex, setShowingIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);
  const [roundScores, setRoundScores] = useState<number[]>([]);

  const difficultySettings = {
    easy: { 
      length: 4, 
      range: 10, 
      time: 15, 
      speed: 1000,
      description: '4 numbers (1-10)'
    },
    medium: { 
      length: 6, 
      range: 50, 
      time: 12, 
      speed: 800,
      description: '6 numbers (1-50)'
    },
    hard: { 
      length: 8, 
      range: 100, 
      time: 10, 
      speed: 600,
      description: '8 numbers (1-100)'
    }
  };

  useEffect(() => {
    generateSequence();
  }, [difficulty, round]);

  useEffect(() => {
    if (timeLeft > 0 && phase === 'input') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && phase === 'input') {
      checkAnswer();
    }
  }, [timeLeft, phase]);

  const generateSequence = () => {
    const settings = difficultySettings[difficulty];
    // Increase difficulty slightly with each round
    const adjustedLength = settings.length + Math.floor((round - 1) / 2);
    const newSequence = Array.from({ length: adjustedLength }, () => 
      Math.floor(Math.random() * settings.range) + 1
    );
    setSequence(newSequence);
    setPhase('showing');
    setShowingIndex(0);
    setUserInput('');
    showSequence(newSequence, settings.speed);
  };

  const showSequence = (seq: number[], speed: number) => {
    seq.forEach((num, index) => {
      setTimeout(() => {
        setShowingIndex(index);
      }, index * speed);
    });

    setTimeout(() => {
      setPhase('input');
      setTimeLeft(difficultySettings[difficulty].time);
    }, seq.length * speed + 500);
  };

  const checkAnswer = () => {
    const userSequence = userInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const correctCount = userSequence.filter((num, index) => num === sequence[index]).length;
    const accuracy = (correctCount / sequence.length) * 100;
    
    let points = 0;
    if (accuracy === 100) points = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40;
    else if (accuracy >= 75) points = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 22 : 30;
    else if (accuracy >= 50) points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    else if (accuracy >= 25) points = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10;

    // Bonus for completing within time
    if (timeLeft > 0) {
      points += Math.floor(timeLeft / 2);
    }

    const newRoundScores = [...roundScores, points];
    setRoundScores(newRoundScores);
    setScore(prev => prev + points);

    if (round < totalRounds) {
      setRound(prev => prev + 1);
      setTimeout(() => {
        generateSequence();
      }, 2000);
    } else {
      setPhase('result');
      onComplete(score + points);
    }
  };

  const renderShowingPhase = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center space-x-8 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{round}</div>
          <div className="text-sm text-gray-600">Round</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900">Memorize this sequence</h3>
      <div className="flex justify-center space-x-4 flex-wrap">
        {sequence.map((num, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-300 ${
              index <= showingIndex 
                ? 'bg-indigo-600 text-white scale-110 shadow-lg' 
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {index <= showingIndex ? num : '?'}
          </div>
        ))}
      </div>
      <p className="text-gray-600">Watch carefully...</p>
    </div>
  );

  const renderInputPhase = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center space-x-8 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{round}</div>
          <div className="text-sm text-gray-600">Round</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{timeLeft}s</div>
          <div className="text-sm text-gray-600">Time Left</div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900">Enter the sequence</h3>
      <p className="text-gray-600">Type the numbers separated by commas (e.g., 1,2,3,4)</p>
      
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter sequence..."
        className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
        autoFocus
      />
      
      <button
        onClick={checkAnswer}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Submit Answer
      </button>

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3">
        <div
          className="bg-orange-500 h-3 rounded-full transition-all duration-1000"
          style={{ width: `${(timeLeft / difficultySettings[difficulty].time) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderResultPhase = () => {
    const avgScore = roundScores.length > 0 ? roundScores.reduce((sum, s) => sum + s, 0) / roundScores.length : 0;
    
    return (
      <div className="text-center space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
          avgScore >= 25 ? 'bg-green-100' : avgScore >= 15 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {avgScore >= 15 ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900">Challenge Complete!</h3>
        <p className="text-lg text-gray-600">Total Score: {score} points</p>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Round Breakdown</h4>
          <div className="grid grid-cols-5 gap-2">
            {roundScores.map((roundScore, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-indigo-600">{roundScore}</div>
                <div className="text-xs text-gray-600">R{index + 1}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{avgScore.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Average per Round</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
          <p className="text-green-800 text-sm">
            {avgScore >= 30 ? "Outstanding number memory! Your sequential recall is excellent." :
             avgScore >= 20 ? "Great performance! Your number sequence skills are developing well." :
             avgScore >= 10 ? "Good effort! Keep practicing to improve your number memory." :
             "Keep training! Number sequence memory improves with regular practice."}
          </p>
        </div>
        
        <button
          onClick={() => {
            setRound(1);
            setScore(0);
            setRoundScores([]);
            generateSequence();
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
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Hash className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Number Sequence Challenge</h2>
        <div className="flex justify-center items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-gray-600">
            {difficultySettings[difficulty].description}
          </span>
        </div>
      </div>

      {phase === 'showing' && renderShowingPhase()}
      {phase === 'input' && renderInputPhase()}
      {phase === 'result' && renderResultPhase()}
    </div>
  );
};

export default NumberSequenceGame;