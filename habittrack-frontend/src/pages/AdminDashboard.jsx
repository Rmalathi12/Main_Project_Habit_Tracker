import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all users on component load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/users');
        setUsers(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Not authorized as admin or failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/users/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-600 font-medium">Loading admin panel...</div>;
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-6 rounded-2xl max-w-md text-center shadow-sm">
          <h3 className="font-bold text-lg mb-2">Access Denied</h3>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Control Panel</h1>
          <p className="text-sm text-slate-500">Manage registered platform users and accounts</p>
        </div>
        <span className="bg-indigo-100 text-indigo-700 font-semibold text-xs px-3 py-1.5 rounded-full">
          Total Users: {users.length}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">{user.name}</td>
                  <td className="py-4 px-6 text-slate-500">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-rose-600 hover:text-rose-800 font-medium text-xs bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;