import React, { useState } from 'react';
import { Award, TrendingUp, Target, User, Clock, Calendar, Download } from 'lucide-react';
import { TestResult, UserProfile } from '../types';

interface TestResultsProps {
  result: TestResult;
  onNavigate: (page: string) => void;
  onProfileUpdate: (profile: UserProfile) => void;
  onPlanDurationSelect: (duration: number) => void;
}

const TestResults: React.FC<TestResultsProps> = ({ 
  result, 
  onNavigate, 
  onProfileUpdate, 
  onPlanDurationSelect 
}) => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    occupation: '',
    memoryGoals: [],
    learningStyle: 'mixed',
    availableTimePerDay: 30,
    challengeAreas: [],
    strengths: [],
    preferredDifficulty: 'medium'
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const memoryCategories = [
    { key: 'workingMemoryScore', label: 'Working Memory', icon: '🧠', description: 'Ability to hold and manipulate information' },
    { key: 'shortTermMemoryScore', label: 'Short-term Memory', icon: '⚡', description: 'Temporary storage of information' },
    { key: 'longTermMemoryScore', label: 'Long-term Memory', icon: '📚', description: 'Permanent storage and retrieval' },
    { key: 'visualMemoryScore', label: 'Visual Memory', icon: '👁️', description: 'Remembering visual information' },
    { key: 'processingSpeedScore', label: 'Processing Speed', icon: '🚀', description: 'Speed of cognitive processing' },
    { key: 'attentionScore', label: 'Attention & Focus', icon: '🎯', description: 'Sustained attention and concentration' }
  ];

  const handleGoalChange = (goal: string) => {
    const currentGoals = profileData.memoryGoals || [];
    if (currentGoals.includes(goal)) {
      setProfileData({
        ...profileData,
        memoryGoals: currentGoals.filter(g => g !== goal)
      });
    } else {
      setProfileData({
        ...profileData,
        memoryGoals: [...currentGoals, goal]
      });
    }
  };

  const handleSubmitProfile = () => {
    const profile: UserProfile = {
      name: profileData.name || 'User',
      age: profileData.age || 25,
      occupation: profileData.occupation || '',
      memoryGoals: profileData.memoryGoals || [],
      learningStyle: profileData.learningStyle || 'mixed',
      availableTimePerDay: profileData.availableTimePerDay || 30,
      challengeAreas: getChallengeAreas(),
      strengths: getStrengths(),
      preferredDifficulty: profileData.preferredDifficulty || 'medium'
    };
    
    onProfileUpdate(profile);
    setShowProfileForm(false);
  };

  const getChallengeAreas = () => {
    const areas = [];
    if (result.workingMemoryScore < 60) areas.push('Working Memory');
    if (result.shortTermMemoryScore < 60) areas.push('Short-term Memory');
    if (result.longTermMemoryScore < 60) areas.push('Long-term Memory');
    if (result.visualMemoryScore < 60) areas.push('Visual Memory');
    if (result.processingSpeedScore < 60) areas.push('Processing Speed');
    if (result.attentionScore < 60) areas.push('Attention & Focus');
    return areas;
  };

  const getStrengths = () => {
    const strengths = [];
    if (result.workingMemoryScore >= 70) strengths.push('Working Memory');
    if (result.shortTermMemoryScore >= 70) strengths.push('Short-term Memory');
    if (result.longTermMemoryScore >= 70) strengths.push('Long-term Memory');
    if (result.visualMemoryScore >= 70) strengths.push('Visual Memory');
    if (result.processingSpeedScore >= 70) strengths.push('Processing Speed');
    if (result.attentionScore >= 70) strengths.push('Attention & Focus');
    return strengths;
  };

  const handlePlanDuration = (duration: number) => {
    onPlanDurationSelect(duration);
    onNavigate('plan');
  };

  const exportResults = () => {
    const reportData = {
      testDate: result.date.toISOString(),
      overallScore: result.overallScore,
      difficulty: result.difficulty,
      timeSpent: result.timeSpent,
      detailedScores: {
        workingMemory: result.workingMemoryScore,
        shortTermMemory: result.shortTermMemoryScore,
        longTermMemory: result.longTermMemoryScore,
        visualMemory: result.visualMemoryScore,
        processingSpeed: result.processingSpeedScore,
        attention: result.attentionScore
      },
      strengths: getStrengths(),
      challengeAreas: getChallengeAreas(),
      recommendations: getRecommendations()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-test-results-${result.date.toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getRecommendations = () => {
    const recommendations = [];
    const challengeAreas = getChallengeAreas();
    
    if (challengeAreas.includes('Working Memory')) {
      recommendations.push('Practice dual n-back exercises daily');
    }
    if (challengeAreas.includes('Attention & Focus')) {
      recommendations.push('Try mindfulness meditation for 10 minutes daily');
    }
    if (challengeAreas.includes('Processing Speed')) {
      recommendations.push('Engage in speed-based cognitive games');
    }
    if (challengeAreas.includes('Visual Memory')) {
      recommendations.push('Use visual mnemonics and mind mapping techniques');
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue regular memory training exercises'];
  };

  if (showProfileForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Your Profile</h2>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Occupation</label>
              <input
                type="text"
                value={profileData.occupation}
                onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Memory Goals (select all that apply)</label>
              <div className="grid grid-cols-2 gap-3">
                {['Improve focus', 'Better recall', 'Academic performance', 'Work efficiency', 'Daily tasks', 'General wellness'].map(goal => (
                  <label key={goal} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profileData.memoryGoals?.includes(goal)}
                      onChange={() => handleGoalChange(goal)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Learning Style</label>
              <select
                value={profileData.learningStyle}
                onChange={(e) => setProfileData({...profileData, learningStyle: e.target.value as any})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="visual">Visual</option>
                <option value="auditory">Auditory</option>
                <option value="kinesthetic">Kinesthetic</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Available Time Per Day: {profileData.availableTimePerDay} minutes
              </label>
              <input
                type="range"
                min="15"
                max="120"
                value={profileData.availableTimePerDay}
                onChange={(e) => setProfileData({...profileData, availableTimePerDay: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowProfileForm(false)}
                className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProfile}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold mb-2">{result.overallScore}%</h1>
            <p className="text-xl mb-4">Overall Memory Score</p>
            <p className="text-lg opacity-90">{getScoreLevel(result.overallScore)}</p>
          </div>
          <div className="text-right">
            <button
              onClick={exportResults}
              className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Scores with Color-Coded Feedback */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {memoryCategories.map(category => {
          const score = result[category.key as keyof TestResult] as number;
          const colorClasses = getScoreColor(score);
          return (
            <div key={category.key} className={`rounded-2xl p-6 shadow-lg border-2 ${colorClasses}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{category.icon}</div>
                <div className={`px-4 py-2 rounded-full text-lg font-bold ${
                  score >= 80 ? 'bg-emerald-600 text-white' :
                  score >= 60 ? 'bg-yellow-600 text-white' :
                  'bg-red-600 text-white'
                }`}>
                  {score}%
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{category.label}</h3>
              <p className="text-sm opacity-80 mb-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{getScoreLevel(score)}</span>
                <div className="w-16 h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-current transition-all duration-500"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analysis with Enhanced Feedback */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
          <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Your Cognitive Strengths
          </h3>
          <ul className="space-y-3">
            {getStrengths().map((strength, index) => (
              <li key={index} className="flex items-center text-emerald-800">
                <div className="w-3 h-3 bg-emerald-600 rounded-full mr-3"></div>
                <span className="font-medium">{strength}</span>
                <span className="ml-auto text-sm bg-emerald-200 px-2 py-1 rounded-full">
                  {result[`${strength.toLowerCase().replace(/[^a-z]/g, '')}MemoryScore` as keyof TestResult] || 
                   result[`${strength.toLowerCase().replace(/[^a-z]/g, '')}Score` as keyof TestResult]}%
                </span>
              </li>
            ))}
            {getStrengths().length === 0 && (
              <li className="text-emerald-800 italic">Keep training - strengths will emerge with practice</li>
            )}
          </ul>
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
          <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Priority Improvement Areas
          </h3>
          <ul className="space-y-3">
            {getChallengeAreas().map((area, index) => (
              <li key={index} className="flex items-center text-orange-800">
                <div className="w-3 h-3 bg-orange-600 rounded-full mr-3"></div>
                <span className="font-medium">{area}</span>
                <span className="ml-auto text-sm bg-orange-200 px-2 py-1 rounded-full">
                  {result[`${area.toLowerCase().replace(/[^a-z]/g, '')}MemoryScore` as keyof TestResult] || 
                   result[`${area.toLowerCase().replace(/[^a-z]/g, '')}Score` as keyof TestResult]}%
                </span>
              </li>
            ))}
            {getChallengeAreas().length === 0 && (
              <li className="text-orange-800 italic">Excellent! All areas are performing well</li>
            )}
          </ul>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-indigo-50 rounded-2xl p-6 border-2 border-indigo-200 mb-8">
        <h3 className="text-lg font-bold text-indigo-900 mb-4">🎯 Personalized Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {getRecommendations().map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
              <span className="text-indigo-800">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Test Information */}
      <div className="bg-slate-50 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Test Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-600">Date</p>
              <p className="font-semibold">{result.date.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-600">Duration</p>
              <p className="font-semibold">{result.timeSpent.toFixed(1)} min</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-600">Difficulty</p>
              <p className="font-semibold capitalize">{result.difficulty}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-600">Level</p>
              <p className="font-semibold">{getScoreLevel(result.overallScore)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">What's Next?</h2>
        <p className="text-slate-600 mb-6">
          Ready to improve your memory? Create a personalized training plan based on your results.
        </p>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Your Plan Duration:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { duration: 45, label: '45 Days', description: 'Quick improvement', popular: false },
              { duration: 90, label: '90 Days', description: 'Balanced approach', popular: true },
              { duration: 180, label: '180 Days', description: 'Deep transformation', popular: false }
            ].map(plan => (
              <button
                key={plan.duration}
                onClick={() => handlePlanDuration(plan.duration)}
                className={`p-6 border-2 rounded-xl text-left hover:shadow-lg transition-all ${
                  plan.popular 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                {plan.popular && (
                  <div className="inline-block bg-indigo-600 text-white text-xs px-2 py-1 rounded-full mb-2">
                    Most Popular
                  </div>
                )}
                <h4 className="text-xl font-bold text-slate-900 mb-2">{plan.label}</h4>
                <p className="text-slate-600">{plan.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowProfileForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <User className="w-5 h-5" />
            <span>Create Personalized Plan</span>
          </button>
          
          <button
            onClick={() => onNavigate('guide')}
            className="bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center justify-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>Learn Techniques First</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;