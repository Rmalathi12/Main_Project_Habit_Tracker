import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Clock } from 'lucide-react';
import API from '../services/api';

const AI_SUGGESTIONS = [
  'Morning Exercise', 'Read for 20 minutes', 'Drink 8 glasses of water',
  'Meditate', 'Write in journal', 'Practice gratitude',
  'Learn a new language', 'Take a walk'
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function CreateHabit() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [reminderTime, setReminderTime] = useState('09:00 AM');
  const [color, setColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a habit name.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/habits', {
        title,
        description,
        frequency: frequency.toLowerCase(),
        reminderTime,
        color,
        category: 'General'
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error creating habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 font-bold text-lg text-indigo-600">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">✨</div>
          HabitTrack
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8">
        <button 
          onClick={() => navigate('/')} 
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1"
        >
          &larr; Back to Dashboard
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          <h1 className="text-2xl font-black text-slate-900 mb-6">Create New Habit</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Habit Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Morning Exercise"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> AI Suggestions
              </label>
              <div className="flex flex-wrap gap-2">
                {AI_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setTitle(sug)}
                    className="bg-indigo-50/70 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any notes or details about this habit..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Frequency</label>
              <div className="grid grid-cols-3 gap-3">
                {['Daily', 'Weekly', 'Custom'].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`py-3 rounded-xl border font-semibold text-sm transition-all ${
                      frequency === freq 
                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Reminder Time</label>
              <div className="relative">
                <input
                  type="text"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none pl-10"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Color</label>
              <div className="flex items-center gap-3">
                {COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${color === c ? 'ring-4 ring-indigo-200 scale-110' : ''}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-sm transition-all"
            >
              {loading ? 'Creating...' : 'Create Habit'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}