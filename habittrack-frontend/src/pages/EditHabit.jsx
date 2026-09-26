import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import HabitForm from '../components/HabitForm';
import API from '../services/api';

const EditHabit = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const habit = location.state?.habit || { title: '', frequency: 'daily', goal: '' };

  // Send updated habit changes to backend API
  const handleUpdateHabit = async (updatedData) => {
    try {
      await API.put(`/habits/${id}`, updatedData);
      navigate('/');
    } catch (err) {
      console.error('Error updating habit:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Edit Habit</h2>
      <HabitForm initialData={habit} onSubmit={handleUpdateHabit} />
    </div>
  );
};

export default EditHabit;