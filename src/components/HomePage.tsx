import React from 'react';
import { Brain, Target, TrendingUp, Award, Play, BookOpen } from 'lucide-react';
import { TestResult, UserProfile } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  userProfile: UserProfile | null;
  testResults: TestResult[];
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, userProfile, testResults }) => {
  const latestScore = testResults.length > 0 ? testResults[testResults.length - 1].overallScore : null;
  const improvement = testResults.length > 1 
    ? testResults[testResults.length - 1].overallScore - testResults[0].overallScore 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
          Unlock Your
          <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent"> Memory Power</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          Transform your cognitive abilities with AI-powered memory enhancement techniques, 
          personalized training plans, and scientifically-backed strategies.
        </p>
        
        {!testResults.length ? (
          <button
            onClick={() => onNavigate('test')}
            className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto"
          >
            <Play className="w-6 h-6" />
            <span>Start Memory Assessment</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('test')}
              className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Brain className="w-5 h-5" />
              <span>Take New Test</span>
            </button>
            <button
              onClick={() => onNavigate('plan')}
              className="bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center space-x-2"
            >
              <Target className="w-5 h-5" />
              <span>View My Plan</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {testResults.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-2xl font-bold text-indigo-600">{latestScore}%</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Latest Score</h3>
            <p className="text-slate-600 text-sm">Your most recent memory assessment</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <span className={`text-2xl font-bold ${improvement >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Improvement</h3>
            <p className="text-slate-600 text-sm">Change from first assessment</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-sky-600" />
              </div>
              <span className="text-2xl font-bold text-sky-600">{testResults.length}</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Tests Taken</h3>
            <p className="text-slate-600 text-sm">Total assessments completed</p>
          </div>
        </div>
      )}

      {/* Welcome Message */}
      {userProfile && (
        <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl p-8 mb-12 border border-indigo-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back, {userProfile.name}!</h2>
          <p className="text-slate-600 mb-4">
            Ready to continue your memory enhancement journey? You have {userProfile.availableTimePerDay} minutes 
            allocated for daily training.
          </p>
          <button
            onClick={() => onNavigate('tasks')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            View Today's Tasks
          </button>
        </div>
      )}

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
            <Brain className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Memory Assessment</h3>
          <p className="text-slate-600 mb-6">
            Comprehensive testing of working memory, short-term, long-term, visual, and auditory memory capabilities.
          </p>
          <button
            onClick={() => onNavigate('test')}
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            Take Test →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
            <Target className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized Plans</h3>
          <p className="text-slate-600 mb-6">
            Custom training programs tailored to your goals, learning style, and available time commitment.
          </p>
          <button
            onClick={() => onNavigate('plan')}
            className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            View Plans →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-sky-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Learning Resources</h3>
          <p className="text-slate-600 mb-6">
            Scientifically-backed techniques, nutrition tips, and lifestyle recommendations for optimal brain health.
          </p>
          <button
            onClick={() => onNavigate('guide')}
            className="text-sky-600 font-semibold hover:text-sky-700 transition-colors"
          >
            Learn More →
          </button>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Memory?</h2>
        <p className="text-xl mb-6 opacity-90">
          Join thousands of users who have already improved their cognitive abilities with our AI-powered platform.
        </p>
        <button
          onClick={() => onNavigate(testResults.length ? 'tasks' : 'test')}
          className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          {testResults.length ? 'Continue Training' : 'Start Your Journey'}
        </button>
      </div>
    </div>
  );
};

export default HomePage;