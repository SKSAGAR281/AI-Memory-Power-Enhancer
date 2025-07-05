import React, { useState } from 'react';
import { Brain, BookOpen, Lightbulb, Apple, Activity, Moon, Zap, Clock, Target, Heart, Utensils, Dumbbell, Bed, Droplets, Pill } from 'lucide-react';

const MemoryGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('understanding');

  const sections = [
    { id: 'understanding', label: 'Understanding Memory', icon: Brain },
    { id: 'techniques', label: 'Memory Techniques', icon: Lightbulb },
    { id: 'nutrition', label: 'Brain Foods', icon: Apple },
    { id: 'exercise', label: 'Physical Exercise', icon: Activity },
    { id: 'sleep', label: 'Sleep & Recovery', icon: Moon },
    { id: 'lifestyle', label: 'Daily Habits', icon: Zap },
    { id: 'supplements', label: 'Supplements', icon: Pill },
    { id: 'schedule', label: 'Daily Schedule', icon: Clock }
  ];

  const renderUnderstandingMemory = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How Memory Works</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Memory is your brain's incredible ability to encode, store, and retrieve information. 
          Understanding how it works is the first step to improving it dramatically.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">1</span>
          </div>
          <h3 className="text-xl font-bold text-indigo-900 mb-4">Encoding</h3>
          <p className="text-indigo-800 leading-relaxed">
            Your brain converts information into a storable format. The quality of encoding 
            determines how well you'll remember something later.
          </p>
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-indigo-700"><strong>Key factors:</strong> Attention, emotion, repetition, and meaningful connections</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">2</span>
          </div>
          <h3 className="text-xl font-bold text-purple-900 mb-4">Storage</h3>
          <p className="text-purple-800 leading-relaxed">
            Information is maintained in different memory systems with varying capacities 
            and durations, from seconds to a lifetime.
          </p>
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-purple-700"><strong>Types:</strong> Sensory, short-term, working, and long-term memory</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">3</span>
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-4">Retrieval</h3>
          <p className="text-green-800 leading-relaxed">
            Accessing stored information when needed. The more you practice retrieval, 
            the stronger the memory pathways become.
          </p>
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-green-700"><strong>Methods:</strong> Recognition, recall, and relearning</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Types of Memory Systems</h3>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6 py-4">
            <h4 className="text-xl font-bold text-blue-900 mb-3">Working Memory</h4>
            <p className="text-gray-700 mb-3">
              Your mental workspace that holds and manipulates information temporarily. 
              Limited to about 7±2 items but crucial for problem-solving and learning.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 text-sm"><strong>Improve it:</strong> Practice dual n-back exercises, meditation, and chunking techniques</p>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-6 py-4">
            <h4 className="text-xl font-bold text-green-900 mb-3">Short-term Memory</h4>
            <p className="text-gray-700 mb-3">
              Briefly holds information (15-30 seconds) without rehearsal. 
              Acts as a gateway to long-term memory through repetition and encoding.
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-800 text-sm"><strong>Improve it:</strong> Repetition, visualization, and creating meaningful associations</p>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-6 py-4">
            <h4 className="text-xl font-bold text-purple-900 mb-3">Long-term Memory</h4>
            <p className="text-gray-700 mb-3">
              Stores information for extended periods (potentially lifelong). 
              Includes declarative memory (facts and events) and procedural memory (skills and habits).
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-800 text-sm"><strong>Improve it:</strong> Spaced repetition, elaborative rehearsal, and sleep consolidation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMemoryTechniques = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Proven Memory Techniques</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          These scientifically-backed techniques can dramatically improve your ability to encode, 
          store, and retrieve information effectively.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
            🏰 <span className="ml-3">Memory Palace (Method of Loci)</span>
          </h3>
          <p className="text-indigo-800 mb-6 text-lg leading-relaxed">
            The most powerful memory technique used by memory champions worldwide. 
            Associate information with specific locations in a familiar place.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">📋 Step-by-Step Guide:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Choose a familiar location (your home, office route)</li>
                <li>Identify specific landmarks in a logical order</li>
                <li>Associate each item with a location</li>
                <li>Create vivid, unusual mental images</li>
                <li>Practice the mental walk regularly</li>
              </ol>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">💡 Pro Tips:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Use exaggerated, colorful imagery</li>
                <li>Engage multiple senses in your visualizations</li>
                <li>Make connections emotional or humorous</li>
                <li>Practice with small lists first</li>
                <li>Create multiple palaces for different subjects</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
            🔗 <span className="ml-3">Chunking</span>
          </h3>
          <p className="text-green-800 mb-6 text-lg leading-relaxed">
            Break large amounts of information into smaller, manageable chunks. 
            This technique helps overcome working memory limitations.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">📞 Phone Numbers</h4>
              <p className="text-sm text-gray-600 mb-2">Instead of: 5551234567</p>
              <p className="text-lg font-bold text-green-700">555-123-4567</p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">💳 Credit Cards</h4>
              <p className="text-sm text-gray-600 mb-2">Instead of: 1234567890123456</p>
              <p className="text-lg font-bold text-green-700">1234 5678 9012 3456</p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">📚 Study Material</h4>
              <p className="text-sm text-gray-600 mb-2">Group by:</p>
              <p className="text-sm font-medium text-green-700">Categories, themes, or concepts</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center">
            🔄 <span className="ml-3">Spaced Repetition</span>
          </h3>
          <p className="text-orange-800 mb-6 text-lg leading-relaxed">
            Review information at increasing intervals to strengthen long-term retention. 
            Based on the scientifically proven forgetting curve.
          </p>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">⏰ Optimal Review Schedule:</h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="bg-orange-100 p-3 rounded-lg text-center">
                <div className="font-bold text-orange-800">Day 1</div>
                <div className="text-xs text-orange-600">Initial Learning</div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg text-center">
                <div className="font-bold text-orange-800">Day 2</div>
                <div className="text-xs text-orange-600">First Review</div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg text-center">
                <div className="font-bold text-orange-800">Day 4</div>
                <div className="text-xs text-orange-600">Second Review</div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg text-center">
                <div className="font-bold text-orange-800">Day 7</div>
                <div className="text-xs text-orange-600">Third Review</div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg text-center">
                <div className="font-bold text-orange-800">Day 15</div>
                <div className="text-xs text-orange-600">Fourth Review</div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg text-center">
                <div className="font-bold text-orange-800">Day 30</div>
                <div className="text-xs text-orange-600">Final Review</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
            🎭 <span className="ml-3">Mnemonics & Acronyms</span>
          </h3>
          <p className="text-purple-800 mb-6 text-lg leading-relaxed">
            Create memorable phrases, rhymes, or acronyms to encode complex information 
            in an easily retrievable format.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-purple-900 mb-4">🌈 Classic Examples:</h4>
              <ul className="space-y-3 text-gray-700">
                <li><strong className="text-purple-700">ROYGBIV:</strong> Colors of the rainbow</li>
                <li><strong className="text-purple-700">"Every Good Boy Does Fine":</strong> Musical notes (E, G, B, D, F)</li>
                <li><strong className="text-purple-700">"My Very Educated Mother...":</strong> Planets in order</li>
                <li><strong className="text-purple-700">SMART goals:</strong> Specific, Measurable, Achievable, Relevant, Time-bound</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-purple-900 mb-4">✨ Creating Your Own:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Use the first letter of each word</li>
                <li>• Make it memorable and personal</li>
                <li>• Add rhythm or rhyme when possible</li>
                <li>• Use vivid, unusual imagery</li>
                <li>• Practice until it becomes automatic</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Brain-Boosting Nutrition</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          What you eat directly impacts your cognitive function, memory formation, and mental clarity. 
          These nutritional strategies support optimal brain health and memory performance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
            <Apple className="w-8 h-8 mr-3" />
            Brain-Power Foods
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3 flex items-center">
                🫐 Antioxidant-Rich Foods
              </h4>
              <p className="text-sm text-gray-700 mb-3">Protect brain cells from oxidative stress and inflammation</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 p-2 rounded">Blueberries</div>
                <div className="bg-green-100 p-2 rounded">Dark chocolate (70%+)</div>
                <div className="bg-green-100 p-2 rounded">Green tea</div>
                <div className="bg-green-100 p-2 rounded">Spinach & kale</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3 flex items-center">
                🐟 Omega-3 Fatty Acids
              </h4>
              <p className="text-sm text-gray-700 mb-3">Essential for brain structure and neurotransmitter function</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-100 p-2 rounded">Salmon & mackerel</div>
                <div className="bg-blue-100 p-2 rounded">Walnuts</div>
                <div className="bg-blue-100 p-2 rounded">Chia seeds</div>
                <div className="bg-blue-100 p-2 rounded">Avocados</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3 flex items-center">
                🥜 Brain-Healthy Proteins
              </h4>
              <p className="text-sm text-gray-700 mb-3">Support neurotransmitter production and brain energy</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-yellow-100 p-2 rounded">Eggs (especially yolks)</div>
                <div className="bg-yellow-100 p-2 rounded">Lean meats</div>
                <div className="bg-yellow-100 p-2 rounded">Nuts & seeds</div>
                <div className="bg-yellow-100 p-2 rounded">Legumes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
          <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
            ⚠️ Foods to Limit
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-red-900 mb-3">🍬 Processed Sugars</h4>
              <p className="text-sm text-gray-700 mb-3">Can impair memory and cause brain fog</p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Candy, cookies, pastries</li>
                <li>• Sugary drinks and sodas</li>
                <li>• Processed cereals</li>
                <li>• Energy drinks</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-red-900 mb-3">🍟 Trans Fats</h4>
              <p className="text-sm text-gray-700 mb-3">Linked to cognitive decline and inflammation</p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Fried foods</li>
                <li>• Margarine and shortening</li>
                <li>• Packaged snacks</li>
                <li>• Fast food</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-red-900 mb-3">🍺 Excessive Alcohol</h4>
              <p className="text-sm text-gray-700 mb-3">Impairs memory formation and sleep quality</p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• Limit to moderate consumption</li>
                <li>• Avoid before learning sessions</li>
                <li>• Never drink and study</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
          <Droplets className="w-8 h-8 mr-3" />
          Hydration & Meal Timing
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-bold text-blue-900 mb-2">Water Intake</h4>
            <p className="text-2xl font-bold text-blue-600 mb-2">8-10 glasses</p>
            <p className="text-sm text-gray-600">Even mild dehydration affects concentration and memory</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <Utensils className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-bold text-green-900 mb-2">Meal Timing</h4>
            <p className="text-lg font-bold text-green-600 mb-2">Eat before studying</p>
            <p className="text-sm text-gray-600">Avoid heavy meals that cause drowsiness</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h4 className="font-bold text-purple-900 mb-2">Intermittent Fasting</h4>
            <p className="text-lg font-bold text-purple-600 mb-2">16:8 method</p>
            <p className="text-sm text-gray-600">May enhance cognitive function and neuroplasticity</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
        <h3 className="text-2xl font-bold text-orange-900 mb-6">🍽️ Sample Brain-Healthy Daily Menu</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-orange-900 mb-4">🌅 Breakfast</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Blueberry and walnut oatmeal</li>
              <li>• Green tea or coffee</li>
              <li>• Scrambled eggs with spinach</li>
              <li>• Avocado toast (whole grain)</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-orange-900 mb-4">☀️ Lunch</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Salmon salad with mixed greens</li>
              <li>• Quinoa and vegetable bowl</li>
              <li>• Handful of almonds</li>
              <li>• Dark chocolate (70%+ cocoa)</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-orange-900 mb-4">🌙 Dinner</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Grilled chicken with broccoli</li>
              <li>• Sweet potato</li>
              <li>• Mixed berry dessert</li>
              <li>• Herbal tea (chamomile)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExercise = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Physical Exercise for Memory</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Physical exercise is one of the most powerful tools for enhancing memory and cognitive function. 
          It increases blood flow to the brain, promotes neuroplasticity, and releases growth factors that support brain health.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="flex items-center mb-6">
            <Activity className="w-10 h-10 text-green-600 mr-4" />
            <h3 className="text-2xl font-bold text-green-900">Aerobic Exercise</h3>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🧠 Brain Benefits</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Increases BDNF (brain-derived neurotrophic factor)</li>
                <li>• Promotes growth of new brain cells</li>
                <li>• Improves memory consolidation</li>
                <li>• Enhances executive function</li>
                <li>• Reduces inflammation</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🏃‍♂️ Recommended Activities</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-100 p-3 rounded text-center text-sm">Brisk Walking</div>
                <div className="bg-green-100 p-3 rounded text-center text-sm">Jogging</div>
                <div className="bg-green-100 p-3 rounded text-center text-sm">Cycling</div>
                <div className="bg-green-100 p-3 rounded text-center text-sm">Swimming</div>
                <div className="bg-green-100 p-3 rounded text-center text-sm">Dancing</div>
                <div className="bg-green-100 p-3 rounded text-center text-sm">Tennis</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">⏰ Optimal Schedule</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Frequency:</strong> 3-5 times per week</p>
                <p><strong>Duration:</strong> 30-60 minutes</p>
                <p><strong>Intensity:</strong> Moderate (can hold conversation)</p>
                <p><strong>Best time:</strong> Morning for cognitive boost</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center mb-6">
            <Dumbbell className="w-10 h-10 text-blue-600 mr-4" />
            <h3 className="text-2xl font-bold text-blue-900">Strength Training</h3>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-blue-900 mb-3">💪 Cognitive Benefits</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Enhances executive function</li>
                <li>• Improves working memory</li>
                <li>• Increases attention span</li>
                <li>• Supports neuroplasticity</li>
                <li>• Reduces cognitive decline</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-blue-900 mb-3">🏋️‍♀️ Exercise Types</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="bg-blue-100 p-2 rounded">Bodyweight exercises (push-ups, squats)</div>
                <div className="bg-blue-100 p-2 rounded">Resistance bands</div>
                <div className="bg-blue-100 p-2 rounded">Free weights</div>
                <div className="bg-blue-100 p-2 rounded">Functional movements</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-blue-900 mb-3">📅 Training Plan</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Frequency:</strong> 2-3 times per week</p>
                <p><strong>Duration:</strong> 20-45 minutes</p>
                <p><strong>Focus:</strong> Major muscle groups</p>
                <p><strong>Rest:</strong> 48 hours between sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
        <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
          🧘‍♀️ <span className="ml-3">Mind-Body Exercises</span>
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🧘‍♀️</div>
            <h4 className="font-bold text-purple-900 mb-3">Yoga</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Reduces stress hormones</li>
              <li>• Improves focus</li>
              <li>• Enhances mind-body connection</li>
              <li>• Increases GABA levels</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🥋</div>
            <h4 className="font-bold text-purple-900 mb-3">Tai Chi</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Improves balance</li>
              <li>• Enhances cognitive flexibility</li>
              <li>• Reduces anxiety</li>
              <li>• Promotes mindfulness</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🤸‍♀️</div>
            <h4 className="font-bold text-purple-900 mb-3">Pilates</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Strengthens core</li>
              <li>• Improves concentration</li>
              <li>• Enhances body awareness</li>
              <li>• Reduces stress</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
        <h3 className="text-2xl font-bold text-yellow-900 mb-6">⚡ Quick Exercise Breaks for Memory</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-yellow-900 mb-4">🕐 5-Minute Energizers</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Jumping jacks (30 seconds x 3)</li>
              <li>• Desk push-ups (10-15 reps)</li>
              <li>• Stair climbing (2-3 flights)</li>
              <li>• Deep breathing with arm circles</li>
              <li>• Wall sits (30 seconds x 2)</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-yellow-900 mb-4">🧠 Study Session Boosters</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Walk while reviewing notes</li>
              <li>• Stand and stretch every 25 minutes</li>
              <li>• Do squats during breaks</li>
              <li>• Practice balance poses</li>
              <li>• Use a standing desk periodically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSleep = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Sleep & Memory Consolidation</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Sleep is when your brain consolidates memories, clears toxins, and strengthens neural connections. 
          Quality sleep is absolutely essential for optimal memory performance and cognitive function.
        </p>
      </div>

      <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-200">
        <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
          <Moon className="w-8 h-8 mr-3" />
          Sleep Stages & Memory
        </h3>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h4 className="font-bold text-indigo-900 mb-2">Light Sleep</h4>
            <p className="text-sm text-gray-600">Transition from wake to sleep. Brain waves slow down.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h4 className="font-bold text-indigo-900 mb-2">Deep Sleep</h4>
            <p className="text-sm text-gray-600">Memory consolidation occurs. Growth hormone released.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h4 className="font-bold text-indigo-900 mb-2">REM Sleep</h4>
            <p className="text-sm text-gray-600">Creative connections form. Dreams process emotions.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">↻</span>
            </div>
            <h4 className="font-bold text-indigo-900 mb-2">Cycles</h4>
            <p className="text-sm text-gray-600">4-6 complete cycles per night for optimal memory.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
            ✅ <span className="ml-3">Sleep Optimization</span>
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🕘 Consistent Schedule</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Same bedtime and wake time daily</li>
                <li>• 7-9 hours for adults (8-10 for teens)</li>
                <li>• Weekend consistency is crucial</li>
                <li>• Use light exposure to regulate circadian rhythm</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🛁 Pre-Sleep Routine</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• 1-2 hour wind-down period</li>
                <li>• Reading, gentle stretching, meditation</li>
                <li>• Dim lights 2 hours before bed</li>
                <li>• Warm bath or shower</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🛏️ Sleep Environment</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Dark, quiet room (blackout curtains)</li>
                <li>• Cool temperature (65-68°F)</li>
                <li>• Comfortable mattress and pillows</li>
                <li>• Remove electronic devices</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
          <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
            ❌ <span className="ml-3">Sleep Disruptors</span>
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-red-900 mb-3">📱 Blue Light Exposure</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• No screens 2 hours before bed</li>
                <li>• Use blue light filters after sunset</li>
                <li>• Consider blue light blocking glasses</li>
                <li>• Use red light for evening activities</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-red-900 mb-3">☕ Caffeine & Stimulants</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• No caffeine after 2 PM</li>
                <li>• Avoid pre-workout supplements late</li>
                <li>• Be aware of hidden caffeine sources</li>
                <li>• Limit total daily caffeine intake</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-red-900 mb-3">🍽️ Late Eating & Alcohol</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Finish eating 3 hours before bed</li>
                <li>• Limit alcohol consumption</li>
                <li>• Avoid large amounts of fluids before sleep</li>
                <li>• Light snack if hungry (tryptophan-rich)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
        <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
          <Bed className="w-8 h-8 mr-3" />
          Strategic Napping for Memory
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h4 className="font-bold text-purple-900 mb-2">⏰ Timing</h4>
            <p className="text-lg font-bold text-purple-600 mb-2">20-30 minutes</p>
            <p className="text-sm text-gray-600">1-3 PM ideal window. Avoid after 4 PM.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-bold text-green-900 mb-2">🎯 Purpose</h4>
            <p className="text-lg font-bold text-green-600 mb-2">Restore alertness</p>
            <p className="text-sm text-gray-600">Improve afternoon performance and memory consolidation.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <Heart className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h4 className="font-bold text-orange-900 mb-2">⚠️ Caution</h4>
            <p className="text-lg font-bold text-orange-600 mb-2">Avoid sleep inertia</p>
            <p className="text-sm text-gray-600">Keep naps short to prevent grogginess.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">💤 Sleep & Learning Protocol</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-4">📚 Before Sleep Learning</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Review material 30 minutes before bed</li>
              <li>• Focus on most important concepts</li>
              <li>• Use spaced repetition flashcards</li>
              <li>• Avoid new, complex material</li>
              <li>• Keep review session calm and relaxed</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-4">🌅 Morning Review</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Review same material upon waking</li>
              <li>• Test recall before looking at answers</li>
              <li>• Note what was retained overnight</li>
              <li>• Identify areas needing more practice</li>
              <li>• Plan next learning session</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLifestyle = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Daily Habits for Memory Enhancement</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Small daily habits compound over time to create significant improvements in memory and cognitive function. 
          These evidence-based practices can be easily integrated into your routine.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200">
          <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
            <Brain className="w-8 h-8 mr-3" />
            Mental Stimulation
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-indigo-900 mb-3">🧩 Cognitive Challenges</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-indigo-100 p-2 rounded text-center">Puzzles</div>
                <div className="bg-indigo-100 p-2 rounded text-center">Chess</div>
                <div className="bg-indigo-100 p-2 rounded text-center">Sudoku</div>
                <div className="bg-indigo-100 p-2 rounded text-center">Crosswords</div>
                <div className="bg-indigo-100 p-2 rounded text-center">Brain games</div>
                <div className="bg-indigo-100 p-2 rounded text-center">Strategy games</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-indigo-900 mb-3">📚 Learning Activities</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Learn a new language (15 min/day)</li>
                <li>• Practice a musical instrument</li>
                <li>• Take up a new hobby or skill</li>
                <li>• Read diverse topics daily</li>
                <li>• Engage in creative writing</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-indigo-900 mb-3">🎯 Memory Exercises</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Practice memory palace technique</li>
                <li>• Memorize poetry or quotes</li>
                <li>• Learn people's names actively</li>
                <li>• Practice mental math</li>
                <li>• Use spaced repetition apps</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
            <Heart className="w-8 h-8 mr-3" />
            Stress Management
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🧘‍♀️ Mindfulness Practices</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• 10-20 minutes daily meditation</li>
                <li>• Deep breathing exercises</li>
                <li>• Progressive muscle relaxation</li>
                <li>• Mindful walking</li>
                <li>• Gratitude journaling</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🌿 Stress Reduction</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Spend time in nature</li>
                <li>• Practice yoga or tai chi</li>
                <li>• Listen to calming music</li>
                <li>• Maintain social connections</li>
                <li>• Set realistic goals and boundaries</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">⚡ Quick Stress Busters</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• 4-7-8 breathing technique</li>
                <li>• 5-minute meditation</li>
                <li>• Cold water on wrists</li>
                <li>• Gentle neck stretches</li>
                <li>• Listen to favorite song</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200">
        <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center">
          <Zap className="w-8 h-8 mr-3" />
          Environmental Optimization
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🌡️</div>
            <h4 className="font-bold text-orange-900 mb-2">Temperature</h4>
            <p className="text-lg font-bold text-orange-600 mb-2">68-72°F</p>
            <p className="text-sm text-gray-600">Cool environments enhance alertness and focus</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">💡</div>
            <h4 className="font-bold text-orange-900 mb-2">Lighting</h4>
            <p className="text-lg font-bold text-orange-600 mb-2">Bright & Natural</p>
            <p className="text-sm text-gray-600">Natural light preferred. Avoid blue light before sleep</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🔇</div>
            <h4 className="font-bold text-orange-900 mb-2">Noise</h4>
            <p className="text-lg font-bold text-orange-600 mb-2">Quiet/White Noise</p>
            <p className="text-sm text-gray-600">Minimize distractions during learning</p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
        <h3 className="text-2xl font-bold text-purple-900 mb-6">🔄 Digital Wellness</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-purple-900 mb-4">📱 Screen Time Management</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use the 20-20-20 rule (every 20 min, look 20 feet away for 20 sec)</li>
              <li>• Take regular breaks from screens</li>
              <li>• Use blue light filters after sunset</li>
              <li>• Implement phone-free zones and times</li>
              <li>• Practice digital detox periods</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-purple-900 mb-4">🧠 Cognitive Load Management</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Single-task instead of multitasking</li>
              <li>• Use productivity techniques (Pomodoro)</li>
              <li>• Organize digital workspace</li>
              <li>• Limit information overload</li>
              <li>• Practice focused attention exercises</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupplements = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Memory-Supporting Supplements</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          While a balanced diet should be your primary source of nutrients, certain supplements may support 
          memory and cognitive function. Always consult with a healthcare provider before starting any supplement regimen.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <p className="text-yellow-800 text-sm">
            ⚠️ <strong>Important:</strong> Supplements are not regulated like medications. Quality varies between brands. 
            Always consult your healthcare provider before starting any supplement, especially if you have medical conditions or take medications.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
            <Pill className="w-8 h-8 mr-3" />
            Evidence-Based Supplements
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🐟 Omega-3 Fatty Acids</h4>
              <p className="text-sm text-gray-700 mb-3">Essential for brain structure and function</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Dosage:</strong> 1000-2000mg EPA/DHA daily</p>
                <p><strong>Benefits:</strong> Memory, mood, brain health</p>
                <p><strong>Source:</strong> Fish oil, algae oil (vegan)</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🌞 Vitamin D3</h4>
              <p className="text-sm text-gray-700 mb-3">Supports brain health and cognitive function</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Dosage:</strong> 1000-4000 IU daily</p>
                <p><strong>Benefits:</strong> Mood, memory, neuroprotection</p>
                <p><strong>Note:</strong> Test blood levels first</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🧠 B-Complex Vitamins</h4>
              <p className="text-sm text-gray-700 mb-3">Essential for neurotransmitter production</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Key vitamins:</strong> B6, B12, Folate</p>
                <p><strong>Benefits:</strong> Energy, focus, memory</p>
                <p><strong>Source:</strong> High-quality B-complex</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
            🌿 <span className="ml-3">Herbal & Natural</span>
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-blue-900 mb-3">🍃 Ginkgo Biloba</h4>
              <p className="text-sm text-gray-700 mb-3">May improve blood flow to the brain</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Dosage:</strong> 120-240mg daily</p>
                <p><strong>Benefits:</strong> Memory, circulation</p>
                <p><strong>Note:</strong> May interact with blood thinners</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-blue-900 mb-3">🍵 L-Theanine</h4>
              <p className="text-sm text-gray-700 mb-3">Promotes calm focus and attention</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Dosage:</strong> 100-200mg daily</p>
                <p><strong>Benefits:</strong> Focus, relaxation, stress reduction</p>
                <p><strong>Source:</strong> Green tea extract</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-blue-900 mb-3">🧄 Bacopa Monnieri</h4>
              <p className="text-sm text-gray-700 mb-3">Traditional herb for memory enhancement</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Dosage:</strong> 300-600mg daily</p>
                <p><strong>Benefits:</strong> Memory, learning, stress</p>
                <p><strong>Note:</strong> Effects may take 8-12 weeks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
        <h3 className="text-2xl font-bold text-purple-900 mb-6">⚗️ Nootropics & Cognitive Enhancers</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-purple-900 mb-3">☕ Caffeine + L-Theanine</h4>
            <p className="text-sm text-gray-700 mb-3">Synergistic combination for focus</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Ratio:</strong> 2:1 (200mg caffeine : 100mg L-theanine)</p>
              <p><strong>Timing:</strong> Morning or early afternoon</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-purple-900 mb-3">🧬 Creatine</h4>
            <p className="text-sm text-gray-700 mb-3">May support brain energy metabolism</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Dosage:</strong> 3-5g daily</p>
              <p><strong>Benefits:</strong> Mental energy, processing speed</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-purple-900 mb-3">🍄 Lion's Mane</h4>
            <p className="text-sm text-gray-700 mb-3">Mushroom that may support nerve growth</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Dosage:</strong> 500-1000mg daily</p>
              <p><strong>Benefits:</strong> Neuroprotection, cognitive function</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
        <h3 className="text-2xl font-bold text-red-900 mb-6">⚠️ Important Considerations</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-4">🔍 Quality & Safety</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Choose third-party tested products</li>
              <li>• Look for USP, NSF, or ConsumerLab certification</li>
              <li>• Start with lower doses</li>
              <li>• Monitor for side effects</li>
              <li>• Keep a supplement log</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-4">💊 Drug Interactions</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Always consult healthcare provider</li>
              <li>• Check for medication interactions</li>
              <li>• Inform all healthcare providers</li>
              <li>• Be cautious with blood thinners</li>
              <li>• Monitor if taking multiple supplements</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200">
        <h3 className="text-2xl font-bold text-indigo-900 mb-6">🎯 Supplement Strategy</h3>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-indigo-900 mb-3">📋 Getting Started</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Get blood work to identify deficiencies (Vitamin D, B12, etc.)</li>
              <li>Start with basic nutrients (Omega-3, Vitamin D, B-complex)</li>
              <li>Add one supplement at a time to assess effects</li>
              <li>Give each supplement 4-8 weeks to show benefits</li>
              <li>Track cognitive performance and mood changes</li>
              <li>Adjust dosages based on response and blood levels</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-indigo-900 mb-3">💡 Remember</h4>
            <p className="text-sm text-gray-700">
              Supplements work best as part of a comprehensive approach including proper nutrition, 
              exercise, sleep, and stress management. They're meant to supplement, not replace, a healthy lifestyle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Optimal Daily Schedule for Memory</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your daily routine significantly impacts memory formation and cognitive performance. 
          This science-based schedule optimizes your natural circadian rhythms for peak mental function.
        </p>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
        <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center">
          <Clock className="w-8 h-8 mr-3" />
          Circadian Rhythm & Cognitive Performance
        </h3>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🌅</div>
            <h4 className="font-bold text-orange-900 mb-1">Morning</h4>
            <p className="text-xs text-gray-600">Peak alertness & focus</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">☀️</div>
            <h4 className="font-bold text-orange-900 mb-1">Late Morning</h4>
            <p className="text-xs text-gray-600">Optimal for complex tasks</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🌤️</div>
            <h4 className="font-bold text-orange-900 mb-1">Afternoon</h4>
            <p className="text-xs text-gray-600">Natural dip in alertness</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🌙</div>
            <h4 className="font-bold text-orange-900 mb-1">Evening</h4>
            <p className="text-xs text-gray-600">Memory consolidation</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">🌅 Morning Routine (6:00 - 10:00 AM)</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-2">6:00 - 7:00 AM: Wake Up</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Consistent wake time (even weekends)</li>
                  <li>• Immediate bright light exposure</li>
                  <li>• Hydrate with 16-20 oz water</li>
                  <li>• 5-10 minutes of gentle stretching</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-2">7:00 - 8:00 AM: Exercise</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 20-30 minutes cardio or strength training</li>
                  <li>• Boosts BDNF for learning</li>
                  <li>• Enhances mood and alertness</li>
                  <li>• Outdoor exercise for vitamin D</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-2">8:00 - 9:00 AM: Brain-Healthy Breakfast</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Protein + healthy fats + complex carbs</li>
                  <li>• Blueberries, nuts, eggs, oatmeal</li>
                  <li>• Green tea or coffee (if desired)</li>
                  <li>• Omega-3 supplement</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-2">9:00 - 10:00 AM: Peak Learning Time</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Most challenging material</li>
                  <li>• New concept learning</li>
                  <li>• Complex problem solving</li>
                  <li>• Memory palace practice</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-green-900 mb-6">☀️ Late Morning (10:00 AM - 12:00 PM)</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">🎯 Optimal Activities</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Deep work and focused study</li>
                <li>• Creative problem solving</li>
                <li>• Memory technique practice</li>
                <li>• Important decision making</li>
                <li>• Skill acquisition</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-green-900 mb-3">💡 Productivity Tips</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Use Pomodoro Technique (25 min focus)</li>
                <li>• Minimize distractions</li>
                <li>• Single-task for better retention</li>
                <li>• Take 5-minute breaks every 25 minutes</li>
                <li>• Stay hydrated</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
          <h3 className="text-2xl font-bold text-yellow-900 mb-6">🌤️ Afternoon (12:00 - 6:00 PM)</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-yellow-900 mb-2">12:00 - 1:00 PM: Lunch</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Balanced meal with protein</li>
                <li>• Include leafy greens</li>
                <li>• Avoid heavy, processed foods</li>
                <li>• Mindful eating practice</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-yellow-900 mb-2">1:00 - 2:00 PM: Power Nap</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 20-30 minute nap (optional)</li>
                <li>• Restores afternoon alertness</li>
                <li>• Enhances memory consolidation</li>
                <li>• Avoid if it affects night sleep</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-yellow-900 mb-2">2:00 - 6:00 PM: Review & Practice</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Review morning material</li>
                <li>• Spaced repetition practice</li>
                <li>• Light physical activity</li>
                <li>• Social learning activities</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-purple-900 mb-6">🌙 Evening (6:00 - 10:00 PM)</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-purple-900 mb-2">6:00 - 7:00 PM: Dinner</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Light, nutritious meal</li>
                  <li>• Include brain-healthy fats</li>
                  <li>• Finish eating 3 hours before bed</li>
                  <li>• Limit caffeine and alcohol</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-purple-900 mb-2">7:00 - 8:00 PM: Light Review</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Review key concepts from the day</li>
                  <li>• Use flashcards or spaced repetition</li>
                  <li>• Avoid learning new, complex material</li>
                  <li>• Focus on consolidation</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-purple-900 mb-2">8:00 - 9:00 PM: Wind Down</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Dim lights to promote melatonin</li>
                  <li>• Relaxing activities (reading, music)</li>
                  <li>• Gentle stretching or yoga</li>
                  <li>• Avoid screens or use blue light filters</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-purple-900 mb-2">9:00 - 10:00 PM: Sleep Prep</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Meditation or deep breathing</li>
                  <li>• Gratitude journaling</li>
                  <li>• Prepare for tomorrow</li>
                  <li>• Cool, dark bedroom environment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
        <h3 className="text-2xl font-bold text-indigo-900 mb-6">📅 Weekly Schedule Optimization</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-indigo-900 mb-4">📚 Study Schedule</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Monday:</strong> New material introduction</li>
              <li><strong>Tuesday:</strong> Practice and application</li>
              <li><strong>Wednesday:</strong> Review and consolidation</li>
              <li><strong>Thursday:</strong> Advanced concepts</li>
              <li><strong>Friday:</strong> Weekly review and testing</li>
              <li><strong>Weekend:</strong> Light review and rest</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-indigo-900 mb-4">🏃‍♀️ Exercise Schedule</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Monday:</strong> Cardio (30 min)</li>
              <li><strong>Tuesday:</strong> Strength training</li>
              <li><strong>Wednesday:</strong> Yoga or stretching</li>
              <li><strong>Thursday:</strong> Cardio (30 min)</li>
              <li><strong>Friday:</strong> Strength training</li>
              <li><strong>Weekend:</strong> Active recovery (walking, hiking)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
        <h3 className="text-2xl font-bold text-red-900 mb-6">⚠️ Common Schedule Mistakes</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-4">❌ What to Avoid</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Studying difficult material late at night</li>
              <li>• Skipping breakfast before learning</li>
              <li>• Long study sessions without breaks</li>
              <li>• Inconsistent sleep schedule</li>
              <li>• Cramming instead of spaced practice</li>
              <li>• Multitasking during study time</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-4">✅ Better Alternatives</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Light review 30 minutes before bed</li>
              <li>• Protein-rich breakfast for brain fuel</li>
              <li>• 25-minute focused sessions with breaks</li>
              <li>• Same sleep/wake times daily</li>
              <li>• Distributed practice over time</li>
              <li>• Single-tasking for better retention</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'understanding': return renderUnderstandingMemory();
      case 'techniques': return renderMemoryTechniques();
      case 'nutrition': return renderNutrition();
      case 'exercise': return renderExercise();
      case 'sleep': return renderSleep();
      case 'lifestyle': return renderLifestyle();
      case 'supplements': return renderSupplements();
      case 'schedule': return renderSchedule();
      default: return renderUnderstandingMemory();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Memory Enhancement Guide</h1>
        <p className="text-xl text-gray-600">
          Science-backed strategies for optimizing your cognitive performance and memory
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`p-4 rounded-xl transition-all duration-200 flex flex-col items-center space-y-2 ${
                  activeSection === section.id
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium text-center leading-tight">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {renderSection()}
      </div>

      {/* Quick Action Cards */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="font-bold text-green-900 mb-2">🍎 Start Today</h3>
          <p className="text-green-800 text-sm">Add blueberries to breakfast, take a 20-minute walk, and practice one memory technique.</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">📚 This Week</h3>
          <p className="text-blue-800 text-sm">Establish a consistent sleep schedule and try the memory palace technique with familiar locations.</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="font-bold text-purple-900 mb-2">🎯 This Month</h3>
          <p className="text-purple-800 text-sm">Build a complete daily routine incorporating all memory-enhancing habits and track your progress.</p>
        </div>
      </div>
    </div>
  );
};

export default MemoryGuide;