'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Stats {
  timestamp: string;
  requests: {
    total: number;
    dailyCost: number;
    costLimit: number;
    activeIPs: number;
    ipDetails: Array<{
      ip: string;
      minuteCount: number;
      hourCount: number;
      minuteRemaining: number;
      hourRemaining: number;
    }>;
  };
  feedback: {
    total: number;
    helpful: number;
    notHelpful: number;
    recent: Array<{
      messageId: string;
      feedback: string;
      content: string;
      timestamp: string;
      ip: string;
    }>;
  };
  shares: {
    total: number;
    recent: Array<{
      id: string;
      messageCount: number;
      createdAt: string;
    }>;
  };
  system: {
    apiKeyConfigured: boolean;
    environment: string;
  };
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const savedPassword = localStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
      fetchStats(savedPassword);
    }
  }, []);

  useEffect(() => {
    // Auto-refresh every 10 seconds when authenticated
    if (isAuthenticated && password) {
      fetchStats(password);
      const interval = setInterval(() => fetchStats(password), 10000);
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isAuthenticated, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await fetchStats(password);
    if (success) {
      localStorage.setItem('adminPassword', password);
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  const fetchStats = async (pwd: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${pwd}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid password');
          setIsAuthenticated(false);
          localStorage.removeItem('adminPassword');
          return false;
        }
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to load stats');
      console.error('Error fetching stats:', err);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    setIsAuthenticated(false);
    setPassword('');
    setStats(null);
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter the admin password to continue
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              CarMatch AI Admin Dashboard
            </h1>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {formatDate(stats.timestamp)}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  API Status
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {stats.system.apiKeyConfigured ? (
                    <span className="text-green-600">Configured</span>
                  ) : (
                    <span className="text-red-600">Not Configured</span>
                  )}
                </dd>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Environment
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {stats.system.environment}
                </dd>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Daily Cost
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(stats.requests.dailyCost)}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    / {formatCurrency(stats.requests.costLimit)}
                  </span>
                </dd>
              </div>
            </div>
          </div>

          {/* Request Stats */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Request Statistics
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Requests (Hour)
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.requests.total}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Active IPs
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.requests.activeIPs}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cost per Request
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(0.002)}
                  </dd>
                </div>
              </dl>

              {stats.requests.ipDetails.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Top Active IPs
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            IP Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Minute (Used/Remaining)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Hour (Used/Remaining)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {stats.requests.ipDetails.map((ip) => (
                          <tr key={ip.ip}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {ip.ip}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {ip.minuteCount}/{ip.minuteRemaining}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {ip.hourCount}/{ip.hourRemaining}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feedback Stats */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Feedback Statistics
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Feedback
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.feedback.total}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Helpful
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-green-600">
                    {stats.feedback.helpful}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Not Helpful
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-red-600">
                    {stats.feedback.notHelpful}
                  </dd>
                </div>
              </dl>

              {stats.feedback.recent.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Recent Feedback
                  </h4>
                  <div className="space-y-2">
                    {stats.feedback.recent.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.content}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDate(item.timestamp)} - {item.ip}
                            </p>
                          </div>
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${
                            item.feedback === 'helpful' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {item.feedback}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share Stats */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Share Statistics
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Shares
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {stats.shares.total}
                  </dd>
                </div>
              </dl>

              {stats.shares.recent.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Recent Shares
                  </h4>
                  <div className="space-y-2">
                    {stats.shares.recent.map((share) => (
                      <div key={share.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div>
                          <a 
                            href={`/share/${share.id}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {share.id}
                          </a>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(share.createdAt)}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {share.messageCount} messages
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}