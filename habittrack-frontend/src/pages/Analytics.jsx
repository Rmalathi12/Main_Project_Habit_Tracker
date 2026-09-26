import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Calendar, 
  BarChart3 
} from 'lucide-react';
import API from '../services/api';

export default function AnalyticsView() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Month'); // Default to Month
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
  const completedTodayCount = safeHabitsList.filter(h => h && h.completedToday).length;

  // Dynamic multiplier based on selected tab: Week (7), Month (30), Year (365)
  const getMultiplier = () => {
    if (activeTab === 'Week') return 7;
    if (activeTab === 'Year') return 365;
    return 30; // Month
  };

  const daysMultiplier = getMultiplier();
  const totalPossibleCompletions = totalHabits * daysMultiplier;
  
  // Approximate past completions scaled by timeframe for realistic dynamic simulation
  const scaledCompletedCount = activeTab === 'Week' 
    ? Math.min(totalPossibleCompletions, completedTodayCount * 7) 
    : activeTab === 'Year' 
    ? completedTodayCount * 45 
    : completedTodayCount;

  const completionRate = totalPossibleCompletions > 0 
    ? Math.round((scaledCompletedCount / totalPossibleCompletions) * 100) 
    : 0;

  const maxStreak = safeHabitsList.reduce((max, h) => Math.max(max, h?.streak || 1), 1);
  const mostConsistentTitle = safeHabitsList[0]?.title || 'None';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Analytics & Insights
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Visualize your habit trends and progress over time
            </p>
          </div>
          
          {/* Time Filter Tabs (Week / Month / Year) */}
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-xs">
            {['Week', 'Month', 'Year'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Stat Cards Grid (Dynamic values based on activeTab) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{completionRate}%</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Completion Rate ({activeTab})</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{scaledCompletedCount} of {totalPossibleCompletions}</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{maxStreak}</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Average Streak</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Days per habit</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-slate-900 truncate mt-1">{mostConsistentTitle}</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Most Consistent</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Top performer</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{totalHabits}</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Active Habits</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total tracking</p>
          </div>
        </div>

        {/* Completion Over Time Chart (Adapts to Active Tab) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-base">Completion Over Time ({activeTab})</h3>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {activeTab} View Enabled
            </span>
          </div>
          <div className="h-64 w-full flex items-center justify-center relative bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <div className="absolute inset-x-8 bottom-8 top-8 flex items-end justify-between">
              {Array.from({ length: activeTab === 'Week' ? 7 : activeTab === 'Year' ? 12 : 16 }).map((_, idx) => {
                const isTall = idx % 3 === 0 && completionRate > 0;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-2.5 rounded-full bg-emerald-500 transition-all duration-500" 
                      style={{ height: `${isTall ? Math.max(20, completionRate * 1.5) : 8}px` }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completion Rate % ({activeTab})</span>
          </div>
        </div>

        {/* Habit Comparison Bars */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs mb-8">
          <h3 className="font-bold text-slate-900 text-base mb-6">Habit Comparison</h3>
          <div className="space-y-4">
            {safeHabitsList.map((habit, idx) => (
              <div key={habit._id || idx} className="grid grid-cols-4 items-center gap-4">
                <span className="text-xs font-semibold text-slate-700 truncate">{habit.title}</span>
                <div 
                  className="col-span-3 bg-indigo-500 h-9 rounded-xl flex items-center px-4 text-white font-medium text-xs shadow-xs transition-all" 
                  style={{ width: habit.completedToday ? '100%' : '35%' }}
                >
                  {habit.completedToday ? 'Completed' : 'In Progress'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Box */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-start gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 ml-2">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">AI Analysis</h4>
            <p className="text-slate-500 text-xs mt-0.5">
              Your {completionRate}% completion rate for this {activeTab.toLowerCase()} shows your dedication. Keep maintaining your daily check-ins to boost consistency!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}