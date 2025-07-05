import React, { useState, useEffect } from 'react';
import { Target, Clock, Calendar, CheckCircle, Star, Zap, Download } from 'lucide-react';
import { UserProfile, TestResult, DailyTask } from '../types';

interface PersonalizedPlanProps {
  userProfile: UserProfile | null;
  testResult: TestResult | null;
  duration: number;
  onTasksGenerate: (tasks: DailyTask[]) => void;
}

const PersonalizedPlan: React.FC<PersonalizedPlanProps> = ({
  userProfile,
  testResult,
  duration,
  onTasksGenerate
}) => {
  const [generatedTasks, setGeneratedTasks] = useState<DailyTask[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    if (userProfile && testResult) {
      generatePersonalizedTasks();
    }
  }, [userProfile, testResult, duration]);

  const generatePersonalizedTasks = () => {
    if (!userProfile || !testResult) return;

    const tasks: DailyTask[] = [];
    const totalDays = duration;
    const weeksCount = Math.ceil(totalDays / 7);

    // Base techniques based on learning style
    const baseTechniques = {
      visual: [
        'Visual memory palace practice',
        'Mind mapping exercises',
        'Image association training',
        'Color-coding memory practice'
      ],
      auditory: [
        'Verbal repetition exercises',
        'Rhyme and rhythm memory',
        'Story-telling memory practice',
        'Audio pattern recognition'
      ],
      kinesthetic: [
        'Physical movement memory',
        'Tactile memory exercises',
        'Body-based mnemonics',
        'Action-sequence memory'
      ],
      mixed: [
        'Multi-sensory memory training',
        'Combination technique practice',
        'Adaptive memory exercises',
        'Cross-modal memory tasks'
      ]
    };

    // Focus areas based on test results
    const focusAreas = [];
    if (testResult.workingMemoryScore < 70) focusAreas.push('working memory');
    if (testResult.shortTermMemoryScore < 70) focusAreas.push('short-term memory');
    if (testResult.visualMemoryScore < 70) focusAreas.push('visual memory');
    if (testResult.processingSpeedScore < 70) focusAreas.push('processing speed');
    if (testResult.attentionScore < 70) focusAreas.push('attention');

    // Ensure we have a valid learning style, fallback to 'mixed' if invalid
    const validLearningStyle = userProfile.learningStyle && baseTechniques[userProfile.learningStyle as keyof typeof baseTechniques] 
      ? userProfile.learningStyle as keyof typeof baseTechniques
      : 'mixed';

    // Generate tasks for each week
    for (let week = 1; week <= weeksCount; week++) {
      const weekTasks = generateWeeklyTasks(week, focusAreas, baseTechniques[validLearningStyle], userProfile);
      tasks.push(...weekTasks);
    }

    setGeneratedTasks(tasks);
    onTasksGenerate(tasks);
  };

  const generateWeeklyTasks = (
    week: number, 
    focusAreas: string[], 
    techniques: string[], 
    profile: UserProfile
  ): DailyTask[] => {
    const tasks: DailyTask[] = [];
    const dailyTimeSlots = Math.floor(profile.availableTimePerDay / 3);

    for (let day = 1; day <= 7; day++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + (week - 1) * 7 + day - 1);

      // Main technique practice
      tasks.push({
        id: `${week}-${day}-technique`,
        title: techniques[Math.floor(Math.random() * techniques.length)],
        description: `Practice this technique for ${dailyTimeSlots} minutes focusing on ${focusAreas[0] || 'general improvement'}`,
        category: 'technique',
        duration: dailyTimeSlots,
        difficulty: profile.preferredDifficulty,
        completed: false,
        date: currentDate,
        streak: 0,
        targetArea: focusAreas[0] || 'general'
      });

      // Memory exercise
      tasks.push({
        id: `${week}-${day}-exercise`,
        title: getExerciseForWeek(week, focusAreas),
        description: getExerciseDescription(week, focusAreas),
        category: 'exercise',
        duration: dailyTimeSlots,
        difficulty: profile.preferredDifficulty,
        completed: false,
        date: currentDate,
        streak: 0,
        targetArea: focusAreas[1] || focusAreas[0] || 'general'
      });

      // Lifestyle/diet task
      if (Math.random() > 0.5) {
        tasks.push({
          id: `${week}-${day}-lifestyle`,
          title: getLifestyleTask(week),
          description: getLifestyleDescription(week),
          category: week % 2 === 0 ? 'diet' : 'lifestyle',
          duration: Math.floor(dailyTimeSlots / 2),
          difficulty: 'easy',
          completed: false,
          date: currentDate,
          streak: 0,
          targetArea: 'general wellness'
        });
      }
    }

    return tasks;
  };

  const getExerciseForWeek = (week: number, focusAreas: string[]): string => {
    const exercises = [
      'Number sequence recall',
      'Word list memorization',
      'Pattern recognition',
      'Dual n-back training',
      'Attention switching exercise',
      'Visual-spatial memory',
      'Working memory updating',
      'Interference resistance training'
    ];
    return exercises[Math.floor(Math.random() * exercises.length)];
  };

  const getExerciseDescription = (week: number, focusAreas: string[]): string => {
    const descriptions = [
      'Practice recalling increasingly longer sequences of numbers',
      'Memorize and recall lists of words with various strategies',
      'Identify and remember complex visual patterns',
      'Train working memory with dual-task exercises',
      'Practice switching attention between different tasks',
      'Strengthen visual-spatial memory with location tasks',
      'Update and maintain information in working memory',
      'Build resistance to memory interference'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const getLifestyleTask = (week: number): string => {
    const tasks = [
      'Brain-healthy breakfast',
      'Meditation practice',
      'Physical exercise',
      'Quality sleep routine',
      'Stress management',
      'Hydration tracking',
      'Omega-3 rich meal',
      'Digital detox hour'
    ];
    return tasks[Math.floor(Math.random() * tasks.length)];
  };

  const getLifestyleDescription = (week: number): string => {
    const descriptions = [
      'Start your day with brain-boosting foods like blueberries and nuts',
      'Practice mindfulness meditation to improve focus and reduce stress',
      'Engage in 30 minutes of physical activity to boost brain health',
      'Maintain consistent sleep schedule for memory consolidation',
      'Practice stress-reduction techniques like deep breathing',
      'Track water intake to maintain optimal brain hydration',
      'Include omega-3 rich foods like fish or walnuts in your meal',
      'Take a break from digital devices to reduce cognitive overload'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const getWeeklyTasks = (week: number) => {
    return generatedTasks.filter(task => {
      const taskWeek = Math.ceil((new Date(task.date).getTime() - new Date().getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
      return Math.abs(taskWeek - week) < 1;
    });
  };

  const getPlanSummary = () => {
    if (!testResult || !userProfile) return null;

    const weakestAreas = [];
    if (testResult.workingMemoryScore < 70) weakestAreas.push('Working Memory');
    if (testResult.shortTermMemoryScore < 70) weakestAreas.push('Short-term Memory');
    if (testResult.visualMemoryScore < 70) weakestAreas.push('Visual Memory');
    if (testResult.processingSpeedScore < 70) weakestAreas.push('Processing Speed');

    return {
      focusAreas: weakestAreas,
      dailyTime: userProfile.availableTimePerDay,
      learningStyle: userProfile.learningStyle,
      goals: userProfile.memoryGoals
    };
  };

  const downloadPlan = () => {
    const planData = {
      userProfile,
      testResult,
      duration,
      tasks: generatedTasks,
      summary: getPlanSummary(),
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(planData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-training-plan-${duration}days-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPlanPDF = () => {
    // Create a simple HTML version for printing/PDF
    const summary = getPlanSummary();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Memory Training Plan - ${duration} Days</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .task { margin: 10px 0; padding: 10px; border-left: 3px solid #4F46E5; }
          .week { page-break-before: always; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Personalized Memory Training Plan</h1>
          <h2>${userProfile?.name} - ${duration} Day Program</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h3>Plan Summary</h3>
          <p><strong>Focus Areas:</strong> ${summary?.focusAreas.join(', ') || 'General improvement'}</p>
          <p><strong>Daily Time:</strong> ${summary?.dailyTime} minutes</p>
          <p><strong>Learning Style:</strong> ${summary?.learningStyle}</p>
        </div>
        
        ${Array.from({length: Math.ceil(duration / 7)}, (_, weekIndex) => {
          const weekTasks = getWeeklyTasks(weekIndex + 1);
          return `
            <div class="week">
              <h3>Week ${weekIndex + 1}</h3>
              ${weekTasks.slice(0, 21).map(task => `
                <div class="task">
                  <strong>${task.title}</strong><br>
                  ${task.description}<br>
                  <small>Duration: ${task.duration} min | Category: ${task.category}</small>
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-training-plan-${duration}days.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const summary = getPlanSummary();

  if (!userProfile || !testResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Profile First</h2>
          <p className="text-gray-600 mb-6">
            To generate a personalized plan, please complete a memory test and create your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Personalized {duration}-Day Plan</h1>
            <p className="text-xl opacity-90">Tailored for {userProfile.name}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{duration}</div>
            <div className="text-sm opacity-75">Days</div>
          </div>
        </div>
      </div>

      {/* Plan Summary */}
      {summary && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <Target className="w-6 h-6 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Focus Areas</h3>
            </div>
            <div className="space-y-1">
              {summary.focusAreas.slice(0, 2).map((area, index) => (
                <div key={index} className="text-sm text-gray-600">{area}</div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Daily Time</h3>
            </div>
            <div className="text-2xl font-bold text-green-600">{summary.dailyTime}min</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Learning Style</h3>
            </div>
            <div className="text-sm text-gray-600 capitalize">{summary.learningStyle}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="w-6 h-6 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Difficulty</h3>
            </div>
            <div className="text-sm text-gray-600 capitalize">{userProfile.preferredDifficulty}</div>
          </div>
        </div>
      )}

      {/* Week Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Plan Overview</h2>
          <div className="flex space-x-2">
            <button
              onClick={downloadPlan}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON</span>
            </button>
            <button
              onClick={downloadPlanPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download HTML</span>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: Math.ceil(duration / 7) }, (_, i) => i + 1).map(week => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedWeek === week
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Tasks */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Week {selectedWeek} Tasks</h3>
        
        <div className="space-y-4">
          {getWeeklyTasks(selectedWeek).slice(0, 21).map((task, index) => {
            const dayOfWeek = Math.floor(index / 3) + 1;
            const isNewDay = index % 3 === 0;
            
            return (
              <div key={task.id}>
                {isNewDay && (
                  <div className="flex items-center space-x-3 mb-3 mt-6">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-semibold text-gray-900">
                      Day {dayOfWeek} - {new Date(task.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </h4>
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-xl p-4 ml-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          task.category === 'technique' ? 'bg-indigo-500' :
                          task.category === 'exercise' ? 'bg-green-500' :
                          task.category === 'lifestyle' ? 'bg-orange-500' : 'bg-purple-500'
                        }`}></div>
                        <h5 className="font-semibold text-gray-900">{task.title}</h5>
                        <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600 capitalize">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span className="capitalize">{task.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {getWeeklyTasks(selectedWeek).length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No tasks for this week yet</h4>
            <p className="text-gray-600">Tasks will be generated based on your progress.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex-1"
        >
          Regenerate Plan
        </button>
      </div>
    </div>
  );
};

export default PersonalizedPlan;