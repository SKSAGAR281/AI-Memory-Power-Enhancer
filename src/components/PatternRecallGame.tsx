import React, { useState, useEffect } from 'react';
import { Grid3X3, Clock, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface PatternRecallGameProps {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

const PatternRecallGame: React.FC<PatternRecallGameProps> = ({ userId, difficulty, onComplete }) => {
  const [pattern, setPattern] = useState<boolean[]>([]);
  const [userPattern, setUserPattern] = useState<boolean[]>([]);
  const [gamePhase, setGamePhase] = useState<'instructions' | 'showing' | 'recall' | 'result'>('instructions');
  const [gridSize, setGridSize] = useState(3);
  const [showTime, setShowTime] = useState(5000);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(5);

  const difficultySettings = {
    easy: { gridSize: 3, patternCount: 3, showTime: 5000, recallTime: 10000 },
    medium: { gridSize: 4, patternCount: 6, showTime: 4000, recallTime: 8000 },
    hard: { gridSize: 5, patternCount: 10, showTime: 3000, recallTime: 6000 }
  };

  useEffect(() => {
    const settings = difficultySettings[difficulty];
    setGridSize(settings.gridSize);
    setShowTime(settings.showTime);
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && (gamePhase === 'showing' || gamePhase === 'recall')) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'showing') {
      setGamePhase('recall');
      setTimeLeft(difficultySettings[difficulty].recallTime / 1000);
    } else if (timeLeft === 0 && gamePhase === 'recall') {
      checkPattern();
    }
  }, [timeLeft, gamePhase]);

  const generatePattern = () => {
    const settings = difficultySettings[difficulty];
    const totalCells = settings.gridSize * settings.gridSize;
    const newPattern = new Array(totalCells).fill(false);
    
    // Randomly select cells to activate
    const activeCells = new Set<number>();
    while (activeCells.size < settings.patternCount) {
      activeCells.add(Math.floor(Math.random() * totalCells));
    }
    
    activeCells.forEach(index => {
      newPattern[index] = true;
    });
    
    setPattern(newPattern);
    setUserPattern(new Array(totalCells).fill(false));
  };

  const startGame = () => {
    generatePattern();
    setGamePhase('showing');
    setTimeLeft(showTime / 1000);
    setRound(1);
    setScore(0);
  };

  const toggleCell = (index: number) => {
    if (gamePhase !== 'recall') return;
    
    const newUserPattern = [...userPattern];
    newUserPattern[index] = !newUserPattern[index];
    setUserPattern(newUserPattern);
  };

  const checkPattern = () => {
    const correctCells = pattern.reduce((count, isActive, index) => {
      return count + (isActive === userPattern[index] ? 1 : 0);
    }, 0);
    
    const accuracy = (correctCells / pattern.length) * 100;
    let roundScore = Math.round(accuracy);
    
    // Bonus for perfect recall
    if (accuracy === 100) roundScore += 20;
    
    // Difficulty multiplier
    if (difficulty === 'medium') roundScore *= 1.2;
    if (difficulty === 'hard') roundScore *= 1.5;
    
    setScore(prev => prev + Math.round(roundScore));
    
    if (round < totalRounds) {
      setTimeout(() => {
        setRound(prev => prev + 1);
        generatePattern();
        setGamePhase('showing');
        setTimeLeft(showTime / 1000);
      }, 2000);
    } else {
      setGamePhase('result');
      onComplete(score + Math.round(roundScore));
    }
  };

  const submitPattern = () => {
    checkPattern();
  };

  const renderInstructions = () => (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Pattern Recall Challenge</h3>
      <div className="bg-purple-50 rounded-xl p-6">
        <h4 className="font-semibold text-purple-900 mb-3">How to Play:</h4>
        <div className="text-purple-800 space-y-2 text-left">
          <p>• Study the highlighted pattern for {showTime / 1000} seconds</p>
          <p>• Memorize the positions of colored squares</p>
          <p>• Recreate the pattern by clicking squares</p>
          <p>• Complete {totalRounds} rounds with increasing complexity</p>
          <p>• Perfect recall earns bonus points!</p>
        </div>
      </div>
      <button
        onClick={startGame}
        className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold text-lg"
      >
        Start Pattern Challenge
      </button>
    </div>
  );

  const renderGame = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center space-x-8 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{round}</div>
          <div className="text-sm text-gray-600">Round</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{timeLeft}s</div>
          <div className="text-sm text-gray-600">Time Left</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-2xl p-8">
        <div 
          className="grid gap-2 max-w-md mx-auto"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {pattern.map((isActive, index) => (
            <button
              key={index}
              onClick={() => toggleCell(index)}
              disabled={gamePhase === 'showing'}
              className={`aspect-square rounded-lg border-2 transition-all duration-300 ${
                gamePhase === 'showing' 
                  ? isActive 
                    ? 'bg-purple-600 border-purple-700 animate-pulse shadow-lg' 
                    : 'bg-gray-300 border-gray-400'
                  : userPattern[index]
                    ? 'bg-blue-600 border-blue-700 shadow-lg'
                    : 'bg-gray-300 border-gray-400 hover:bg-gray-400 hover:scale-105'
              }`}
            />
          ))}
        </div>
      </div>

      {gamePhase === 'showing' && (
        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-purple-800 font-medium">
            Study the pattern carefully! Time remaining: {timeLeft}s
          </p>
        </div>
      )}

      {gamePhase === 'recall' && (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-blue-800 font-medium">
              Recreate the pattern by clicking the squares! Time: {timeLeft}s
            </p>
          </div>
          <button
            onClick={submitPattern}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Submit Pattern
          </button>
        </div>
      )}
    </div>
  );

  const renderResult = () => {
    const avgScore = score / totalRounds;
    
    return (
      <div className="text-center space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
          avgScore >= 80 ? 'bg-green-100' : avgScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {avgScore >= 60 ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900">Challenge Complete!</h3>
        <p className="text-lg text-gray-600">Total Score: {score} points</p>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Performance Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{avgScore.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalRounds}</div>
              <div className="text-sm text-gray-600">Rounds Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
          <p className="text-purple-800 text-sm">
            {avgScore >= 90 ? "Outstanding visual memory! Your pattern recognition is excellent." :
             avgScore >= 70 ? "Great work! Your visual memory is developing well." :
             avgScore >= 50 ? "Good effort! Keep practicing to improve pattern recognition." :
             "Keep training! Visual memory improves with regular practice."}
          </p>
        </div>

        <button
          onClick={() => {
            setGamePhase('instructions');
            setScore(0);
            setRound(1);
          }}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
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
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <div className="flex justify-center items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-gray-600">Visual Memory Training</span>
        </div>
      </div>

      {gamePhase === 'instructions' && renderInstructions()}
      {(gamePhase === 'showing' || gamePhase === 'recall') && renderGame()}
      {gamePhase === 'result' && renderResult()}
    </div>
  );
};

export default PatternRecallGame;