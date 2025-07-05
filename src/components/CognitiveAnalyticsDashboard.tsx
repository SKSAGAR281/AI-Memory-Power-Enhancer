import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Brain, Clock, Target, Download, Eye, Ear, Hand, MessageSquare } from 'lucide-react';

interface CognitiveAnalyticsProps {
  userId: string;
  testResults: any[];
  dailyTasks: any[];
}

const CognitiveAnalyticsDashboard: React.FC<CognitiveAnalyticsProps> = ({ userId, testResults, dailyTasks }) => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'attention' | 'memory' | 'processing' | 'overall'>('overall');

  useEffect(() => {
    generateAnalytics();
  }, [testResults, dailyTasks, selectedTimeframe]);

  const generateAnalytics = () => {
    if (testResults.length === 0) return;

    const now = new Date();
    const timeframes = {
      week: 7,
      month: 30,
      all: 365
    };

    const cutoffDate = new Date(now.getTime() - timeframes[selectedTimeframe] * 24 * 60 * 60 * 1000);
    const filteredResults = testResults.filter(result => new Date(result.date) >= cutoffDate);

    // Attention Span Analysis
    const attentionData = filteredResults.map(result => ({
      date: result.date,
      score: result.attentionScore,
      timeSpent: result.timeSpent
    }));

    // Memory Recall Analysis
    const memoryData = filteredResults.map(result => ({
      date: result.date,
      working: result.workingMemoryScore,
      shortTerm: result.shortTermMemoryScore,
      longTerm: result.longTermMemoryScore,
      visual: result.visualMemoryScore
    }));

    // Processing Speed Analysis
    const processingData = filteredResults.map(result => ({
      date: result.date,
      score: result.processingSpeedScore,
      timeSpent: result.timeSpent
    }));

    // Strengths and Weaknesses
    const latestResult = filteredResults[filteredResults.length - 1];
    const strengths = [];
    const weaknesses = [];

    if (latestResult) {
      const categories = [
        { name: 'Working Memory', score: latestResult.workingMemoryScore },
        { name: 'Short-term Memory', score: latestResult.shortTermMemoryScore },
        { name: 'Long-term Memory', score: latestResult.longTermMemoryScore },
        { name: 'Visual Memory', score: latestResult.visualMemoryScore },
        { name: 'Processing Speed', score: latestResult.processingSpeedScore },
        { name: 'Attention', score: latestResult.attentionScore }
      ];

      categories.forEach(category => {
        if (category.score >= 75) {
          strengths.push(category.name);
        } else if (category.score < 60) {
          weaknesses.push(category.name);
        }
      });
    }

    // Task Performance Analysis
    const taskAnalysis = analyzeTasks();

    setAnalyticsData({
      attentionData,
      memoryData,
      processingData,
      strengths,
      weaknesses,
      taskAnalysis,
      overallTrend: calculateTrend(filteredResults),
      cognitiveLoad: calculateCognitiveLoad(filteredResults),
      recommendations: generateRecommendations(strengths, weaknesses, taskAnalysis)
    });
  };

  const analyzeTasks = () => {
    const completedTasks = dailyTasks.filter(task => task.completed);
    const totalTasks = dailyTasks.length;
    
    const categoryPerformance = {};
    const difficultyPerformance = {};

    dailyTasks.forEach(task => {
      // Category analysis
      if (!categoryPerformance[task.category]) {
        categoryPerformance[task.category] = { completed: 0, total: 0 };
      }
      categoryPerformance[task.category].total++;
      if (task.completed) {
        categoryPerformance[task.category].completed++;
      }

      // Difficulty analysis
      if (!difficultyPerformance[task.difficulty]) {
        difficultyPerformance[task.difficulty] = { completed: 0, total: 0 };
      }
      difficultyPerformance[task.difficulty].total++;
      if (task.completed) {
        difficultyPerformance[task.difficulty].completed++;
      }
    });

    return {
      completionRate: totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0,
      categoryPerformance,
      difficultyPerformance,
      streakAnalysis: calculateStreaks()
    };
  };

  const calculateStreaks = () => {
    const sortedTasks = dailyTasks
      .filter(task => task.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentStreak = 0;
    let maxStreak = 0;
    let lastDate = null;

    sortedTasks.forEach(task => {
      const taskDate = new Date(task.date).toDateString();
      
      if (lastDate && new Date(taskDate).getTime() - new Date(lastDate).getTime() === 24 * 60 * 60 * 1000) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      
      maxStreak = Math.max(maxStreak, currentStreak);
      lastDate = taskDate;
    });

    return { currentStreak, maxStreak };
  };

  const calculateTrend = (results: any[]) => {
    if (results.length < 2) return 'stable';
    
    const scores = results.map(r => r.overallScore);
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    const improvement = secondAvg - firstAvg;
    
    if (improvement > 5) return 'improving';
    if (improvement < -5) return 'declining';
    return 'stable';
  };

  const calculateCognitiveLoad = (results: any[]) => {
    if (results.length === 0) return 'low';
    
    const avgTimeSpent = results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length;
    const avgScore = results.reduce((sum, r) => sum + r.overallScore, 0) / results.length;
    
    // High time, low score = high cognitive load
    if (avgTimeSpent > 15 && avgScore < 60) return 'high';
    if (avgTimeSpent > 10 && avgScore < 70) return 'medium';
    return 'low';
  };

  const generateRecommendations = (strengths: string[], weaknesses: string[], taskAnalysis: any) => {
    const recommendations = [];

    // Based on weaknesses
    if (weaknesses.includes('Working Memory')) {
      recommendations.push('Focus on dual n-back training exercises');
    }
    if (weaknesses.includes('Attention')) {
      recommendations.push('Practice mindfulness meditation for 10 minutes daily');
    }
    if (weaknesses.includes('Processing Speed')) {
      recommendations.push('Try speed-based cognitive games and exercises');
    }

    // Based on task performance
    if (taskAnalysis.completionRate < 50) {
      recommendations.push('Set smaller, more achievable daily goals');
    }
    if (taskAnalysis.streakAnalysis.maxStreak < 3) {
      recommendations.push('Focus on building consistency with easier tasks first');
    }

    // Based on strengths
    if (strengths.length > 0) {
      recommendations.push(`Leverage your strength in ${strengths[0]} to tackle challenging areas`);
    }

    return recommendations.length > 0 ? recommendations : ['Continue your current training routine'];
  };

  const exportToPDF = () => {
    // Simple export functionality - in a real app, you'd use a proper PDF library
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cognitive-analytics-${userId}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (!analyticsData) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Analytics Data</h2>
          <p className="text-gray-600">Complete some tests to see your cognitive analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cognitive Analytics Dashboard</h1>
          <p className="text-gray-600">Detailed insights into your cognitive performance</p>
        </div>
        <button
          onClick={exportToPDF}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Focus Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="overall">Overall Performance</option>
              <option value="attention">Attention Span</option>
              <option value="memory">Memory Recall</option>
              <option value="processing">Processing Speed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Attention Span</p>
              <p className="text-3xl font-bold">
                {analyticsData.attentionData.length > 0 
                  ? Math.round(analyticsData.attentionData[analyticsData.attentionData.length - 1].score)
                  : 0}%
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Memory Recall</p>
              <p className="text-3xl font-bold">
                {analyticsData.memoryData.length > 0 
                  ? Math.round((analyticsData.memoryData[analyticsData.memoryData.length - 1].working + 
                               analyticsData.memoryData[analyticsData.memoryData.length - 1].shortTerm + 
                               analyticsData.memoryData[analyticsData.memoryData.length - 1].longTerm) / 3)
                  : 0}%
              </p>
            </div>
            <Brain className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Processing Speed</p>
              <p className="text-3xl font-bold">
                {analyticsData.processingData.length > 0 
                  ? Math.round(analyticsData.processingData[analyticsData.processingData.length - 1].score)
                  : 0}%
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Task Completion</p>
              <p className="text-3xl font-bold">{Math.round(analyticsData.taskAnalysis.completionRate)}%</p>
            </div>
            <Target className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts and Analysis */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Strengths and Weaknesses */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cognitive Profile</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
              {analyticsData.strengths.length > 0 ? (
                <div className="space-y-2">
                  {analyticsData.strengths.map((strength: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Keep training to identify your strengths</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-orange-900 mb-2">Areas for Improvement</h4>
              {analyticsData.weaknesses.length > 0 ? (
                <div className="space-y-2">
                  {analyticsData.weaknesses.map((weakness: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-800 text-sm">{weakness}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">All areas performing well!</p>
              )}
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Trends</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Overall Trend</span>
              <span className={`font-semibold capitalize ${
                analyticsData.overallTrend === 'improving' ? 'text-green-600' :
                analyticsData.overallTrend === 'declining' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {analyticsData.overallTrend}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Cognitive Load</span>
              <span className={`font-semibold capitalize ${
                analyticsData.cognitiveLoad === 'high' ? 'text-red-600' :
                analyticsData.cognitiveLoad === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {analyticsData.cognitiveLoad}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Current Streak</span>
              <span className="font-semibold text-purple-600">
                {analyticsData.taskAnalysis.streakAnalysis.currentStreak} days
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Best Streak</span>
              <span className="font-semibold text-indigo-600">
                {analyticsData.taskAnalysis.streakAnalysis.maxStreak} days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Personalized Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {analyticsData.recommendations.map((recommendation: string, index: number) => (
            <div key={index} className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CognitiveAnalyticsDashboard;