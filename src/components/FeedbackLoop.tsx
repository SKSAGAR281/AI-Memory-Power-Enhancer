import React, { useState, useEffect } from 'react';
import { MessageSquare, TrendingUp, Target, Star, Send, BarChart3 } from 'lucide-react';
import { memoryAPI } from '../services/api';

interface FeedbackLoopProps {
  userId: string;
}

const FeedbackLoop: React.FC<FeedbackLoopProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'analytics'>('feedback');
  const [feedbackType, setFeedbackType] = useState<'general' | 'test_difficulty' | 'feature_request'>('general');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await memoryAPI.getPerformanceAnalytics(userId);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalytics();
    }
  }, [activeTab, userId]);

  const submitFeedback = async () => {
    if (rating === 0) return;

    try {
      await memoryAPI.submitFeedback(userId, feedbackType, rating, comment);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setComment('');
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const renderFeedbackForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Experience</h3>
        <p className="text-gray-600 mb-6">
          Your feedback helps us improve the memory training experience for everyone.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What would you like to share feedback about?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'general', label: 'General Experience', icon: MessageSquare },
            { value: 'test_difficulty', label: 'Test Difficulty', icon: Target },
            { value: 'feature_request', label: 'Feature Request', icon: Star }
          ].map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setFeedbackType(option.value as any)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  feedbackType === option.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 text-indigo-600 mb-2" />
                <div className="font-medium text-gray-900">{option.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you rate your experience? (1-5 stars)
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`w-12 h-12 rounded-full transition-all ${
                star <= rating
                  ? 'bg-yellow-400 text-white transform scale-110'
                  : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
              }`}
            >
              <Star className="w-6 h-6 mx-auto" fill={star <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tell us more about your experience
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            feedbackType === 'general' ? 'What did you like or dislike about the app?' :
            feedbackType === 'test_difficulty' ? 'Were the tests too easy, too hard, or just right?' :
            'What features would you like to see added?'
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-green-600 font-semibold mb-1">Thank you for your feedback!</div>
          <div className="text-green-700 text-sm">Your input helps us improve the experience.</div>
        </div>
      ) : (
        <button
          onClick={submitFeedback}
          disabled={rating === 0}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Send className="w-5 h-5" />
          <span>Submit Feedback</span>
        </button>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Performance Analytics</h3>
        <p className="text-gray-600 mb-6">
          Detailed insights into your memory training progress and patterns.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* Overall Performance */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-4">Overall Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{analytics.analysis?.latest_score || 0}%</div>
                <div className="text-sm text-gray-600">Latest Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.analysis?.improvement >= 0 ? '+' : ''}{analytics.analysis?.improvement || 0}%
                </div>
                <div className="text-sm text-gray-600">Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analytics.analysis?.consistency || 0}%</div>
                <div className="text-sm text-gray-600">Consistency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{analytics.analysis?.total_tests || 0}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
            </div>
          </div>

          {/* Performance by Type */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">Performance by Test Type</h4>
            <div className="space-y-3">
              {Object.entries(analytics.performance_by_type || {}).map(([type, score]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{type.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(score as number, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">Trend Analysis</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-600">
                    {analytics.recent_performance || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Recent Performance</div>
                </div>
              </div>
              <div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-600">
                    {analytics.historical_performance || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Historical Average</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Trend Direction</span>
              </div>
              <p className="text-gray-700 capitalize">
                Your performance is {analytics.analysis?.trend_direction || 'stable'}
                {analytics.improvement_trend !== 0 && (
                  <span className={`ml-2 font-semibold ${
                    analytics.improvement_trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({analytics.improvement_trend > 0 ? '+' : ''}{analytics.improvement_trend}% trend)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h4>
          <p className="text-gray-600">Complete some tests to see your performance analytics.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'feedback'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-5 h-5 mx-auto mb-1" />
              Feedback
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5 mx-auto mb-1" />
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'feedback' ? renderFeedbackForm() : renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default FeedbackLoop;