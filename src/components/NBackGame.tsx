import React, { useState, useEffect } from 'react';
import { Brain, Clock, Target, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface NBackGameProps {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

const NBackGame: React.FC<NBackGameProps> = ({ userId, difficulty, onComplete }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<boolean[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gamePhase, setGamePhase] = useState<'instructions' | 'playing' | 'result'>('instructions');
  const [nBack, setNBack] = useState(1);
  const [score, setScore] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const positions = [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
    { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
    { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }
  ];

  const difficultySettings = {
    easy: { nBack: 1, sequenceLength: 15, showTime: 2000, gameType: 'letters' },
    medium: { nBack: 2, sequenceLength: 20, showTime: 1500, gameType: 'letters' },
    hard: { nBack: 3, sequenceLength: 25, showTime: 1000, gameType: 'positions' }
  };

  useEffect(() => {
    const settings = difficultySettings[difficulty];
    setNBack(settings.nBack);
  }, [difficulty]);

  const generateSequence = () => {
    const settings = difficultySettings[difficulty];
    const items = settings.gameType === 'letters' ? letters : positions;
    const newSequence = [];
    
    for (let i = 0; i < settings.sequenceLength; i++) {
      if (i >= settings.nBack && Math.random() < 0.3) {
        // 30% chance to repeat an item from n-back position
        newSequence.push(newSequence[i - settings.nBack]);
      } else {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        newSequence.push(settings.gameType === 'letters' ? randomItem : `${randomItem.x},${randomItem.y}`);
      }
    }
    
    setSequence(newSequence);
    setCurrentIndex(0);
    setUserResponses([]);
    setReactionTimes([]);
  };

  const startGame = () => {
    generateSequence();
    setGamePhase('playing');
    showNextItem();
  };

  const showNextItem = () => {
    if (currentIndex >= sequence.length) {
      endGame();
      return;
    }

    setShowingSequence(true);
    setQuestionStartTime(Date.now());
    
    setTimeout(() => {
      setShowingSequence(false);
      // For items after n-back position, ask if current matches n-back
      if (currentIndex >= nBack) {
        // User needs to respond
      } else {
        // Auto-advance for first n items
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          showNextItem();
        }, 1000);
      }
    }, difficultySettings[difficulty].showTime);
  };

  const handleResponse = (isMatch: boolean) => {
    const reactionTime = Date.now() - questionStartTime;
    setReactionTimes(prev => [...prev, reactionTime]);
    
    const actualMatch = sequence[currentIndex] === sequence[currentIndex - nBack];
    const correct = isMatch === actualMatch;
    
    setUserResponses(prev => [...prev, correct]);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      showNextItem();
    }, 500);
  };

  const endGame = () => {
    const correctResponses = userResponses.filter(response => response).length;
    const totalResponses = userResponses.length;
    const accuracy = totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0;
    const avgReactionTime = reactionTimes.length > 0 ? 
      reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length : 0;
    
    let points = Math.round(accuracy);
    if (avgReactionTime < 1000) points += 10; // Bonus for fast reactions
    if (difficulty === 'medium') points *= 1.2;
    if (difficulty === 'hard') points *= 1.5;
    
    setScore(Math.round(points));
    setGamePhase('result');
    onComplete(Math.round(points));
  };

  const renderInstructions = () => (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">N-Back Challenge</h3>
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-3">How to Play:</h4>
        <div className="text-blue-800 space-y-2 text-left">
          <p>• Watch the sequence of {difficultySettings[difficulty].gameType}</p>
          <p>• Remember what appeared {nBack} step{nBack > 1 ? 's' : ''} back</p>
          <p>• Click "Match" if current item matches the one {nBack} step{nBack > 1 ? 's' : ''} back</p>
          <p>• Click "No Match" if it doesn't match</p>
          <p>• React quickly for bonus points!</p>
        </div>
      </div>
      <button
        onClick={startGame}
        className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
      >
        Start {nBack}-Back Challenge
      </button>
    </div>
  );

  const renderGame = () => {
    const settings = difficultySettings[difficulty];
    const currentItem = sequence[currentIndex];
    const needsResponse = currentIndex >= nBack && !showingSequence;

    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentIndex + 1}</div>
            <div className="text-sm text-gray-600">of {sequence.length}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{nBack}-Back</div>
            <div className="text-sm text-gray-600">Challenge</div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-12 mb-6">
          {showingSequence ? (
            settings.gameType === 'letters' ? (
              <div className="text-6xl font-bold text-indigo-600">{currentItem}</div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
                {positions.map((pos, index) => {
                  const [x, y] = currentItem.split(',').map(Number);
                  const isActive = pos.x === x && pos.y === y;
                  return (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-lg ${
                        isActive ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            )
          ) : needsResponse ? (
            <div className="space-y-4">
              <p className="text-xl text-gray-700">
                Does this match what appeared {nBack} step{nBack > 1 ? 's' : ''} back?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleResponse(true)}
                  className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold"
                >
                  Match
                </button>
                <button
                  onClick={() => handleResponse(false)}
                  className="bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                  No Match
                </button>
              </div>
            </div>
          ) : (
            <div className="text-2xl text-gray-500">Get ready...</div>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{userResponses.filter(r => r).length}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">{userResponses.filter(r => !r).length}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {reactionTimes.length > 0 ? Math.round(reactionTimes[reactionTimes.length - 1]) : 0}ms
              </div>
              <div className="text-sm text-gray-600">Last Reaction</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const accuracy = userResponses.length > 0 ? 
      (userResponses.filter(r => r).length / userResponses.length) * 100 : 0;
    const avgReactionTime = reactionTimes.length > 0 ? 
      reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length : 0;

    return (
      <div className="text-center space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
          accuracy >= 80 ? 'bg-green-100' : accuracy >= 60 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {accuracy >= 60 ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900">Challenge Complete!</h3>
        <p className="text-lg text-gray-600">Score: {score} points</p>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{accuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{avgReactionTime.toFixed(0)}ms</div>
              <div className="text-sm text-gray-600">Avg Reaction Time</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setGamePhase('instructions');
            setScore(0);
            setUserResponses([]);
            setReactionTimes([]);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
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
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <span className="text-gray-600">Working Memory Training</span>
        </div>
      </div>

      {gamePhase === 'instructions' && renderInstructions()}
      {gamePhase === 'playing' && renderGame()}
      {gamePhase === 'result' && renderResult()}
    </div>
  );
};

export default NBackGame;