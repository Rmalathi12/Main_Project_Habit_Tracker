import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  Target, 
  Flame, 
  Trophy, 
  Plus, 
  CheckCircle2, 
  Circle 
} from 'lucide-react';
import API from '../services/api';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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

  const handleToggleHabit = async (habitId, currentCompletedStatus) => {
    if (!habitId) return;
    
    const updatedHabits = habits.map(h => {
      if (h._id === habitId) {
        const newCompleted = !currentCompletedStatus;
        return {
          ...h,
          completedToday: newCompleted,
          streak: newCompleted ? (h.streak || 0) + 1 : Math.max(0, (h.streak || 1) - 1),
        };
      }
      return h;
    });
    setHabits(updatedHabits);

    try {
      await API.patch(`/habits/${habitId}/toggle`);
    } catch (err) {
      console.warn('Toggle endpoint returned an error, checking alternate paths...', err);
      try {
        await API.patch(`/habits/${habitId}`, { completedToday: !currentCompletedStatus });
      } catch (innerErr) {
        console.error('All toggle/update attempts failed:', innerErr);
      }
    }
  };

  const safeHabitsList = Array.isArray(habits) ? habits : [];
  const totalHabits = safeHabitsList.length;
  const completedCount = safeHabitsList.filter(h => h && h.completedToday).length;
  const progressPercentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
  const totalStreaks = safeHabitsList.reduce((acc, h) => acc + (h?.streak || (h?.completedToday ? 1 : 0)), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Good morning!
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {todayDateString}
          </p>
        </div>

        {/* Daily Tip Banner */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-6 shadow-xs flex items-center gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 ml-2">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              Daily Tip
            </h4>
            <p className="text-slate-500 text-xs mt-0.5">
              Prepare your environment: Make good habits easy and bad habits hard.
            </p>
          </div>
        </div>

        {/* 3 Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {completedCount}/{totalHabits}
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-1">Today's Progress</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{progressPercentage}% complete</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {totalStreaks}
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-1">Total Active Streaks</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Days of consistency</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-1">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl mt-1">🏆</div>
              <p className="text-xs font-semibold text-slate-700 mt-1">Achievements</p>
              <p className="text-[11px] text-indigo-600 font-medium hover:underline cursor-pointer mt-0.5">
                View all rewards
              </p>
            </div>
          </div>
        </div>

        {/* Today's Habits Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Today's Habits
          </h2>
          <button
            onClick={() => navigate('/add-habit')}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Habit
          </button>
        </div>

        {/* Habit List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading your habits...</div>
          ) : safeHabitsList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-500 text-sm mb-3">No habits found in your list.</p>
              <button
                onClick={() => navigate('/onboarding/goals')}
                className="text-indigo-600 font-semibold text-sm hover:underline cursor-pointer"
              >
                Go back to Goal Setup &rarr;
              </button>
            </div>
          ) : (
            safeHabitsList.map((habit, index) => {
              if (!habit) return null;
              const isDone = !!habit.completedToday;
              const streakCount = habit.streak || (isDone ? 1 : 0);

              return (
                <div
                  key={habit._id || index}
                  onClick={() => handleToggleHabit(habit._id, isDone)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                    isDone 
                      ? 'border-indigo-600/40 bg-indigo-50/10 shadow-xs' 
                      : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button className="text-indigo-600 focus:outline-none cursor-pointer">
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 fill-indigo-100 text-indigo-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300" />
                      )}
                    </button>
                    <div>
                      <h4 className={`font-semibold text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {habit.title || 'Untitled Habit'}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
                          🔥 {streakCount} day streak
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Best: {Math.max(streakCount, 1)} days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`w-2.5 h-2.5 rounded-full ${isDone ? 'bg-indigo-600' : 'bg-amber-400'}`}></div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}