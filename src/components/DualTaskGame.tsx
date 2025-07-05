import React, { useState, useEffect } from 'react';
import { Calculator, Volume2, CheckCircle, XCircle, RefreshCw, Headphones } from 'lucide-react';

interface DualTaskGameProps {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

const DualTaskGame: React.FC<DualTaskGameProps> = ({ userId, difficulty, onComplete }) => {
  const [mathQuestion, setMathQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [gamePhase, setGamePhase] = useState<'instructions' | 'playing' | 'result'>('instructions');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(10);
  const [score, setScore] = useState(0);
  const [distractionActive, setDistractionActive] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  const difficultySettings = {
    easy: { timeLimit: 15000, distractionLevel: 'low' },
    medium: { timeLimit: 10000, distractionLevel: 'medium' },
    hard: { timeLimit: 7000, distractionLevel: 'high' }
  };

  const distractionSounds = {
    low: ['🎵 Soft music playing...', '🌊 Ocean waves...', '🍃 Wind sounds...'],
    medium: ['🎶 Pop music playing...', '🚗 Traffic noise...', '👥 Crowd chatter...'],
    high: ['🔊 Loud music...', '🚨 Sirens...', '📺 TV noise...', '🎪 Carnival sounds...']
  };

  const generateMathQuestion = () => {
    let question = '';
    let answer = 0;

    switch (difficulty) {
      case 'easy':
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const op = Math.random() > 0.5 ? '+' : '-';
        if (op === '+') {
          question = `${a} + ${b}`;
          answer = a + b;
        } else {
          const larger = Math.max(a, b);
          const smaller = Math.min(a, b);
          question = `${larger} - ${smaller}`;
          answer = larger - smaller;
        }
        break;
      
      case 'medium':
        const c = Math.floor(Math.random() * 12) + 2;
        const d = Math.floor(Math.random() * 12) + 2;
        const e = Math.floor(Math.random() * 10) + 1;
        const operations = ['multiply', 'divide', 'complex'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        if (operation === 'multiply') {
          question = `${c} × ${d}`;
          answer = c * d;
        } else if (operation === 'divide') {
          const dividend = c * d;
          question = `${dividend} ÷ ${c}`;
          answer = d;
        } else {
          question = `(${c} + ${d}) × ${e}`;
          answer = (c + d) * e;
        }
        break;
      
      case 'hard':
        const f = Math.floor(Math.random() * 15) + 5;
        const g = Math.floor(Math.random() * 15) + 5;
        const h = Math.floor(Math.random() * 8) + 2;
        const complexOps = ['square', 'mixed', 'fraction'];
        const complexOp = complexOps[Math.floor(Math.random() * complexOps.length)];
        
        if (complexOp === 'square') {
          const num = Math.floor(Math.random() * 12) + 8;
          question = `${num}²`;
          answer = num * num;
        } else if (complexOp === 'mixed') {
          question = `${f} × ${g} - ${h}²`;
          answer = f * g - h * h;
        } else {
          const numerator = f * 2;
          question = `${numerator} ÷ 2 + ${g}`;
          answer = numerator / 2 + g;
        }
        break;
    }

    setMathQuestion(question);
    setCorrectAnswer(answer);
    setQuestionStartTime(Date.now());
  };

  const startDistraction = () => {
    setDistractionActive(true);
    const level = difficultySettings[difficulty].distractionLevel as keyof typeof distractionSounds;
    const sounds = distractionSounds[level];
    
    // Simulate audio distraction with visual indicators
    const interval = setInterval(() => {
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      console.log('Distraction:', randomSound); // In real app, play audio
    }, 2000);

    setTimeout(() => {
      clearInterval(interval);
      setDistractionActive(false);
    }, difficultySettings[difficulty].timeLimit);
  };

  const startGame = () => {
    setGamePhase('playing');
    setCurrentQuestion(1);
    setScore(0);
    setReactionTimes([]);
    generateMathQuestion();
    startDistraction();
  };

  const submitAnswer = () => {
    const reactionTime = Date.now() - questionStartTime;
    setReactionTimes(prev => [...prev, reactionTime]);
    
    const userNum = parseFloat(userAnswer);
    const isCorrect = userNum === correctAnswer;
    
    if (isCorrect) {
      let points = 10;
      if (reactionTime < 5000) points += 5; // Speed bonus
      if (difficulty === 'medium') points *= 1.2;
      if (difficulty === 'hard') points *= 1.5;
      setScore(prev => prev + Math.round(points));
    }

    setUserAnswer('');
    
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
      generateMathQuestion();
      startDistraction();
    } else {
      setGamePhase('result');
      onComplete(score);
    }
  };

  const renderInstructions = () => (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Dual Task Challenge</h3>
      <div className="bg-orange-50 rounded-xl p-6">
        <h4 className="font-semibold text-orange-900 mb-3">How to Play:</h4>
        <div className="text-orange-800 space-y-2 text-left">
          <p>• Solve math problems while distractions play</p>
          <p>• Ignore the background noise and focus on calculations</p>
          <p>• Answer quickly for bonus points</p>
          <p>• Complete {totalQuestions} questions</p>
          <p>• Train your focus under pressure!</p>
        </div>
      </div>
      <button
        onClick={startGame}
        className="bg-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-700 transition-colors font-semibold text-lg"
      >
        Start Dual Task Challenge
      </button>
    </div>
  );

  const renderGame = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center space-x-8 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{currentQuestion}</div>
          <div className="text-sm text-gray-600">of {totalQuestions}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>

      {distractionActive && (
        <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-200">
          <div className="flex items-center justify-center space-x-2">
            <Headphones className="w-5 h-5 text-red-600 animate-pulse" />
            <span className="text-red-800 font-medium">Distraction Active</span>
            <Volume2 className="w-5 h-5 text-red-600 animate-bounce" />
          </div>
        </div>
      )}

      <div className="bg-gray-100 rounded-2xl p-12">
        <div className="text-4xl font-bold text-gray-900 mb-6">{mathQuestion}</div>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
          placeholder="Enter your answer"
          className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-xl"
          autoFocus
        />
      </div>

      <button
        onClick={submitAnswer}
        disabled={!userAnswer}
        className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 font-semibold"
      >
        Submit Answer
      </button>
    </div>
  );

  const renderResult = () => {
    const avgReactionTime = reactionTimes.length > 0 ? 
      reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length : 0;
    const accuracy = (score / (totalQuestions * 10)) * 100;

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

        <h3 className="text-2xl font-bold text-gray-900">Challenge Complete!</h3>
        <p className="text-lg text-gray-600">Score: {score} points</p>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Focus Performance</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{accuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{(avgReactionTime / 1000).toFixed(1)}s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setGamePhase('instructions');
            setScore(0);
            setCurrentQuestion(1);
            setReactionTimes([]);
          }}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center space-x-2 mx-auto"
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
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <div className="flex justify-center items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-gray-600">Focus Under Distraction</span>
        </div>
      </div>

      {gamePhase === 'instructions' && renderInstructions()}
      {gamePhase === 'playing' && renderGame()}
      {gamePhase === 'result' && renderResult()}
    </div>
  );
};

export default DualTaskGame;