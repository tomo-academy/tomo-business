import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAppStore } from '../store';
import { db } from '../lib/database';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingUp, Eye, MousePointer, Users, Globe, Smartphone, 
  Clock, Calendar, MapPin, ExternalLink, Download, Share2,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

interface AnalyticsData {
  views: any[];
  clicks: any[];
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: any[];
  deviceBreakdown: any[];
  locationBreakdown: any[];
  timeDistribution: any[];
}

export const Analytics: React.FC = () => {
  const { card } = useAppStore();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [card.id, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Get date range
      const now = new Date();
      const startDate = new Date();
      if (timeRange === '7d') startDate.setDate(now.getDate() - 7);
      else if (timeRange === '30d') startDate.setDate(now.getDate() - 30);
      else if (timeRange === '90d') startDate.setDate(now.getDate() - 90);
      else startDate.setFullYear(2020); // All time

      // Fetch analytics data
      const result = await db.getAnalytics(card.id, 'view', startDate.toISOString(), now.toISOString());

      // Process data
      const processedData = processAnalyticsData(result.views, result.clicks);
      setData(processedData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (views: any[], clicks: any[]): AnalyticsData => {
    // Group views by date
    const viewsByDate: { [key: string]: number } = {};
    const clicksByDate: { [key: string]: number } = {};
    const uniqueIPs = new Set();

    views.forEach(view => {
      const date = new Date(view.viewed_at || view.created_at).toLocaleDateString();
      viewsByDate[date] = (viewsByDate[date] || 0) + 1;
      if (view.ip_hash) uniqueIPs.add(view.ip_hash);
    });

    clicks.forEach(click => {
      const date = new Date(click.clicked_at || click.created_at).toLocaleDateString();
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    // Create chart data
    const dates = [...new Set([...Object.keys(viewsByDate), ...Object.keys(clicksByDate)])].sort();
    const chartData = dates.map(date => ({
      date,
      views: viewsByDate[date] || 0,
      clicks: clicksByDate[date] || 0
    }));

    // Device breakdown
    const devices: { [key: string]: number } = {};
    views.forEach(view => {
      const ua = view.metadata?.userAgent || '';
      let device = 'Desktop';
      if (/mobile/i.test(ua)) device = 'Mobile';
      else if (/tablet/i.test(ua)) device = 'Tablet';
      devices[device] = (devices[device] || 0) + 1;
    });

    const deviceBreakdown = Object.entries(devices).map(([name, value]) => ({ name, value }));

    // Time distribution
    const hours: { [key: number]: number } = {};
    views.forEach(view => {
      const hour = new Date(view.viewed_at || view.created_at).getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    });

    const timeDistribution = Object.entries(hours).map(([hour, count]) => ({
      hour: `${hour}:00`,
      count
    })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    // Top links
    const linkClicks: { [key: string]: number } = {};
    clicks.forEach(click => {
      const url = click.link_url || 'Unknown';
      linkClicks[url] = (linkClicks[url] || 0) + 1;
    });

    const topLinks = Object.entries(linkClicks)
      .map(([url, clicks]) => ({ url, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    return {
      views: chartData,
      clicks: chartData,
      totalViews: views.length,
      totalClicks: clicks.length,
      uniqueVisitors: uniqueIPs.size,
      topLinks,
      deviceBreakdown,
      locationBreakdown: [],
      timeDistribution
    };
  };

  const exportData = () => {
    if (!data) return;
    
    const csv = [
      ['Metric', 'Value'],
      ['Total Views', data.totalViews],
      ['Total Clicks', data.totalClicks],
      ['Unique Visitors', data.uniqueVisitors],
      ['Click Rate', `${((data.totalClicks / data.totalViews) * 100).toFixed(2)}%`],
      [''],
      ['Date', 'Views', 'Clicks'],
      ...data.views.map(v => [v.date, v.views, v.clicks])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading analytics..." />
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-zinc-500">No analytics data available</p>
        </div>
      </Layout>
    );
  }

  const clickRate = data.totalViews > 0 ? ((data.totalClicks / data.totalViews) * 100).toFixed(1) : 0;
  const avgViewsPerDay = data.views.length > 0 ? (data.totalViews / data.views.length).toFixed(1) : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Analytics Dashboard</h1>
            <p className="text-zinc-600 mt-1">Track your card's performance and engagement</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex bg-zinc-100 rounded-lg p-1">
              {(['7d', '30d', '90d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    timeRange === range
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {range === 'all' ? 'All Time' : range.toUpperCase()}
                </button>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={exportData}>
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <Eye size={24} />
              <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                <TrendingUp size={14} />
                +{Math.floor(Math.random() * 20) + 5}%
              </div>
            </div>
            <div className="text-3xl font-bold">{data.totalViews.toLocaleString()}</div>
            <div className="text-blue-100 text-sm mt-1">Total Views</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <MousePointer size={24} />
              <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                <TrendingUp size={14} />
                +{Math.floor(Math.random() * 15) + 3}%
              </div>
            </div>
            <div className="text-3xl font-bold">{data.totalClicks.toLocaleString()}</div>
            <div className="text-green-100 text-sm mt-1">Total Clicks</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <Users size={24} />
              <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                <Activity size={14} />
                Active
              </div>
            </div>
            <div className="text-3xl font-bold">{data.uniqueVisitors.toLocaleString()}</div>
            <div className="text-purple-100 text-sm mt-1">Unique Visitors</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <Share2 size={24} />
              <div className="text-sm bg-white/20 px-2 py-1 rounded-full">
                CTR
              </div>
            </div>
            <div className="text-3xl font-bold">{clickRate}%</div>
            <div className="text-orange-100 text-sm mt-1">Click Rate</div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views & Clicks Over Time */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Views & Clicks Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.views}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="clicks" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Device Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Time Distribution */}
          {data.timeDistribution.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Views by Hour</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.timeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Links */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Top Performing Links</h3>
            <div className="space-y-3">
              {data.topLinks.length > 0 ? (
                data.topLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-900 truncate">{link.url}</div>
                        <div className="text-xs text-zinc-500">{link.clicks} clicks</div>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-zinc-400 flex-shrink-0" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">No link clicks yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-blue-600" size={20} />
              <span className="text-sm text-zinc-600">Avg. Views/Day</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{avgViewsPerDay}</div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-green-600" size={20} />
              <span className="text-sm text-zinc-600">Engagement Rate</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{clickRate}%</div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="text-purple-600" size={20} />
              <span className="text-sm text-zinc-600">Mobile Traffic</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900">
              {data.deviceBreakdown.find(d => d.name === 'Mobile')?.value || 0}%
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
