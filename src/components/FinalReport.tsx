import React from 'react';
import { FileText, Brain, Target, TrendingUp, Award, Calendar, Download } from 'lucide-react';
import { TestResult, UserProfile, DailyTask } from '../types';

interface FinalReportProps {
  testResults: TestResult[];
  userProfile: UserProfile | null;
  dailyTasks: DailyTask[];
  planDuration: number;
}

const FinalReport: React.FC<FinalReportProps> = ({
  testResults,
  userProfile,
  dailyTasks,
  planDuration
}) => {
  if (!testResults.length || !userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Journey First</h2>
          <p className="text-gray-600">
            Take memory assessments and complete tasks to generate your final report.
          </p>
        </div>
      </div>
    );
  }

  const sortedResults = [...testResults].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const firstResult = sortedResults[0];
  const latestResult = sortedResults[sortedResults.length - 1];

  const overallImprovement = latestResult.overallScore - firstResult.overallScore;
  
  const completedTasks = dailyTasks.filter(task => task.completed).length;
  const totalTasks = dailyTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getStrengths = () => {
    const strengths = [];
    
    // Memory strengths
    if (latestResult.workingMemoryScore >= 75) strengths.push('Excellent working memory capacity');
    if (latestResult.shortTermMemoryScore >= 75) strengths.push('Strong short-term memory retention');
    if (latestResult.longTermMemoryScore >= 75) strengths.push('Robust long-term memory storage');
    if (latestResult.visualMemoryScore >= 75) strengths.push('Superior visual memory processing');
    if (latestResult.processingSpeedScore >= 75) strengths.push('Fast cognitive processing speed');
    if (latestResult.attentionScore >= 75) strengths.push('Excellent attention and focus');

    // Behavioral strengths
    if (completionRate >= 80) strengths.push('Outstanding task completion consistency');
    if (completionRate >= 60) strengths.push('Good adherence to training schedule');
    
    // Improvement strengths
    if (overallImprovement >= 15) strengths.push('Significant overall memory improvement');
    if (overallImprovement >= 5) strengths.push('Positive memory enhancement progress');

    return strengths.length > 0 ? strengths : ['Commitment to memory improvement journey'];
  };

  const getWeaknesses = () => {
    const weaknesses = [];
    
    // Memory weaknesses
    if (latestResult.workingMemoryScore < 60) weaknesses.push('Working memory needs continued focus');
    if (latestResult.shortTermMemoryScore < 60) weaknesses.push('Short-term memory requires improvement');
    if (latestResult.longTermMemoryScore < 60) weaknesses.push('Long-term memory consolidation needs work');
    if (latestResult.visualMemoryScore < 60) weaknesses.push('Visual memory processing can be enhanced');
    if (latestResult.processingSpeedScore < 60) weaknesses.push('Processing speed could be faster');
    if (latestResult.attentionScore < 60) weaknesses.push('Attention and focus need strengthening');

    // Behavioral weaknesses
    if (completionRate < 50) weaknesses.push('Task completion consistency needs improvement');
    if (completionRate < 30) weaknesses.push('Regular practice schedule not maintained');
    
    // Progress weaknesses
    if (overallImprovement < 0) weaknesses.push('Overall scores have declined - review approach');
    if (testResults.length < 3) weaknesses.push('More frequent assessments needed for better tracking');

    return weaknesses.length > 0 ? weaknesses : ['Continue consistent practice for optimal results'];
  };

  const getRecommendations = () => {
    const recommendations = [];
    const strengths = getStrengths();
    const weaknesses = getWeaknesses();

    // Based on weaknesses
    if (latestResult.workingMemoryScore < 70) {
      recommendations.push('Focus on dual n-back training and working memory exercises');
    }
    if (latestResult.attentionScore < 70) {
      recommendations.push('Incorporate meditation and focused attention practices');
    }
    if (completionRate < 60) {
      recommendations.push('Set smaller, achievable daily goals to build consistency');
    }

    // Based on learning style
    if (userProfile.learningStyle === 'visual') {
      recommendations.push('Continue emphasizing visual memory techniques like mind mapping');
    } else if (userProfile.learningStyle === 'auditory') {
      recommendations.push('Expand use of verbal rehearsal and rhythmic memory strategies');
    }

    // Based on goals
    if (userProfile.memoryGoals.includes('Academic performance')) {
      recommendations.push('Apply memory techniques directly to study materials');
    }
    if (userProfile.memoryGoals.includes('Work efficiency')) {
      recommendations.push('Practice memory strategies with work-related information');
    }

    // General recommendations
    recommendations.push('Maintain regular sleep schedule for optimal memory consolidation');
    recommendations.push('Continue physical exercise to support cognitive health');
    recommendations.push('Practice spaced repetition for long-term retention');

    return recommendations;
  };

  const getNextSteps = () => {
    const nextSteps = [];
    
    if (overallImprovement >= 10) {
      nextSteps.push(`Continue with advanced ${planDuration + 90}-day program`);
    } else {
      nextSteps.push(`Repeat current ${planDuration}-day program with adjustments`);
    }
    
    nextSteps.push('Take monthly assessments to track continued progress');
    nextSteps.push('Join memory training community for additional support');
    nextSteps.push('Consider working with a cognitive training specialist');
    
    return nextSteps;
  };

  const categoryScores = [
    { label: 'Working Memory', score: latestResult.workingMemoryScore, improvement: latestResult.workingMemoryScore - firstResult.workingMemoryScore },
    { label: 'Short-term Memory', score: latestResult.shortTermMemoryScore, improvement: latestResult.shortTermMemoryScore - firstResult.shortTermMemoryScore },
    { label: 'Long-term Memory', score: latestResult.longTermMemoryScore, improvement: latestResult.longTermMemoryScore - firstResult.longTermMemoryScore },
    { label: 'Visual Memory', score: latestResult.visualMemoryScore, improvement: latestResult.visualMemoryScore - firstResult.visualMemoryScore },
    { label: 'Processing Speed', score: latestResult.processingSpeedScore, improvement: latestResult.processingSpeedScore - firstResult.processingSpeedScore },
    { label: 'Attention & Focus', score: latestResult.attentionScore, improvement: latestResult.attentionScore - firstResult.attentionScore }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Final Memory Enhancement Report</h1>
            <p className="text-xl opacity-90">{userProfile.name} • {planDuration}-Day Program</p>
            <p className="text-sm opacity-75 mt-2">
              Generated on {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <FileText className="w-16 h-16 opacity-75 mb-2" />
            <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Summary</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-1">{latestResult.overallScore}%</div>
            <div className="text-sm text-gray-600">Final Overall Score</div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
            <div className={`text-3xl font-bold mb-1 ${overallImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overallImprovement >= 0 ? '+' : ''}{overallImprovement.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Total Improvement</div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{completionRate.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Task Completion</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-gray-700 leading-relaxed">
            Over the course of your {planDuration}-day memory enhancement program, you have shown{' '}
            {overallImprovement >= 10 ? 'excellent' : overallImprovement >= 5 ? 'good' : 'modest'} progress
            in cognitive performance. Your overall memory score {overallImprovement >= 0 ? 'improved' : 'changed'} by{' '}
            {Math.abs(overallImprovement).toFixed(1)} percentage points, and you completed {completionRate.toFixed(0)}%
            of your assigned training tasks. This report provides detailed insights into your strengths,
            areas for improvement, and recommendations for continued cognitive enhancement.
          </p>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Memory Assessment</h2>
        
        <div className="space-y-6">
          {categoryScores.map((category, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{category.label}</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-900">{category.score}%</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    category.improvement >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.improvement >= 0 ? '+' : ''}{category.improvement.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(category.score, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                Performance Level: {
                  category.score >= 80 ? 'Excellent' :
                  category.score >= 60 ? 'Good' :
                  category.score >= 40 ? 'Average' : 'Needs Improvement'
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-green-900">Strengths</h2>
          </div>
          
          <ul className="space-y-3">
            {getStrengths().map((strength, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-green-800">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-8 h-8 text-orange-600" />
            <h2 className="text-2xl font-bold text-orange-900">Areas for Improvement</h2>
          </div>
          
          <ul className="space-y-3">
            {getWeaknesses().map((weakness, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-orange-800">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personalized Recommendations</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">Training Focus</h3>
            <ul className="space-y-3">
              {getRecommendations().slice(0, 4).map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Lifestyle Optimization</h3>
            <ul className="space-y-3">
              {getRecommendations().slice(4).map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Next Steps</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">Immediate Actions</h3>
            <ul className="space-y-3">
              {getNextSteps().slice(0, 2).map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Long-term Planning</h3>
            <ul className="space-y-3">
              {getNextSteps().slice(2).map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 3}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Report Footer */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Congratulations on Completing Your Program!</h3>
        <p className="text-gray-600 mb-6">
          You've taken important steps toward enhancing your cognitive abilities. 
          Continue practicing these techniques and maintain the habits you've developed 
          for lasting memory improvement.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
            Start New Program
          </button>
          <button className="bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all">
            Share Achievement
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalReport;