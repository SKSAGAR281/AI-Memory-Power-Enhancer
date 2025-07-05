import React, { useState, useEffect } from 'react';
import { Grid3X3, Clock, Trophy, RefreshCw, Star } from 'lucide-react';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchingGameProps {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number) => void;
}

const MemoryMatchingGame: React.FC<MemoryMatchingGameProps> = ({ userId, difficulty, onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(3);
  const [roundScores, setRoundScores] = useState<number[]>([]);

  const difficultySettings = {
    easy: { 
      pairs: 6, 
      time: 90, 
      gridCols: 4, 
      symbols: ['🎯', '🌟', '🔥', '⚡', '🎨', '🎪'],
      description: '6 pairs'
    },
    medium: { 
      pairs: 8, 
      time: 75, 
      gridCols: 4, 
      symbols: ['🎯', '🌟', '🔥', '⚡', '🎨', '🎪', '🎭', '🚀'],
      description: '8 pairs'
    },
    hard: { 
      pairs: 12, 
      time: 60, 
      gridCols: 6, 
      symbols: ['🎯', '🌟', '🔥', '⚡', '🎨', '🎪', '🎭', '🚀', '🎸', '🎲', '🎳', '🎮'],
      description: '12 pairs'
    }
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty, round]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !gameCompleted) {
      endRound();
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    const settings = difficultySettings[difficulty];
    if (matches === settings.pairs && gameStarted) {
      endRound();
    }
  }, [matches, difficulty, gameStarted]);

  const initializeGame = () => {
    const settings = difficultySettings[difficulty];
    const symbols = settings.symbols;
    const cardPairs = [...symbols, ...symbols];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTimeLeft(settings.time);
    setGameStarted(false);
    setGameCompleted(false);
  };

  const startGame = () => {
    setGameStarted(true);
    if (round === 1) {
      setScore(0);
      setRoundScores([]);
    }
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameCompleted || flippedCards.length === 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const endRound = () => {
    setGameCompleted(true);
    const settings = difficultySettings[difficulty];
    
    // Calculate score based on matches, moves, and time
    let points = 0;
    const matchPercentage = (matches / settings.pairs) * 100;
    const timeBonus = Math.max(0, timeLeft);
    const movesPenalty = Math.max(0, moves - settings.pairs * 2);

    if (matchPercentage === 100) {
      points = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60;
      points += Math.floor(timeBonus / 5); // Time bonus
      points -= Math.floor(movesPenalty / 2); // Moves penalty
    } else {
      points = Math.floor(matchPercentage / 5);
    }

    points = Math.max(0, points);
    const newRoundScores = [...roundScores, points];
    setRoundScores(newRoundScores);
    setScore(prev => prev + points);

    if (round < totalRounds) {
      setTimeout(() => {
        setRound(prev => prev + 1);
        initializeGame();
      }, 3000);
    } else {
      onComplete(score + points);
    }
  };

  const settings = difficultySettings[difficulty];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Grid3X3 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Memory Matching Challenge</h2>
        <div className="flex justify-center items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-gray-600">{settings.description}</span>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center space-y-6">
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{round}</div>
              <div className="text-sm text-gray-600">Round</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
          </div>
          <p className="text-gray-600">Find all matching pairs before time runs out!</p>
          <button
            onClick={startGame}
            className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg"
          >
            Start Round {round}
          </button>
        </div>
      ) : (
        <>
          {/* Game Stats */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{round}</div>
              <div className="text-sm text-gray-600">Round</div>
            </div>
            <div className="text-center">
              <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-orange-600">{timeLeft}s</div>
            </div>
            <div className="text-center">
              <Trophy className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-600">{matches}/{settings.pairs}</div>
            </div>
            <div className="text-center">
              <Star className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-600">{moves}</div>
            </div>
          </div>

          {/* Game Grid */}
          <div 
            className="grid gap-3 max-w-2xl mx-auto mb-6"
            style={{ gridTemplateColumns: `repeat(${settings.gridCols}, 1fr)` }}
          >
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched || gameCompleted}
                className={`aspect-square rounded-xl text-2xl font-bold transition-all duration-300 ${
                  card.isFlipped || card.isMatched
                    ? card.isMatched 
                      ? 'bg-green-100 text-green-800 scale-95'
                      : 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 hover:bg-gray-300 hover:scale-105'
                } ${!gameStarted || gameCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </button>
            ))}
          </div>

          {/* Round Completed */}
          {gameCompleted && (
            <div className="text-center space-y-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                matches === settings.pairs ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                <Trophy className={`w-10 h-10 ${
                  matches === settings.pairs ? 'text-green-600' : 'text-orange-600'
                }`} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900">
                {matches === settings.pairs ? `Round ${round} Complete!` : 'Time\'s Up!'}
              </h3>
              
              <p className="text-lg text-gray-600">
                Round Score: {roundScores[round - 1] || 0} points
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">{matches}</div>
                    <div className="text-sm text-gray-600">Matches</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{moves}</div>
                    <div className="text-sm text-gray-600">Moves</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{timeLeft}</div>
                    <div className="text-sm text-gray-600">Time Left</div>
                  </div>
                </div>
              </div>

              {round >= totalRounds && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Challenge Complete!</h4>
                  <p className="text-lg font-bold text-green-600">Total Score: {score} points</p>
                  <div className="mt-2 text-sm text-gray-600">
                    Average: {(score / totalRounds).toFixed(1)} points per round
                  </div>
                </div>
              )}
              
              {round < totalRounds ? (
                <p className="text-gray-600">Next round starting in 3 seconds...</p>
              ) : (
                <button
                  onClick={() => {
                    setRound(1);
                    setScore(0);
                    setRoundScores([]);
                    initializeGame();
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemoryMatchingGame;