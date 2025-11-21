import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { db } from '../lib/database';
import { Users, Calendar, Clock, Activity, TrendingUp, Mail, CreditCard } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface UserData {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_sign_in_at: string;
  card_count: number;
  youtube_card_count: number;
}

export const Admin: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    newThisWeek: 0,
    totalCards: 0
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load all users with their card counts
      const allUsers = await db.getAllUsersAdmin();
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const activeToday = allUsers.filter((u: any) => 
        u.last_sign_in_at && new Date(u.last_sign_in_at) >= today
      ).length;
      
      const newThisWeek = allUsers.filter((u: any) => 
        u.created_at && new Date(u.created_at) >= weekAgo
      ).length;
      
      const totalCards = allUsers.reduce((sum: number, u: any) => sum + (u.card_count || 0), 0);
      
      setStats({
        totalUsers: allUsers.length,
        activeToday,
        newThisWeek,
        totalCards
      });
      
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-500 mt-2">Manage users and monitor platform activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stats.totalUsers}</div>
            <div className="text-sm text-zinc-500 mt-1">Total Users</div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stats.activeToday}</div>
            <div className="text-sm text-zinc-500 mt-1">Active Today</div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stats.newThisWeek}</div>
            <div className="text-sm text-zinc-500 mt-1">New This Week</div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CreditCard className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stats.totalCards}</div>
            <div className="text-sm text-zinc-500 mt-1">Total Cards</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900">All Users</h2>
            <p className="text-sm text-zinc-500 mt-1">Complete user list with activity details</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Cards
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    YT Cards
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900">{user.name || 'User'}</div>
                          <div className="text-xs text-zinc-500">{user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Mail size={14} className="text-zinc-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-zinc-900">{formatDate(user.created_at)}</div>
                      <div className="text-xs text-zinc-500">{getTimeAgo(user.created_at)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-zinc-400" />
                        <div>
                          <div className="text-sm text-zinc-900">{getTimeAgo(user.last_sign_in_at)}</div>
                          {user.last_sign_in_at && (
                            <div className="text-xs text-zinc-500">{formatDate(user.last_sign_in_at)}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {user.card_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        {user.youtube_card_count || 0}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
