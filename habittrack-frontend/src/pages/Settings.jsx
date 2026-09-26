import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Sparkles, 
  User, 
  Shield, 
  ArrowLeft,
  LogOut,
  AlertTriangle 
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState({
    enabled: true,
    dailyReminders: true,
    streakAlerts: true,
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session/tokens from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Redirect to login or welcome screen
    navigate('/login'); // Change to your login route if different (e.g. '/auth' or '/')
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 pt-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-semibold mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Settings
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your preferences and account settings
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 mb-6 flex gap-2 shadow-xs">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'notifications' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ai' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'account' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" /> Account
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'privacy' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" /> Privacy
          </button>
        </div>

        {/* Settings Content Card */}
        {activeTab === 'notifications' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Enable Notifications</h4>
                <p className="text-xs text-slate-500 mt-0.5">Receive notifications for habit reminders and updates</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.enabled}
                onChange={() => setNotifications({...notifications, enabled: !notifications.enabled})}
                className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Daily Reminders</h4>
                <p className="text-xs text-slate-500 mt-0.5">Get reminded about your daily habits</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.dailyReminders}
                onChange={() => setNotifications({...notifications, dailyReminders: !notifications.dailyReminders})}
                className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Streak Alerts</h4>
                <p className="text-xs text-slate-500 mt-0.5">Get notified when you're about to lose a streak</p>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.streakAlerts}
                onChange={() => setNotifications({...notifications, streakAlerts: !notifications.streakAlerts})}
                className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-2">AI Insights Preferences</h3>
            <p className="text-xs text-slate-500 mb-4">Configure how our AI analyzes your habit data to give you personalized recommendations.</p>
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-900 text-xs font-medium">
              ✨ AI features are currently active and optimizing your weekly logs.
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 mb-1">Account Management</h3>
              <p className="text-xs text-slate-500">Manage your session, credentials, and data preferences.</p>
            </div>

            {/* Logout Section */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Sign Out</h4>
                <p className="text-xs text-slate-500 mt-0.5">Log out of your HabitTrack account on this device</p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>

            {/* Deactivate Section */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-rose-600">Deactivate Account</h4>
                <p className="text-xs text-slate-500 mt-0.5">Permanently remove your account and habit logs</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                <AlertTriangle className="w-4 h-4" /> Deactivate
              </button>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-2">Privacy & Data</h3>
            <p className="text-xs text-slate-500">Your habit metrics are encrypted and stored securely.</p>
          </div>
        )}
      </main>
    </div>
  );
}