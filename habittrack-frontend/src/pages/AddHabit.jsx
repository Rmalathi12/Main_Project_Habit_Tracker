import React from 'react';
import { useNavigate } from 'react-router-dom';
import HabitForm from '../components/HabitForm';
import API from '../services/api';

const AddHabit = () => {
  const navigate = useNavigate();

  // Send new habit payload to backend API
  const handleAddHabit = async (habitData) => {
    try {
      await API.post('/habits', habitData);
      navigate('/');
    } catch (err) {
      console.error('Error creating habit:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Add New Habit</h2>
      <HabitForm onSubmit={handleAddHabit} />
    </div>
  );
};

export default AddHabit;