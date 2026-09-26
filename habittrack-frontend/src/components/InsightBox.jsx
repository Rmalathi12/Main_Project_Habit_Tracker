import React from 'react';

const InsightBox = ({ insightText }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 p-5 rounded-2xl shadow-sm mb-6">
      <h3 className="text-indigo-900 font-bold flex items-center gap-2 mb-1">
        <span>🤖</span> AI Productivity Insights
      </h3>
      <p className="text-slate-700 text-sm leading-relaxed">{insightText}</p>
    </div>
  );
};

export default InsightBox;