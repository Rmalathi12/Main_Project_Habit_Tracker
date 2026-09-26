import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';
import API from '../services/api';

export default function CalendarView() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await API.get('/habits');
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && Array.isArray(response.data.habits)) {
        data = response.data.habits;
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }
      setHabits(data);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  const safeHabitsList = Array.isArray(habits) ? habits : [];
  const totalHabits = safeHabitsList.length;
  const completedCount = safeHabitsList.filter(h => h && h.completedToday).length;

  // Days of September 2026 generator
  const daysInMonth = 30; // September has 30 days
  const startingDayIndex = 2; // Tue (Sun=0, Mon=1, Tue=2)
  
  const daysArray = [];
  for (let i = 0; i < startingDayIndex; i++) {
    daysArray.push(null); // empty padding for prior month days
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Calendar View
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track your habits across the month
          </p>
        </div>

        {/* Calendar Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs mb-8">
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">September 2026</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3.5 py-1.5 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
                Today
              </button>
              <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-3 mb-3 text-center text-xs font-bold text-slate-400">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-3">
            {daysArray.map((dayNum, idx) => {
              const isToday = dayNum === 25; // September 25, 2026
              return (
                <div
                  key={idx}
                  className={`h-24 rounded-xl border p-2.5 flex flex-col justify-between transition-all ${
                    isToday
                      ? 'border-indigo-600 bg-white ring-1 ring-indigo-600 shadow-xs'
                      : 'border-slate-200/70 bg-white'
                  }`}
                >
                  <div className={`text-xs font-bold ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>
                    {dayNum || ''}
                  </div>
                  {isToday && (
                    <div className="flex flex-col items-center justify-center mb-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-0.5" />
                      <span className="text-[11px] font-bold text-slate-600">
                        {completedCount}/{totalHabits}
                      </span>
                    </div>
                  )}
                  <div className="w-full h-0.5 bg-slate-100 rounded-full"></div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border border-indigo-600 bg-white"></div> Today
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completed habits
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div> Progress bar
            </div>
          </div>
        </div>

        {/* Active Habits Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-4">Active Habits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safeHabitsList.map((habit, idx) => (
              <div key={habit._id || idx} className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                <span className="text-xs font-semibold text-slate-700 truncate">{habit.title}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}