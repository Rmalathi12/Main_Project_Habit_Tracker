import React from 'react';
import { useNavigate } from 'react-router-dom';

const HabitCard = ({ habit, onTrack, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">{habit.title}</h3>
        <div className="flex items-center gap-3">
          <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
            {habit.frequency}
          </span>
          <span className="text-slate-500 text-sm">Goal: {habit.goal || 'Daily completion'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Trigger completion tracking */}
        <button 
          onClick={() => onTrack(habit._id)} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          ✓ Complete
        </button>
        {/* Navigate to edit form */}
        <button 
          onClick={() => navigate(`/edit-habit/${habit._id}`, { state: { habit } })} 
          className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          Edit
        </button>
        {/* Delete habit action */}
        <button 
          onClick={() => onDelete(habit._id)} 
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default HabitCard;