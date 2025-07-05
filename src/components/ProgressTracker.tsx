import React, { useState, useMemo } from 'react';
import { TrendingUp, Calendar, Target, Award, Brain, BarChart3 } from 'lucide-react';
import { TestResult, DailyTask } from '../types';

interface ProgressTrackerProps {
  testResults: TestResult[];
  dailyTasks: DailyTask[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ testResults, dailyTasks }) => {
  const [selectedMetric, setSelectedMetric] = useState<'overall' | 'working' | 'shortTerm' | 'longTerm' | 'visual' | 'processing' | 'attention'>('overall');

  const progressData = useMemo(() => {
    if (testResults.length === 0) return null;

    const sortedResults = [...testResults].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstResult = sortedResults[0];
    const latestResult = sortedResults[sortedResults.length - 1];

    const improvement = {
      overall: latestResult.overallScore - firstResult.overallScore,
      working: latestResult.workingMemoryScore - firstResult.workingMemoryScore,
      shortTerm: latestResult.shortTermMemoryScore - firstResult.shortTermMemoryScore,
      longTerm: latestResult.longTermMemoryScore - firstResult.longTermMemoryScore,
      visual: latestResult.visualMemoryScore - firstResult.visualMemoryScore,
      processing: latestResult.processingSpeedScore - firstResult.processingSpeedScore,
      attention: latestResult.attentionScore - firstResult.attentionScore
    };

    return {
      firstResult,
      latestResult,
      improvement,
      totalTests: testResults.length
    };
  }, [testResults]);

  const taskStats = useMemo(() => {
    const completed = dailyTasks.filter(task => task.completed).length;
    const total = dailyTasks.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    const last7Days = dailyTasks.filter(task => {
      const taskDate = new Date(task.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return taskDate >= weekAgo && taskDate <= new Date();
    });
    
    const weeklyCompletion = last7Days.length > 0 
      ? (last7Days.filter(task => task.completed).length / last7Days.length) * 100 
      : 0;

    const streaks = dailyTasks.map(task => task.streak);
    const maxStreak = Math.max(...streaks, 0);
    const avgStreak = streaks.length > 0 ? streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length : 0;

    return {
      completed,
      total,
      completionRate,
      weeklyCompletion,
      maxStreak,
      avgStreak
    };
  }, [dailyTasks]);

  const getMetricData = (metric: string) => {
    if (!progressData) return [];
    
    return testResults.map(result => {
      const score = metric === 'overall' ? result.overallScore :
                   metric === 'working' ? result.workingMemoryScore :
                   metric === 'shortTerm' ? result.shortTermMemoryScore :
                   metric === 'longTerm' ? result.longTermMemoryScore :
                   metric === 'visual' ? result.visualMemoryScore :
                   metric === 'processing' ? result.processingSpeedScore :
                   result.attentionScore;
      
      return {
        date: result.date,
        score
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const metricOptions = [
    { key: 'overall', label: 'Overall Score', icon: Brain },
    { key: 'working', label: 'Working Memory', icon: Target },
    { key: 'shortTerm', label: 'Short-term Memory', icon: BarChart3 },
    { key: 'longTerm', label: 'Long-term Memory', icon: Calendar },
    { key: 'visual', label: 'Visual Memory', icon: Award },
    { key: 'processing', label: 'Processing Speed', icon: TrendingUp },
    { key: 'attention', label: 'Attention', icon: Target }
  ];

  if (testResults.length === 0 && dailyTasks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Progress Data Yet</h2>
          <p className="text-gray-600 mb-6">
            Complete memory tests and daily tasks to track your progress here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Progress Tracker</h1>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {progressData && (
          <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Latest Score</p>
                  <p className="text-3xl font-bold">{progressData.latestResult.overallScore}%</p>
                </div>
                <Brain className="w-8 h-8 text-indigo-200" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Improvement</p>
                  <p className={`text-2xl font-bold ${
                    progressData.improvement.overall >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {progressData.improvement.overall >= 0 ? '+' : ''}{progressData.improvement.overall.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Task Completion</p>
              <p className="text-2xl font-bold text-purple-600">{taskStats.completionRate.toFixed(0)}%</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Max Streak</p>
              <p className="text-2xl font-bold text-orange-600">{taskStats.maxStreak}</p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Memory Score Progress */}
      {progressData && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Memory Score Progress</h2>
          
          {/* Metric Selection */}
          <div className="flex flex-wrap gap-2 mb-6">
            {metricOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => setSelectedMetric(option.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    selectedMetric === option.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Simple Progress Chart */}
          <div className="space-y-4">
            {getMetricData(selectedMetric).map((dataPoint, index) => {
              const isLatest = index === getMetricData(selectedMetric).length - 1;
              const isFirst = index === 0;
              const improvement = index > 0 
                ? dataPoint.score - getMetricData(selectedMetric)[index - 1].score 
                : 0;

              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-24 text-sm text-gray-600">
                    {dataPoint.date.toLocaleDateString()}
                  </div>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`h-6 rounded-full transition-all duration-500 ${
                        isLatest ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(dataPoint.score, 100)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                      {dataPoint.score}%
                    </span>
                  </div>
                  
                  {index > 0 && (
                    <div className={`w-16 text-sm font-medium ${
                      improvement >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Performance */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Task Performance</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Overall Completion</span>
                <span className="text-sm font-medium">{taskStats.completionRate.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${taskStats.completionRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="text-sm font-medium">{taskStats.weeklyCompletion.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${taskStats.weeklyCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{taskStats.completed}</p>
              <p className="text-sm text-gray-600">Tasks Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{taskStats.total}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Streak Analysis</h3>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{taskStats.maxStreak}</p>
              <p className="text-sm text-gray-600">Longest Streak</p>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{taskStats.avgStreak.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Average Streak</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
              <p className="text-sm text-orange-800 font-medium mb-2">Consistency Tip</p>
              <p className="text-xs text-orange-700">
                Maintaining streaks helps build lasting memory improvement habits. 
                Try to complete at least one task daily!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress Insights</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-indigo-900 mb-2">Strengths</h4>
            <ul className="space-y-1 text-sm text-indigo-800">
              {progressData && progressData.improvement.overall > 0 && (
                <li>• Overall memory score improved by {progressData.improvement.overall.toFixed(1)}%</li>
              )}
              {taskStats.completionRate > 70 && (
                <li>• Excellent task completion rate of {taskStats.completionRate.toFixed(0)}%</li>
              )}
              {taskStats.maxStreak > 5 && (
                <li>• Great consistency with a {taskStats.maxStreak}-day streak</li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">Areas to Focus</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              {taskStats.completionRate < 50 && (
                <li>• Work on completing more daily tasks consistently</li>
              )}
              {taskStats.maxStreak < 3 && (
                <li>• Build longer streaks for better habit formation</li>
              )}
              {progressData && progressData.totalTests < 3 && (
                <li>• Take more assessments to track progress accurately</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;