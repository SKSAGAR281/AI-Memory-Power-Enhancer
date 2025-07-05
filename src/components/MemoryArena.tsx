import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Star, Zap, Target, Clock, Award, Crown, Play, Pause } from 'lucide-react';
import NumberSequenceGame from './NumberSequenceGame';
import MemoryMatchingGame from './MemoryMatchingGame';
import NBackGame from './NBackGame';
import PatternRecallGame from './PatternRecallGame';
import DualTaskGame from './DualTaskGame';
import SpeedSortingGame from './SpeedSortingGame';
import WordImageMatchGame from './WordImageMatchGame';

interface GameSession {
  id: string;
  gameType: 'nback' | 'patternRecall' | 'dualTask' | 'speedSort' | 'wordImage' | 'sequence' | 'matching';
  score: number;
  level: number;
  duration: number;
  date: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface MemoryArenaProps {
  userId: string;
}

const MemoryArena: React.FC<MemoryArenaProps> = ({ userId }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    totalXP: 0,
    level: 1,
    gamesPlayed: 0,
    highestScore: 0,
    currentStreak: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  useEffect(() => {
    loadUserData();
    initializeAchievements();
  }, [userId]);

  const loadUserData = () => {
    const savedStats = localStorage.getItem(`arena_stats_${userId}`);
    const savedHistory = localStorage.getItem(`arena_history_${userId}`);
    
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    
    if (savedHistory) {
      const history = JSON.parse(savedHistory).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
      setGameHistory(history);
    }
  };

  const saveUserData = (stats: any, history: GameSession[]) => {
    localStorage.setItem(`arena_stats_${userId}`, JSON.stringify(stats));
    localStorage.setItem(`arena_history_${userId}`, JSON.stringify(history));
    setUserStats(stats);
    setGameHistory(history);
  };

  const initializeAchievements = () => {
    const defaultAchievements: Achievement[] = [
      {
        id: 'first_game',
        title: 'First Steps',
        description: 'Play your first memory game',
        icon: '🎮',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'score_100',
        title: 'Century Club',
        description: 'Score 100 points in a single game',
        icon: '💯',
        unlocked: false,
        progress: 0,
        maxProgress: 100
      },
      {
        id: 'streak_5',
        title: 'On Fire',
        description: 'Win 5 games in a row',
        icon: '🔥',
        unlocked: false,
        progress: 0,
        maxProgress: 5
      },
      {
        id: 'level_10',
        title: 'Memory Master',
        description: 'Reach level 10',
        icon: '🧠',
        unlocked: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: 'games_50',
        title: 'Dedicated Trainer',
        description: 'Play 50 games',
        icon: '🏆',
        unlocked: false,
        progress: 0,
        maxProgress: 50
      },
      {
        id: 'nback_master',
        title: 'N-Back Champion',
        description: 'Score 150+ in N-Back Challenge',
        icon: '🎯',
        unlocked: false,
        progress: 0,
        maxProgress: 150
      },
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete Speed Sorting in under 1s avg',
        icon: '⚡',
        unlocked: false,
        progress: 0,
        maxProgress: 1000
      }
    ];

    const saved = localStorage.getItem(`achievements_${userId}`);
    if (saved) {
      setAchievements(JSON.parse(saved));
    } else {
      setAchievements(defaultAchievements);
    }
  };

  const updateAchievements = (newStats: any, newHistory: GameSession[]) => {
    const updatedAchievements = achievements.map(achievement => {
      let newProgress = achievement.progress;
      let unlocked = achievement.unlocked;

      switch (achievement.id) {
        case 'first_game':
          newProgress = newStats.gamesPlayed > 0 ? 1 : 0;
          break;
        case 'score_100':
          newProgress = Math.max(newProgress, newStats.highestScore);
          break;
        case 'streak_5':
          newProgress = newStats.currentStreak;
          break;
        case 'level_10':
          newProgress = newStats.level;
          break;
        case 'games_50':
          newProgress = newStats.gamesPlayed;
          break;
        case 'nback_master':
          const nbackScores = newHistory.filter(h => h.gameType === 'nback').map(h => h.score);
          newProgress = Math.max(newProgress, ...nbackScores, 0);
          break;
      }

      if (newProgress >= achievement.maxProgress && !unlocked) {
        unlocked = true;
        showAchievementNotification(achievement);
      }

      return { ...achievement, progress: newProgress, unlocked };
    });

    setAchievements(updatedAchievements);
    localStorage.setItem(`achievements_${userId}`, JSON.stringify(updatedAchievements));
  };

  const showAchievementNotification = (achievement: Achievement) => {
    // Create a toast notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white p-4 rounded-xl shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="text-2xl">${achievement.icon}</span>
        <div>
          <h4 class="font-bold">Achievement Unlocked!</h4>
          <p class="text-sm">${achievement.title}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const startGame = (gameType: string) => {
    setActiveGame(gameType);
  };

  const endGame = (finalScore: number) => {
    const newSession: GameSession = {
      id: Date.now().toString(),
      gameType: activeGame as any,
      score: finalScore,
      level: 1,
      duration: 0,
      date: new Date()
    };

    const newStats = {
      ...userStats,
      totalXP: userStats.totalXP + finalScore,
      level: Math.floor((userStats.totalXP + finalScore) / 100) + 1,
      gamesPlayed: userStats.gamesPlayed + 1,
      highestScore: Math.max(userStats.highestScore, finalScore),
      currentStreak: finalScore > 50 ? userStats.currentStreak + 1 : 0
    };

    const newHistory = [...gameHistory, newSession];
    saveUserData(newStats, newHistory);
    updateAchievements(newStats, newHistory);
  };

  const renderGameSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Memory Arena</h2>
        <p className="text-slate-600">Challenge yourself with these enhanced memory games</p>
      </div>

      {/* Difficulty Selection */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Select Difficulty</h3>
        <div className="flex justify-center space-x-4">
          {(['easy', 'medium', 'hard'] as const).map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-6 py-3 rounded-xl font-medium transition-all capitalize ${
                difficulty === level
                  ? level === 'easy' ? 'bg-emerald-600 text-white' :
                    level === 'medium' ? 'bg-indigo-600 text-white' :
                    'bg-red-600 text-white'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 'nback',
            title: 'N-Back Challenge',
            description: 'Train working memory and attention span',
            icon: '🧠',
            difficulty: `${difficulty === 'easy' ? '1-Back' : difficulty === 'medium' ? '2-Back' : '3-Back'}`,
            color: 'from-blue-500 to-indigo-600'
          },
          {
            id: 'patternRecall',
            title: 'Pattern Recall',
            description: 'Memorize and recreate visual patterns',
            icon: '👁️',
            difficulty: `${difficulty === 'easy' ? '3x3 grid' : difficulty === 'medium' ? '4x4 grid' : '5x5 grid'}`,
            color: 'from-purple-500 to-pink-600'
          },
          {
            id: 'dualTask',
            title: 'Dual Task Challenge',
            description: 'Focus under distraction with math problems',
            icon: '🎯',
            difficulty: `${difficulty === 'easy' ? 'Light noise' : difficulty === 'medium' ? 'Medium noise' : 'Heavy noise'}`,
            color: 'from-orange-500 to-red-600'
          },
          {
            id: 'speedSort',
            title: 'Speed Sorting',
            description: 'Quick categorization and decision making',
            icon: '⚡',
            difficulty: `${difficulty === 'easy' ? '3 categories' : difficulty === 'medium' ? '4 categories' : '5 categories'}`,
            color: 'from-yellow-500 to-orange-600'
          },
          {
            id: 'wordImage',
            title: 'Word-Image Match',
            description: 'Semantic memory and word associations',
            icon: '🔗',
            difficulty: `${difficulty === 'easy' ? 'Simple words' : difficulty === 'medium' ? 'Complex words' : 'Abstract concepts'}`,
            color: 'from-indigo-500 to-purple-600'
          },
          {
            id: 'sequence',
            title: 'Number Sequence',
            description: 'Remember number sequences of varying difficulty',
            icon: '🔢',
            difficulty: `${difficulty === 'easy' ? '4 numbers (1-10)' : difficulty === 'medium' ? '6 numbers (1-50)' : '8 numbers (1-100)'}`,
            color: 'from-emerald-500 to-green-600'
          },
          {
            id: 'matching',
            title: 'Memory Matching',
            description: 'Find matching pairs with time pressure',
            icon: '🃏',
            difficulty: `${difficulty === 'easy' ? '6' : difficulty === 'medium' ? '8' : '12'} pairs`,
            color: 'from-orange-500 to-red-600'
          }
        ].map(game => (
          <button
            key={game.id}
            onClick={() => startGame(game.id)}
            className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-left group"
          >
            <div className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <span className="text-2xl">{game.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{game.title}</h3>
            <p className="text-slate-600 mb-3">{game.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-indigo-600">{game.difficulty}</span>
              <Gamepad2 className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderUserStats = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-2xl p-6 text-white mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Arena Champion</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5" />
              <span>Level {userStats.level}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>{userStats.totalXP} XP</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{userStats.highestScore}</div>
          <div className="text-sm opacity-75">Best Score</div>
        </div>
      </div>
      
      <div className="mt-4 bg-white/20 rounded-full h-2">
        <div
          className="bg-white h-2 rounded-full transition-all duration-500"
          style={{ width: `${(userStats.totalXP % 100)}%` }}
        ></div>
      </div>
      <div className="text-sm opacity-75 mt-1">
        {100 - (userStats.totalXP % 100)} XP to next level
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Achievements</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`p-4 rounded-xl border-2 ${
              achievement.unlocked 
                ? 'border-emerald-200 bg-emerald-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  achievement.unlocked ? 'text-emerald-900' : 'text-slate-700'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.unlocked ? 'text-emerald-700' : 'text-slate-600'
                }`}>
                  {achievement.description}
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.unlocked ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {achievement.progress} / {achievement.maxProgress}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!activeGame ? (
        <>
          {renderUserStats()}
          {renderAchievements()}
          {renderGameSelection()}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {activeGame === 'sequence' && (
            <NumberSequenceGame 
              userId={userId} 
              difficulty={difficulty} 
              onComplete={(score) => endGame(score)} 
            />
          )}
          {activeGame === 'matching' && (
            <MemoryMatchingGame 
              userId={userId} 
              difficulty={difficulty} 
              onComplete={(score) => endGame(score)} 
            />
          )}
          {activeGame === 'nback' && (
            <NBackGame 
              userId={userId} 
              difficulty={difficulty} 
              onComplete={(score) => endGame(score)} 
            />
          )}
          {activeGame === 'patternRecall' && (
            <PatternRecallGame 
              userId={userId} 
              difficulty={difficulty} 
              onComplete={(score) => endGame(score)} 
            />
          )}
          {activeGame === 'dualTask' && (
            <DualTaskGame 
              userId={userId} 
              difficulty={difficulty} 
              onComplete={(score) => endGame(score)} 
            />
          )}
          {activeGame === 'speedSort' && (
            <SpeedSortingGame 
              userId={userId} 
              difficulty={difficulty} 
              onComplete={(score) => endGame(score)} 
            />
          )}
          {activeGame === 'wordImage' && (
            <WordImageMatchGame 
              userId={userId} 
              difficulty={difficulty} 
              onComplete={(score) => endGame(score)} 
            />
          )}
          
          <div className="text-center mt-6">
            <button
              onClick={() => setActiveGame(null)}
              className="bg-slate-500 text-white px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
            >
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryArena;