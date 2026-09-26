import React, { useState } from 'react';

const HabitForm = ({ initialData = { title: '', frequency: 'daily', goal: '' }, onSubmit }) => {
  const [title, setTitle] = useState(initialData.title);
  const [frequency, setFrequency] = useState(initialData.frequency);
  const [goal, setGoal] = useState(initialData.goal);
  const [error, setError] = useState('');

  // Validate form before submitting data up
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Habit title is required.');
      return;
    }
    setError('');
    onSubmit({ title, frequency, goal });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 rounded-2xl max-w-md mx-auto shadow-sm">
      {error && <p className="text-rose-500 text-sm mb-4 font-medium">{error}</p>}
      
      <div className="mb-4">
        <label className="block text-slate-700 text-sm font-semibold mb-2">Habit Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="e.g., Read for 30 minutes"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-slate-700 text-sm font-semibold mb-2">Frequency</label>
        <select 
          value={frequency} 
          onChange={(e) => setFrequency(e.target.value)} 
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-slate-700 text-sm font-semibold mb-2">Goal / Target</label>
        <input 
          type="text" 
          value={goal} 
          onChange={(e) => setGoal(e.target.value)} 
          placeholder="e.g., 3 Liters water"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm">
        Save Habit
      </button>
    </form>
  );
};

export default HabitForm;