import React, { useState, useEffect } from 'react';
import { Brain, Home, BookOpen, Target, TrendingUp, FileText, Settings, LogOut, User, Gamepad2, BarChart3, Lightbulb, Calendar, BookOpenCheck } from 'lucide-react';
import HomePage from './components/HomePage';
import MemoryTest from './components/MemoryTest';
import TestResults from './components/TestResults';
import PersonalizedPlan from './components/PersonalizedPlan';
import DailyTasks from './components/DailyTasks';
import ProgressTracker from './components/ProgressTracker';
import FinalReport from './components/FinalReport';
import MemoryGuide from './components/MemoryGuide';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import FeedbackLoop from './components/FeedbackLoop';
import CognitiveProfileQuiz from './components/CognitiveProfileQuiz';
import MemoryArena from './components/MemoryArena';
import CognitiveAnalyticsDashboard from './components/CognitiveAnalyticsDashboard';
import DailyBrainTip from './components/DailyBrainTip';
import ChallengeTracker from './components/ChallengeTracker';
import MemoryJournal from './components/MemoryJournal';
import { TestResult, UserProfile, DailyTask } from './types';
import { memoryAPI } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [selectedPlanDuration, setSelectedPlanDuration] = useState<number>(90);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cognitiveProfile, setCognitiveProfile] = useState<any>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile.isAuthenticated) {
            setUserProfile(profile);
            setIsAuthenticated(true);
            loadUserData();
          }
        } catch (error) {
          console.error('Error parsing user profile:', error);
          localStorage.clear();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loadUserData = () => {
    const savedResults = localStorage.getItem('memoryTestResults');
    const savedTasks = localStorage.getItem('dailyTasks');
    const savedCognitiveProfile = localStorage.getItem('cognitiveProfile');
    
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        const resultsWithDates = parsedResults.map((result: any) => ({
          ...result,
          date: new Date(result.date)
        }));
        setTestResults(resultsWithDates);
      } catch (error) {
        console.error('Error parsing test results:', error);
      }
    }
    
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          date: new Date(task.date),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }));
        setDailyTasks(tasksWithDates);
      } catch (error) {
        console.error('Error parsing daily tasks:', error);
      }
    }

    if (savedCognitiveProfile) {
      try {
        setCognitiveProfile(JSON.parse(savedCognitiveProfile));
      } catch (error) {
        console.error('Error parsing cognitive profile:', error);
      }
    }
  };

  const handleLogin = (userData: any) => {
    setUserProfile(userData);
    setIsAuthenticated(true);
    if (userData.isAuthenticated) {
      loadUserData();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserProfile(null);
    setIsAuthenticated(false);
    setTestResults([]);
    setDailyTasks([]);
    setCognitiveProfile(null);
    setCurrentPage('home');
  };

  const handleTestComplete = (result: TestResult) => {
    const updatedResults = [...testResults, result];
    setTestResults(updatedResults);
    localStorage.setItem('memoryTestResults', JSON.stringify(updatedResults));
    setCurrentPage('results');
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    const updatedProfile = { ...profile, isAuthenticated: true };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const handleTasksUpdate = (tasks: DailyTask[]) => {
    setDailyTasks(tasks);
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
  };

  const handleCognitiveProfileComplete = (profile: any) => {
    setCognitiveProfile(profile);
    localStorage.setItem('cognitiveProfile', JSON.stringify(profile));
    setCurrentPage('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'test', label: 'Memory Test', icon: Brain },
    { id: 'guide', label: 'Memory Guide', icon: BookOpen },
    { id: 'arena', label: 'Memory Arena', icon: Gamepad2 },
    { id: 'journal', label: 'Memory Journal', icon: BookOpenCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'plan', label: 'My Plan', icon: Target },
    { id: 'tasks', label: 'Daily Tasks', icon: Settings },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'feedback', label: 'Feedback', icon: FileText },
    { id: 'challenge', label: '30-Day Challenge', icon: Calendar },
    { id: 'daily-tip', label: 'Daily Tip', icon: Lightbulb },
    { id: 'report', label: 'Final Report', icon: FileText },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} userProfile={userProfile} testResults={testResults} />;
      case 'test':
        return <MemoryTest onTestComplete={handleTestComplete} />;
      case 'guide':
        return <MemoryGuide />;
      case 'arena':
        return <MemoryArena userId={userProfile?.email || userProfile?.name || 'user'} />;
      case 'journal':
        return <MemoryJournal userId={userProfile?.email || userProfile?.name || 'user'} />;
      case 'analytics':
        return <CognitiveAnalyticsDashboard userId={userProfile?.email || userProfile?.name || 'user'} testResults={testResults} dailyTasks={dailyTasks} />;
      case 'cognitive-quiz':
        return <CognitiveProfileQuiz onComplete={handleCognitiveProfileComplete} />;
      case 'challenge':
        return <ChallengeTracker userId={userProfile?.email || userProfile?.name || 'user'} />;
      case 'daily-tip':
        return <DailyBrainTip userId={userProfile?.email || userProfile?.name || 'user'} />;
      case 'results':
        return (
          <TestResults
            result={testResults[testResults.length - 1]}
            onNavigate={setCurrentPage}
            onProfileUpdate={handleProfileUpdate}
            onPlanDurationSelect={setSelectedPlanDuration}
          />
        );
      case 'plan':
        return (
          <PersonalizedPlan
            userProfile={userProfile}
            testResult={testResults[testResults.length - 1]}
            duration={selectedPlanDuration}
            onTasksGenerate={handleTasksUpdate}
          />
        );
      case 'tasks':
        return <DailyTasks tasks={dailyTasks} onTasksUpdate={handleTasksUpdate} />;
      case 'progress':
        return <ProgressTracker testResults={testResults} dailyTasks={dailyTasks} />;
      case 'feedback':
        return <FeedbackLoop userId={userProfile?.email || userProfile?.name || 'user'} />;
      case 'report':
        return (
          <FinalReport
            testResults={testResults}
            userProfile={userProfile}
            dailyTasks={dailyTasks}
            planDuration={selectedPlanDuration}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            userProfile={userProfile!}
            onProfileUpdate={handleProfileUpdate}
            onNavigate={setCurrentPage}
          />
        );
      default:
        return <HomePage onNavigate={setCurrentPage} userProfile={userProfile} testResults={testResults} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100">
      {/* Cognitive Profile Prompt */}
      {!cognitiveProfile && isAuthenticated && (
        <div className="bg-indigo-50 border-b border-indigo-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-indigo-600" />
              <p className="text-slate-800 text-sm">
                🧠 Discover your cognitive learning style for personalized training!
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('cognitive-quiz')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              Take Quiz
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                  Memory Enhancer Pro
                </h1>
                <p className="text-xs text-slate-500">AI-Powered Cognitive Training</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-1 overflow-x-auto">
              {navigationItems.slice(0, 8).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-xs ${
                      currentPage === item.id
                        ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* More Menu */}
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-xs text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                  <span>More</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {navigationItems.slice(8).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm text-slate-700"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* User Profile & Logout */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <button
                  onClick={() => setCurrentPage('profile')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === 'profile'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{userProfile?.name}</p>
                    <p className="text-xs text-slate-500">{userProfile?.email}</p>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`p-3 rounded-lg transition-all duration-200 flex flex-col items-center space-y-1 ${
                  currentPage === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;