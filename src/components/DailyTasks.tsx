import React, { useState } from 'react';
import { CheckCircle, Clock, Target, Calendar, Trophy, Flame } from 'lucide-react';
import { DailyTask } from '../types';

interface DailyTasksProps {
  tasks: DailyTask[];
  onTasksUpdate: (tasks: DailyTask[]) => void;
}

const DailyTasks: React.FC<DailyTasksProps> = ({ tasks, onTasksUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  const todaysTasks = tasks.filter(task => 
    new Date(task.date).toDateString() === selectedDate
  );

  const completedToday = todaysTasks.filter(task => task.completed).length;
  const totalToday = todaysTasks.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const handleTaskComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const isCompleting = !task.completed;
        return {
          ...task,
          completed: isCompleting,
          streak: isCompleting ? task.streak + 1 : Math.max(0, task.streak - 1)
        };
      }
      return task;
    });
    onTasksUpdate(updatedTasks);
  };

  const getStreakStats = () => {
    const streaks = tasks.map(task => task.streak);
    const maxStreak = Math.max(...streaks, 0);
    const currentStreak = tasks.filter(task => 
      task.completed && 
      new Date(task.date).toDateString() === new Date().toDateString()
    ).length;
    
    return { maxStreak, currentStreak };
  };

  const { maxStreak, currentStreak } = getStreakStats();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technique': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'exercise': return 'bg-green-100 text-green-800 border-green-200';
      case 'lifestyle': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'diet': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Generate date options for the past 7 days and next 7 days
  const dateOptions = [];
  for (let i = -7; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateOptions.push(date);
  }

  if (tasks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Tasks Yet</h2>
          <p className="text-gray-600 mb-6">
            Complete your memory assessment and create a personalized plan to see your daily tasks here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Today's Progress</p>
              <p className="text-3xl font-bold">{completionRate}%</p>
            </div>
            <Target className="w-8 h-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed Today</p>
              <p className="text-2xl font-bold text-green-600">{completedToday}/{totalToday}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{currentStreak}</p>
            </div>
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Best Streak</p>
              <p className="text-2xl font-bold text-purple-600">{maxStreak}</p>
            </div>
            <Trophy className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Date</h2>
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {dateOptions.map(date => {
            const dateStr = date.toDateString();
            const isToday = dateStr === new Date().toDateString();
            const isSelected = dateStr === selectedDate;
            const tasksForDate = tasks.filter(task => 
              new Date(task.date).toDateString() === dateStr
            );
            const completedForDate = tasksForDate.filter(task => task.completed).length;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`min-w-[120px] p-3 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  {tasksForDate.length > 0 && (
                    <div className="mt-1">
                      <div className={`w-2 h-2 rounded-full mx-auto ${
                        completedForDate === tasksForDate.length 
                          ? 'bg-green-500' 
                          : completedForDate > 0 
                            ? 'bg-yellow-500' 
                            : 'bg-gray-300'
                      }`}></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks for Selected Date */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Tasks for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          {todaysTasks.length > 0 && (
            <div className="text-sm text-gray-600">
              {completedToday} of {totalToday} completed
            </div>
          )}
        </div>

        {todaysTasks.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks for this date</h3>
            <p className="text-gray-600">
              {selectedDate === new Date().toDateString() 
                ? "You don't have any tasks scheduled for today." 
                : "No tasks were scheduled for this date."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysTasks.map(task => (
              <div
                key={task.id}
                className={`border-2 rounded-xl p-6 transition-all ${
                  task.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.completed 
                            ? 'border-green-500 bg-green-500' 
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <h3 className={`text-lg font-semibold ${
                        task.completed ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                    </div>
                    
                    <p className={`text-gray-600 mb-3 ${task.completed ? 'line-through' : ''}`}>
                      {task.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{task.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span className={`capitalize font-medium ${getDifficultyColor(task.difficulty)}`}>
                          {task.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Flame className="w-4 h-4" />
                        <span>Streak: {task.streak}</span>
                      </div>
                    </div>
                  </div>
                  
                  {task.completed && (
                    <div className="ml-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Motivational Section */}
      {completionRate === 100 && totalToday > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center mt-8">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
          <p className="text-lg">
            You've completed all your tasks for today. Your brain is getting stronger!
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyTasks;