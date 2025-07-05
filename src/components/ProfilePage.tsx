import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Target, 
  Brain, 
  Clock, 
  Settings, 
  Edit3, 
  Save, 
  X,
  Shield,
  Bell,
  Share2,
  Activity,
  Moon,
  Zap,
  Heart,
  Award,
  TrendingUp
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  onNavigate: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onProfileUpdate, onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserProfile>(userProfile);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSave = () => {
    onProfileUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userProfile);
    setIsEditing(false);
  };

  const getHealthScore = () => {
    let score = 0;
    if (userProfile.sleepHours && userProfile.sleepHours >= 7) score += 25;
    if (userProfile.exerciseFrequency === 'intense') score += 30;
    else if (userProfile.exerciseFrequency === 'moderate') score += 20;
    else if (userProfile.exerciseFrequency === 'light') score += 10;
    if (userProfile.stressLevel === 'low') score += 25;
    else if (userProfile.stressLevel === 'medium') score += 15;
    else if (userProfile.stressLevel === 'high') score += 5;
    if (userProfile.medicalConditions?.includes('None of the above')) score += 20;
    return Math.min(score, 100);
  };

  const getMotivationLevel = () => {
    const goals = userProfile.memoryGoals?.length || 0;
    const timeCommitment = userProfile.availableTimePerDay || 0;
    return Math.min(((goals * 10) + (timeCommitment / 2)), 100);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'health', label: 'Health & Lifestyle', icon: Heart },
    { id: 'goals', label: 'Goals & Preferences', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userProfile.name}</h1>
              <p className="text-xl opacity-90">{userProfile.occupation}</p>
              <p className="text-sm opacity-75">{userProfile.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold text-red-600">{getHealthScore()}%</span>
          </div>
          <h3 className="font-semibold text-gray-900">Health Score</h3>
          <p className="text-sm text-gray-600">Based on lifestyle factors</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">{getMotivationLevel()}%</span>
          </div>
          <h3 className="font-semibold text-gray-900">Motivation</h3>
          <p className="text-sm text-gray-600">Goal commitment level</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-600">{userProfile.availableTimePerDay}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Daily Time</h3>
          <p className="text-sm text-gray-600">Minutes per day</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-600 capitalize">{userProfile.learningStyle}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Learning Style</h3>
          <p className="text-sm text-gray-600">Preferred method</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-semibold">{userProfile.age} years old</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Occupation</p>
                <p className="font-semibold">{userProfile.occupation}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Education</p>
                <p className="font-semibold capitalize">{userProfile.education?.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Memory Goals</h3>
          <div className="space-y-2">
            {userProfile.memoryGoals?.slice(0, 4).map((goal, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-sm text-gray-700">{goal}</span>
              </div>
            ))}
            {(userProfile.memoryGoals?.length || 0) > 4 && (
              <p className="text-sm text-gray-500 italic">
                +{(userProfile.memoryGoals?.length || 0) - 4} more goals
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Health & Lifestyle Overview</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <Moon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{userProfile.sleepHours}h</p>
            <p className="text-sm text-gray-600">Sleep per night</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-green-600 capitalize">{userProfile.exerciseFrequency}</p>
            <p className="text-sm text-gray-600">Exercise frequency</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-orange-600 capitalize">{userProfile.stressLevel}</p>
            <p className="text-sm text-gray-600">Stress level</p>
          </div>
        </div>
      </div>

      {userProfile.medicalConditions && userProfile.medicalConditions.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Medical Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Conditions:</p>
              <div className="flex flex-wrap gap-2">
                {userProfile.medicalConditions.map((condition, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
            {userProfile.currentMedications && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Current Medications:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {userProfile.currentMedications}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Health Recommendations</h3>
        <div className="space-y-3">
          {userProfile.sleepHours && userProfile.sleepHours < 7 && (
            <div className="flex items-start space-x-3">
              <Moon className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-gray-700">Consider increasing sleep to 7-9 hours for optimal memory consolidation.</p>
            </div>
          )}
          {userProfile.exerciseFrequency === 'none' && (
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-sm text-gray-700">Regular exercise can significantly improve cognitive function and memory.</p>
            </div>
          )}
          {userProfile.stressLevel === 'high' && (
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-orange-600 mt-0.5" />
              <p className="text-sm text-gray-700">High stress can impair memory. Consider stress management techniques.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderGoalsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Memory Goals</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {userProfile.memoryGoals?.map((goal, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-gray-700">{goal}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Preferences</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Learning Style</p>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="capitalize font-semibold text-purple-600">{userProfile.learningStyle}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Preferred Difficulty</p>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="capitalize font-semibold text-orange-600">{userProfile.preferredDifficulty}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Daily Time Commitment</p>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-600">{userProfile.availableTimePerDay} minutes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Motivation Level</span>
              <span className="font-bold text-green-600">{getMotivationLevel()}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Health Score</span>
              <span className="font-bold text-blue-600">{getHealthScore()}%</span>
            </div>
            <button
              onClick={() => onNavigate('progress')}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View Detailed Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive reminders and progress updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={userProfile.notifications}
                onChange={(e) => onProfileUpdate({...userProfile, notifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Share2 className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Anonymous Data Sharing</h4>
                <p className="text-sm text-gray-600">Help improve the platform</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={userProfile.dataSharing}
                onChange={(e) => onProfileUpdate({...userProfile, dataSharing: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-900">Account Secured</h4>
              <p className="text-sm text-green-700">Your account meets all security requirements</p>
            </div>
          </div>
          
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors">
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <h3 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h3>
        <p className="text-sm text-red-700 mb-4">
          These actions are permanent and cannot be undone.
        </p>
        <div className="space-y-3">
          <button className="w-full bg-red-100 text-red-700 py-3 rounded-xl hover:bg-red-200 transition-colors">
            Clear All Progress Data
          </button>
          <button className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        {userProfile.createdAt && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Member since</p>
            <p className="font-semibold">{new Date(userProfile.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'health' && renderHealthTab()}
          {activeTab === 'goals' && renderGoalsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editData.firstName || ''}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editData.lastName || ''}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <input
                  type="text"
                  value={editData.occupation}
                  onChange={(e) => setEditData({...editData, occupation: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Per Day: {editData.availableTimePerDay} minutes
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={editData.availableTimePerDay}
                  onChange={(e) => setEditData({...editData, availableTimePerDay: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;