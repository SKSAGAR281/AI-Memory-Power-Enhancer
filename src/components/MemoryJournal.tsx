import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Brain, Star, Plus, Search, Filter, Download, Lightbulb } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: Date;
  type: 'daily_recall' | 'technique_practice' | 'reflection' | 'breakthrough';
  title: string;
  content: string;
  memoryTechnique?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  effectiveness: number; // 1-5 rating
  tags: string[];
  aiInsight?: string;
}

interface MemoryJournalProps {
  userId: string;
}

const MemoryJournal: React.FC<MemoryJournalProps> = ({ userId }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    type: 'daily_recall',
    title: '',
    content: '',
    difficulty: 'medium',
    effectiveness: 3,
    tags: []
  });

  useEffect(() => {
    loadEntries();
    generateDailyPrompt();
  }, [userId]);

  const loadEntries = () => {
    const saved = localStorage.getItem(`memory_journal_${userId}`);
    if (saved) {
      const parsed = JSON.parse(saved).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
      setEntries(parsed);
    }
  };

  const saveEntries = (updatedEntries: JournalEntry[]) => {
    localStorage.setItem(`memory_journal_${userId}`, JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
  };

  const generateDailyPrompt = () => {
    const prompts = [
      "What did you have for breakfast three days ago? Try to recall the details.",
      "Describe a conversation you had yesterday. What were the key points?",
      "List 10 items you saw on your way to work/school today.",
      "Recall a movie you watched last week. What was the plot?",
      "What was the weather like exactly one week ago?",
      "Name 5 people you interacted with yesterday and what you discussed.",
      "Describe the last book you read. What were the main themes?",
      "What were you doing at this exact time yesterday?",
      "Recall the last time you learned something new. What was it?",
      "Describe your childhood bedroom in as much detail as possible."
    ];

    const today = new Date().toDateString();
    const lastPrompt = localStorage.getItem(`daily_prompt_date_${userId}`);
    
    if (lastPrompt !== today) {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      localStorage.setItem(`daily_prompt_${userId}`, randomPrompt);
      localStorage.setItem(`daily_prompt_date_${userId}`, today);
    }
  };

  const getDailyPrompt = () => {
    return localStorage.getItem(`daily_prompt_${userId}`) || "What's one thing you remember clearly from today?";
  };

  const generateAIInsight = (entry: JournalEntry): string => {
    // Simulate AI analysis - in production, this would call GPT-4
    const insights = [
      "Your recall shows strong visual memory patterns. Consider incorporating more visual techniques.",
      "You're demonstrating excellent sequential memory. Try applying this to learning new skills.",
      "Your emotional connections to memories are helping retention. Use this in your studies.",
      "You're showing improvement in detail recall. Keep practicing daily observation exercises.",
      "Your memory for conversations suggests strong auditory processing. Leverage this strength.",
      "The patterns in your entries show you remember best in the morning. Schedule important learning then.",
      "Your technique practice is paying off - your effectiveness ratings are improving over time.",
      "Consider combining your strong visual memory with the method of loci for even better results."
    ];

    // Simple analysis based on entry content
    if (entry.content.toLowerCase().includes('visual') || entry.content.toLowerCase().includes('see')) {
      return "Your recall shows strong visual memory patterns. Consider incorporating more visual techniques like mind mapping and imagery.";
    }
    if (entry.content.toLowerCase().includes('conversation') || entry.content.toLowerCase().includes('said')) {
      return "Your memory for conversations suggests strong auditory processing. Try reading aloud and using verbal rehearsal techniques.";
    }
    if (entry.effectiveness >= 4) {
      return "Excellent effectiveness rating! The techniques you're using are working well. Consider teaching them to others to reinforce your learning.";
    }
    
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const addEntry = () => {
    if (!newEntry.title || !newEntry.content) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      type: newEntry.type as any,
      title: newEntry.title,
      content: newEntry.content,
      memoryTechnique: newEntry.memoryTechnique,
      difficulty: newEntry.difficulty as any,
      effectiveness: newEntry.effectiveness || 3,
      tags: newEntry.tags || [],
      aiInsight: ''
    };

    // Generate AI insight
    entry.aiInsight = generateAIInsight(entry);

    const updatedEntries = [entry, ...entries];
    saveEntries(updatedEntries);
    
    setNewEntry({
      type: 'daily_recall',
      title: '',
      content: '',
      difficulty: 'medium',
      effectiveness: 3,
      tags: []
    });
    setShowNewEntry(false);
  };

  const addTag = (tag: string) => {
    if (tag && !newEntry.tags?.includes(tag)) {
      setNewEntry({
        ...newEntry,
        tags: [...(newEntry.tags || []), tag]
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || entry.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const exportJournal = () => {
    const exportData = {
      userId,
      exportDate: new Date().toISOString(),
      entries: entries,
      totalEntries: entries.length,
      averageEffectiveness: entries.reduce((sum, e) => sum + e.effectiveness, 0) / entries.length
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-journal-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderNewEntryForm = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">New Journal Entry</h3>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Entry Type</label>
            <select
              value={newEntry.type}
              onChange={(e) => setNewEntry({...newEntry, type: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="daily_recall">Daily Recall</option>
              <option value="technique_practice">Technique Practice</option>
              <option value="reflection">Reflection</option>
              <option value="breakthrough">Breakthrough</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
            <select
              value={newEntry.difficulty}
              onChange={(e) => setNewEntry({...newEntry, difficulty: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
          <input
            type="text"
            value={newEntry.title}
            onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
            placeholder="Give your entry a descriptive title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
          <textarea
            value={newEntry.content}
            onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
            placeholder="Describe your memory experience, what you practiced, or what you learned..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Effectiveness Rating: {newEntry.effectiveness}/5
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={newEntry.effectiveness}
            onChange={(e) => setNewEntry({...newEntry, effectiveness: parseInt(e.target.value)})}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {newEntry.tags?.map(tag => (
              <span
                key={tag}
                className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center space-x-1"
              >
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTag((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowNewEntry(false)}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addEntry}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );

  const renderDailyPrompt = () => (
    <div className="bg-gradient-to-r from-emerald-50 to-sky-50 rounded-2xl p-6 mb-6 border border-emerald-200">
      <div className="flex items-center space-x-3 mb-4">
        <Lightbulb className="w-6 h-6 text-emerald-600" />
        <h3 className="text-lg font-bold text-slate-900">Today's Memory Challenge</h3>
      </div>
      <p className="text-slate-700 mb-4">{getDailyPrompt()}</p>
      <button
        onClick={() => {
          setNewEntry({
            ...newEntry,
            type: 'daily_recall',
            title: 'Daily Memory Challenge',
            content: getDailyPrompt() + '\n\nMy response: '
          });
          setShowNewEntry(true);
        }}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Start Writing
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Memory Journal</h1>
          <p className="text-slate-600">Track your memory experiences and insights</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportJournal}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowNewEntry(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Daily Prompt */}
      {!showNewEntry && renderDailyPrompt()}

      {/* New Entry Form */}
      {showNewEntry && renderNewEntryForm()}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search entries..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="daily_recall">Daily Recall</option>
              <option value="technique_practice">Technique Practice</option>
              <option value="reflection">Reflection</option>
              <option value="breakthrough">Breakthrough</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No entries found</h3>
            <p className="text-slate-600">Start your memory journey by creating your first entry!</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    entry.type === 'daily_recall' ? 'bg-blue-500' :
                    entry.type === 'technique_practice' ? 'bg-emerald-500' :
                    entry.type === 'reflection' ? 'bg-purple-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <h3 className="text-lg font-semibold text-slate-900">{entry.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < entry.effectiveness ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">
                    {entry.date.toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-600 mb-3 line-clamp-2">{entry.content}</p>
              
              {entry.aiInsight && (
                <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">AI Insight</span>
                  </div>
                  <p className="text-sm text-indigo-800">{entry.aiInsight}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  entry.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                  entry.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {entry.difficulty}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">{selectedEntry.title}</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <span>{selectedEntry.date.toLocaleDateString()}</span>
                <span className="capitalize">{selectedEntry.type.replace('_', ' ')}</span>
                <span className="capitalize">{selectedEntry.difficulty}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < selectedEntry.effectiveness ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedEntry.content}
                </p>
              </div>
              
              {selectedEntry.aiInsight && (
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-indigo-900">AI Insight</span>
                  </div>
                  <p className="text-indigo-800">{selectedEntry.aiInsight}</p>
                </div>
              )}
              
              {selectedEntry.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryJournal;