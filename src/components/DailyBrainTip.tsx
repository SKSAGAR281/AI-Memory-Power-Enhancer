import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Calendar, Brain, Apple, Moon, Activity } from 'lucide-react';

interface DailyBrainTipProps {
  userId: string;
}

const DailyBrainTip: React.FC<DailyBrainTipProps> = ({ userId }) => {
  const [currentTip, setCurrentTip] = useState<any>(null);
  const [tipHistory, setTipHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodaysTip();
    loadTipHistory();
  }, [userId]);

  const loadTodaysTip = () => {
    const today = new Date().toDateString();
    const savedTip = localStorage.getItem(`daily_tip_${userId}_${today}`);
    
    if (savedTip) {
      setCurrentTip(JSON.parse(savedTip));
    } else {
      generateNewTip();
    }
  };

  const loadTipHistory = () => {
    const saved = localStorage.getItem(`tip_history_${userId}`);
    if (saved) {
      const history = JSON.parse(saved).map((tip: any) => ({
        ...tip,
        date: new Date(tip.date)
      }));
      setTipHistory(history);
    }
  };

  const generateNewTip = () => {
    setLoading(true);
    
    // Simulate AI generation - in a real app, you'd call GPT API
    setTimeout(() => {
      const tipCategories = {
        nutrition: {
          icon: Apple,
          color: 'from-green-500 to-emerald-600',
          tips: [
            {
              title: "Omega-3 Power",
              content: "Eat fatty fish like salmon twice a week. Omega-3 fatty acids support brain cell structure and improve memory formation.",
              action: "Try adding walnuts to your breakfast for a plant-based omega-3 boost!"
            },
            {
              title: "Blueberry Brain Boost",
              content: "Blueberries contain anthocyanins that cross the blood-brain barrier and improve communication between brain cells.",
              action: "Add a handful of blueberries to your morning smoothie or yogurt."
            },
            {
              title: "Dark Chocolate Benefits",
              content: "70%+ dark chocolate contains flavonoids that increase blood flow to the brain and enhance cognitive function.",
              action: "Enjoy a small square of dark chocolate as an afternoon brain snack."
            }
          ]
        },
        sleep: {
          icon: Moon,
          color: 'from-indigo-500 to-purple-600',
          tips: [
            {
              title: "Memory Consolidation Window",
              content: "Your brain consolidates memories during deep sleep phases. Aim for 7-9 hours to optimize this process.",
              action: "Set a consistent bedtime tonight and stick to it for a week."
            },
            {
              title: "Pre-Sleep Learning",
              content: "Reviewing material 30 minutes before bed can improve retention by up to 40% due to sleep-dependent memory consolidation.",
              action: "Review your most important study notes right before sleep tonight."
            },
            {
              title: "REM Sleep and Creativity",
              content: "REM sleep helps form creative connections between memories. Dreams literally help solve problems!",
              action: "Keep a dream journal by your bed to capture creative insights."
            }
          ]
        },
        exercise: {
          icon: Activity,
          color: 'from-orange-500 to-red-600',
          tips: [
            {
              title: "BDNF Boost",
              content: "20 minutes of cardio increases BDNF (brain-derived neurotrophic factor) which grows new brain cells and connections.",
              action: "Take a brisk 20-minute walk today and notice how your mind feels afterward."
            },
            {
              title: "Learning After Exercise",
              content: "Exercise primes your brain for learning. You'll absorb information 20% better within 2 hours post-workout.",
              action: "Schedule your next study session right after a workout."
            },
            {
              title: "Yoga for Memory",
              content: "Yoga combines physical movement with mindfulness, reducing cortisol and improving both attention and memory.",
              action: "Try 10 minutes of gentle yoga stretches before your next memory training session."
            }
          ]
        },
        techniques: {
          icon: Brain,
          color: 'from-purple-500 to-pink-600',
          tips: [
            {
              title: "The 20-5-20 Rule",
              content: "Study for 20 minutes, take a 5-minute break, then review for 20 minutes. This pattern optimizes attention and retention.",
              action: "Use this pattern for your next study session and track how much you remember."
            },
            {
              title: "Teach to Learn",
              content: "Explaining concepts to others (or even to yourself out loud) activates different brain regions and strengthens memory.",
              action: "Pick one thing you learned today and explain it out loud as if teaching a friend."
            },
            {
              title: "Multi-Sensory Encoding",
              content: "Using multiple senses while learning creates more neural pathways to the same information, making it easier to recall.",
              action: "Next time you study, try reading aloud while writing notes and visualizing concepts."
            }
          ]
        }
      };

      const categories = Object.keys(tipCategories);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryData = tipCategories[randomCategory as keyof typeof tipCategories];
      const randomTip = categoryData.tips[Math.floor(Math.random() * categoryData.tips.length)];

      const newTip = {
        ...randomTip,
        category: randomCategory,
        icon: categoryData.icon,
        color: categoryData.color,
        date: new Date(),
        id: Date.now().toString()
      };

      // Save today's tip
      const today = new Date().toDateString();
      localStorage.setItem(`daily_tip_${userId}_${today}`, JSON.stringify(newTip));

      // Add to history
      const updatedHistory = [newTip, ...tipHistory].slice(0, 30); // Keep last 30 tips
      localStorage.setItem(`tip_history_${userId}`, JSON.stringify(updatedHistory));
      setTipHistory(updatedHistory);

      setCurrentTip(newTip);
      setLoading(false);
    }, 1000);
  };

  const markTipAsApplied = () => {
    if (!currentTip) return;

    const updatedTip = { ...currentTip, applied: true };
    const today = new Date().toDateString();
    localStorage.setItem(`daily_tip_${userId}_${today}`, JSON.stringify(updatedTip));
    setCurrentTip(updatedTip);

    // Update history
    const updatedHistory = tipHistory.map(tip => 
      tip.id === currentTip.id ? updatedTip : tip
    );
    localStorage.setItem(`tip_history_${userId}`, JSON.stringify(updatedHistory));
    setTipHistory(updatedHistory);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized brain tip...</p>
        </div>
      </div>
    );
  }

  if (!currentTip) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Brain Tip</h2>
          <p className="text-gray-600 mb-6">Get your personalized daily tip for optimal brain health</p>
          <button
            onClick={generateNewTip}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Get Today's Tip
          </button>
        </div>
      </div>
    );
  }

  const Icon = currentTip.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Today's Tip */}
      <div className={`bg-gradient-to-r ${currentTip.color} rounded-2xl p-8 text-white mb-8`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Icon className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Daily Brain Tip</h1>
              <p className="opacity-90">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          <button
            onClick={generateNewTip}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-3">{currentTip.title}</h2>
          <p className="text-lg leading-relaxed mb-4">{currentTip.content}</p>
          
          <div className="bg-white/20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">💡 Action Step:</h3>
            <p>{currentTip.action}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium capitalize">
            {currentTip.category}
          </span>
          
          {!currentTip.applied ? (
            <button
              onClick={markTipAsApplied}
              className="bg-white text-gray-900 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Mark as Applied
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-green-200">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Applied ✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Tip Categories */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tip Categories</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { category: 'nutrition', icon: Apple, label: 'Brain Nutrition', color: 'text-green-600' },
            { category: 'sleep', icon: Moon, label: 'Sleep & Recovery', color: 'text-indigo-600' },
            { category: 'exercise', icon: Activity, label: 'Physical Activity', color: 'text-orange-600' },
            { category: 'techniques', icon: Brain, label: 'Memory Techniques', color: 'text-purple-600' }
          ].map(item => {
            const ItemIcon = item.icon;
            const categoryTips = tipHistory.filter(tip => tip.category === item.category);
            return (
              <div key={item.category} className="text-center p-4 bg-gray-50 rounded-xl">
                <ItemIcon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
                <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                <p className="text-xs text-gray-600">{categoryTips.length} tips received</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip History */}
      {tipHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Tips</h3>
          <div className="space-y-4">
            {tipHistory.slice(0, 5).map((tip, index) => {
              const TipIcon = tip.icon;
              return (
                <div key={tip.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 bg-gradient-to-r ${tip.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <TipIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                      <span className="text-xs text-gray-500">
                        {tip.date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{tip.content}</p>
                    {tip.applied && (
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Applied ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Brain Health Journey</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{tipHistory.length}</div>
            <div className="text-sm text-gray-600">Tips Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tipHistory.filter(tip => tip.applied).length}
            </div>
            <div className="text-sm text-gray-600">Tips Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {tipHistory.length > 0 ? Math.round((tipHistory.filter(tip => tip.applied).length / tipHistory.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Application Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyBrainTip;