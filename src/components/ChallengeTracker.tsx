import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Flame, Target, CheckCircle, Star, Award, Crown } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  startDate: Date;
  endDate: Date;
  dailyGoals: DailyGoal[];
  rewards: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'memory' | 'attention' | 'speed' | 'mixed';
}

interface DailyGoal {
  id: string;
  day: number;
  title: string;
  description: string;
  completed: boolean;
  points: number;
  type: 'test' | 'exercise' | 'habit' | 'milestone';
}

interface ChallengeTrackerProps {
  userId: string;
}

const ChallengeTracker: React.FC<ChallengeTrackerProps> = ({ userId }) => {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    level: 1,
    challengesCompleted: 0
  });

  useEffect(() => {
    loadUserData();
    initializeChallenges();
  }, [userId]);

  const loadUserData = () => {
    const savedStats = localStorage.getItem(`challenge_stats_${userId}`);
    const savedActive = localStorage.getItem(`active_challenges_${userId}`);
    const savedCompleted = localStorage.getItem(`completed_challenges_${userId}`);

    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }

    if (savedActive) {
      const active = JSON.parse(savedActive).map((challenge: any) => ({
        ...challenge,
        startDate: new Date(challenge.startDate),
        endDate: new Date(challenge.endDate)
      }));
      setActiveChallenges(active);
    }

    if (savedCompleted) {
      const completed = JSON.parse(savedCompleted).map((challenge: any) => ({
        ...challenge,
        startDate: new Date(challenge.startDate),
        endDate: new Date(challenge.endDate)
      }));
      setCompletedChallenges(completed);
    }
  };

  const saveUserData = () => {
    localStorage.setItem(`challenge_stats_${userId}`, JSON.stringify(userStats));
    localStorage.setItem(`active_challenges_${userId}`, JSON.stringify(activeChallenges));
    localStorage.setItem(`completed_challenges_${userId}`, JSON.stringify(completedChallenges));
  };

  const initializeChallenges = () => {
    // Check if user has any active challenges, if not, suggest starting one
    const saved = localStorage.getItem(`active_challenges_${userId}`);
    if (!saved || JSON.parse(saved).length === 0) {
      // User has no active challenges
    }
  };

  const generateChallenge = (type: '30day' | '7day' | 'weekend', difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    const challengeTemplates = {
      '30day': {
        beginner: {
          title: "30-Day Memory Foundation",
          description: "Build strong memory habits with daily exercises and techniques",
          goals: [
            { title: "Complete daily memory test", type: "test", points: 10 },
            { title: "Practice one memory technique", type: "exercise", points: 5 },
            { title: "Read brain health tip", type: "habit", points: 3 }
          ]
        },
        intermediate: {
          title: "30-Day Memory Mastery",
          description: "Advanced memory training with challenging exercises",
          goals: [
            { title: "Score 80%+ on memory test", type: "test", points: 15 },
            { title: "Complete 3 memory exercises", type: "exercise", points: 10 },
            { title: "Practice spaced repetition", type: "habit", points: 8 }
          ]
        },
        advanced: {
          title: "30-Day Memory Champion",
          description: "Elite-level memory training for peak performance",
          goals: [
            { title: "Score 90%+ on hard difficulty test", type: "test", points: 25 },
            { title: "Master new memory technique", type: "exercise", points: 20 },
            { title: "Teach technique to someone", type: "milestone", points: 15 }
          ]
        }
      },
      '7day': {
        beginner: {
          title: "7-Day Memory Kickstart",
          description: "Quick introduction to memory improvement",
          goals: [
            { title: "Take memory assessment", type: "test", points: 15 },
            { title: "Learn basic technique", type: "exercise", points: 10 },
            { title: "Practice daily", type: "habit", points: 5 }
          ]
        },
        intermediate: {
          title: "7-Day Memory Intensive",
          description: "Intensive week of memory training",
          goals: [
            { title: "Improve test score by 10%", type: "test", points: 20 },
            { title: "Master 2 techniques", type: "exercise", points: 15 },
            { title: "Complete all daily tasks", type: "habit", points: 10 }
          ]
        },
        advanced: {
          title: "7-Day Memory Sprint",
          description: "High-intensity memory training week",
          goals: [
            { title: "Achieve personal best score", type: "test", points: 30 },
            { title: "Complete advanced exercises", type: "exercise", points: 25 },
            { title: "Perfect daily streak", type: "milestone", points: 20 }
          ]
        }
      }
    };

    const template = challengeTemplates[type][difficulty];
    const duration = type === '30day' ? 30 : 7;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    const dailyGoals: DailyGoal[] = [];
    for (let day = 1; day <= duration; day++) {
      template.goals.forEach((goal, index) => {
        dailyGoals.push({
          id: `${day}-${index}`,
          day,
          title: goal.title,
          description: `Day ${day}: ${goal.title}`,
          completed: false,
          points: goal.points,
          type: goal.type as any
        });
      });
    }

    const newChallenge: Challenge = {
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      duration,
      startDate,
      endDate,
      dailyGoals,
      rewards: generateRewards(difficulty, duration),
      difficulty,
      category: 'mixed'
    };

    return newChallenge;
  };

  const generateRewards = (difficulty: string, duration: number): string[] => {
    const baseRewards = [
      `${duration}-Day Completion Badge`,
      `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level Certificate`
    ];

    if (difficulty === 'advanced') {
      baseRewards.push('Memory Champion Title', 'Exclusive Advanced Techniques Guide');
    }

    if (duration >= 30) {
      baseRewards.push('Monthly Warrior Badge', 'Habit Master Achievement');
    }

    return baseRewards;
  };

  const startChallenge = (type: '30day' | '7day', difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    const newChallenge = generateChallenge(type, difficulty);
    const updatedActive = [...activeChallenges, newChallenge];
    setActiveChallenges(updatedActive);
    setSelectedChallenge(newChallenge);
    saveUserData();
  };

  const completeGoal = (challengeId: string, goalId: string) => {
    const updatedChallenges = activeChallenges.map(challenge => {
      if (challenge.id === challengeId) {
        const updatedGoals = challenge.dailyGoals.map(goal => {
          if (goal.id === goalId && !goal.completed) {
            const updatedStats = {
              ...userStats,
              totalPoints: userStats.totalPoints + goal.points,
              currentStreak: userStats.currentStreak + 1,
              longestStreak: Math.max(userStats.longestStreak, userStats.currentStreak + 1),
              level: Math.floor((userStats.totalPoints + goal.points) / 100) + 1
            };
            setUserStats(updatedStats);
            
            return { ...goal, completed: true };
          }
          return goal;
        });
        
        return { ...challenge, dailyGoals: updatedGoals };
      }
      return challenge;
    });

    setActiveChallenges(updatedChallenges);
    saveUserData();
  };

  const getChallengeProgress = (challenge: Challenge) => {
    const completedGoals = challenge.dailyGoals.filter(goal => goal.completed).length;
    const totalGoals = challenge.dailyGoals.length;
    return { completed: completedGoals, total: totalGoals, percentage: (completedGoals / totalGoals) * 100 };
  };

  const getCurrentDayGoals = (challenge: Challenge) => {
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - challenge.startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    return challenge.dailyGoals.filter(goal => goal.day === daysSinceStart);
  };

  const renderChallengeSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Challenge</h2>
        <p className="text-gray-600">Select a challenge that matches your goals and commitment level</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 30-Day Challenge */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <div className="text-center mb-6">
            <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">30-Day Memory Bootcamp</h3>
            <p className="text-gray-600">Transform your memory with consistent daily practice</p>
          </div>

          <div className="space-y-3">
            {['beginner', 'intermediate', 'advanced'].map(difficulty => (
              <button
                key={difficulty}
                onClick={() => startChallenge('30day', difficulty as any)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  difficulty === 'beginner' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                  difficulty === 'intermediate' ? 'border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50' :
                  'border-red-300 hover:border-red-500 hover:bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{difficulty}</h4>
                    <p className="text-sm text-gray-600">
                      {difficulty === 'beginner' ? '15-30 min/day' :
                       difficulty === 'intermediate' ? '30-45 min/day' :
                       '45-60 min/day'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {difficulty === 'beginner' ? 'Easy' :
                     difficulty === 'intermediate' ? 'Medium' :
                     'Hard'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 7-Day Challenge */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="text-center mb-6">
            <Flame className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">7-Day Memory Sprint</h3>
            <p className="text-gray-600">Quick intensive training for rapid improvement</p>
          </div>

          <div className="space-y-3">
            {['beginner', 'intermediate', 'advanced'].map(difficulty => (
              <button
                key={difficulty}
                onClick={() => startChallenge('7day', difficulty as any)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  difficulty === 'beginner' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                  difficulty === 'intermediate' ? 'border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50' :
                  'border-red-300 hover:border-red-500 hover:bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{difficulty}</h4>
                    <p className="text-sm text-gray-600">
                      {difficulty === 'beginner' ? '20-30 min/day' :
                       difficulty === 'intermediate' ? '30-45 min/day' :
                       '45-75 min/day'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {difficulty === 'beginner' ? 'Easy' :
                     difficulty === 'intermediate' ? 'Medium' :
                     'Hard'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveChallenge = (challenge: Challenge) => {
    const progress = getChallengeProgress(challenge);
    const todaysGoals = getCurrentDayGoals(challenge);
    const daysRemaining = Math.ceil((challenge.endDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000));

    return (
      <div className="space-y-6">
        {/* Challenge Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{challenge.title}</h2>
              <p className="text-xl opacity-90">{challenge.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{daysRemaining}</div>
              <div className="text-sm opacity-75">Days Left</div>
            </div>
          </div>
          
          <div className="mt-6 bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="text-sm opacity-75 mt-2">
            {progress.completed} of {progress.total} goals completed ({progress.percentage.toFixed(0)}%)
          </div>
        </div>

        {/* Today's Goals */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Goals</h3>
          {todaysGoals.length > 0 ? (
            <div className="space-y-3">
              {todaysGoals.map(goal => (
                <div
                  key={goal.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    goal.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => completeGoal(challenge.id, goal.id)}
                      disabled={goal.completed}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        goal.completed 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {goal.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                    <div>
                      <h4 className={`font-semibold ${goal.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                        {goal.title}
                      </h4>
                      <p className={`text-sm ${goal.completed ? 'text-green-600' : 'text-gray-600'}`}>
                        {goal.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{goal.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">All Done for Today!</h4>
              <p className="text-gray-600">Come back tomorrow for new goals</p>
            </div>
          )}
        </div>

        {/* Rewards */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Challenge Rewards</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {challenge.rewards.map((reward, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700">{reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Level</p>
              <p className="text-3xl font-bold">{userStats.level}</p>
            </div>
            <Crown className="w-8 h-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Points</p>
              <p className="text-2xl font-bold text-yellow-600">{userStats.totalPoints}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</p>
            </div>
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Challenges Done</p>
              <p className="text-2xl font-bold text-green-600">{userStats.challengesCompleted}</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeChallenges.length === 0 ? (
        renderChallengeSelection()
      ) : (
        <div className="space-y-8">
          {activeChallenges.map(challenge => (
            <div key={challenge.id}>
              {renderActiveChallenge(challenge)}
            </div>
          ))}
          
          <div className="text-center">
            <button
              onClick={() => setActiveChallenges([])}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
            >
              Start New Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeTracker;