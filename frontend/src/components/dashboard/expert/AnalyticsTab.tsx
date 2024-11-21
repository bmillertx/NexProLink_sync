import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  earnings: {
    total: number;
    change: number;
    data: number[];
  };
  clients: {
    total: number;
    change: number;
    data: number[];
  };
  hours: {
    total: number;
    change: number;
    data: number[];
  };
  rating: {
    current: number;
    change: number;
    data: number[];
  };
}

export default function AnalyticsTab() {
  const { isDarkMode } = useTheme();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    earnings: { total: 0, change: 0, data: [] },
    clients: { total: 0, change: 0, data: [] },
    hours: { total: 0, change: 0, data: [] },
    rating: { current: 0, change: 0, data: [] },
  });

  useEffect(() => {
    // In a real app, fetch analytics data from your backend
    const mockData: AnalyticsData = {
      earnings: {
        total: 2500,
        change: 15,
        data: [1200, 1500, 1800, 2100, 2500],
      },
      clients: {
        total: 15,
        change: 20,
        data: [8, 10, 12, 13, 15],
      },
      hours: {
        total: 25,
        change: 10,
        data: [15, 18, 20, 22, 25],
      },
      rating: {
        current: 4.8,
        change: 5,
        data: [4.5, 4.6, 4.7, 4.7, 4.8],
      },
    };

    setAnalytics(mockData);
  }, [timeframe]);

  const renderChart = (data: number[], label: string) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    return (
      <div className="h-24 flex items-end space-x-2">
        {data.map((value, index) => {
          const height = range === 0 ? 100 : ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center"
            >
              <div
                style={{ height: `${height}%` }}
                className={`w-full rounded-t ${
                  isDarkMode ? 'bg-blue-500' : 'bg-blue-400'
                }`}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    data,
    format = (v: number) => v.toString(),
  }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    data: number[];
    format?: (value: number) => string;
  }) => (
    <div
      className={`rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon
            className={`h-6 w-6 mr-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <h3
            className={`text-lg font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h3>
        </div>
        <div className="flex items-center">
          {change >= 0 ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span
            className={`text-sm font-medium ${
              change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {Math.abs(change)}%
          </span>
        </div>
      </div>
      <div className="mb-4">
        <span
          className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {format(value)}
        </span>
      </div>
      {renderChart(data, title)}
    </div>
  );

  return (
    <div className="p-6">
      {/* Timeframe Selector */}
      <div className="mb-6 flex space-x-4">
        {(['week', 'month', 'year'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeframe === t
                ? `${
                    isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700'
                  }`
                : `${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard
          title="Earnings"
          value={analytics.earnings.total}
          change={analytics.earnings.change}
          icon={CurrencyDollarIcon}
          data={analytics.earnings.data}
          format={(v) => `$${v}`}
        />
        <StatCard
          title="Clients"
          value={analytics.clients.total}
          change={analytics.clients.change}
          icon={UserGroupIcon}
          data={analytics.clients.data}
        />
        <StatCard
          title="Hours"
          value={analytics.hours.total}
          change={analytics.hours.change}
          icon={ClockIcon}
          data={analytics.hours.data}
        />
        <StatCard
          title="Rating"
          value={analytics.rating.current}
          change={analytics.rating.change}
          icon={StarIcon}
          data={analytics.rating.data}
          format={(v) => v.toFixed(1)}
        />
      </div>
    </div>
  );
}
