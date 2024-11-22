import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  CurrencyDollarIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BanknotesIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface Payment {
  id: string;
  clientName: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  type: 'session' | 'package' | 'consultation';
  method: 'credit_card' | 'bank_transfer';
  transactionId: string;
}

interface PaymentStats {
  totalEarnings: number;
  pendingPayments: number;
  lastMonthEarnings: number;
  earningsChange: number;
}

export default function PaymentsTab() {
  const { isDarkMode } = useTheme();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalEarnings: 0,
    pendingPayments: 0,
    lastMonthEarnings: 0,
    earningsChange: 0,
  });
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>(
    'all'
  );

  useEffect(() => {
    // In a real app, fetch payments data from your backend
    const mockPayments: Payment[] = [
      {
        id: '1',
        clientName: 'John Doe',
        amount: 150,
        date: new Date(2024, 0, 15),
        status: 'completed',
        type: 'session',
        method: 'credit_card',
        transactionId: 'txn_123456',
      },
      {
        id: '2',
        clientName: 'Jane Smith',
        amount: 500,
        date: new Date(2024, 0, 10),
        status: 'pending',
        type: 'package',
        method: 'bank_transfer',
        transactionId: 'txn_789012',
      },
      {
        id: '3',
        clientName: 'Mike Johnson',
        amount: 75,
        date: new Date(2024, 0, 5),
        status: 'failed',
        type: 'consultation',
        method: 'credit_card',
        transactionId: 'txn_345678',
      },
    ];

    const mockStats: PaymentStats = {
      totalEarnings: 2500,
      pendingPayments: 750,
      lastMonthEarnings: 2200,
      earningsChange: 13.6,
    };

    setPayments(mockPayments);
    setStats(mockStats);
  }, []);

  const filteredPayments = payments.filter(
    (payment) => filter === 'all' || payment.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return isDarkMode
          ? 'bg-green-900 text-green-200'
          : 'bg-green-100 text-green-800';
      case 'pending':
        return isDarkMode
          ? 'bg-yellow-900 text-yellow-200'
          : 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return isDarkMode
          ? 'bg-red-900 text-red-200'
          : 'bg-red-100 text-red-800';
      default:
        return isDarkMode
          ? 'bg-gray-700 text-gray-200'
          : 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Earnings */}
        <div
          className={`rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CurrencyDollarIcon
                className={`h-6 w-6 mr-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <h3
                className={`text-lg font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Total Earnings
              </h3>
            </div>
            <div className="flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-500">
                {stats.earningsChange}%
              </span>
            </div>
          </div>
          <p
            className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            ${stats.totalEarnings}
          </p>
        </div>

        {/* Pending Payments */}
        <div
          className={`rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow p-6`}
        >
          <div className="flex items-center mb-4">
            <ClockIcon
              className={`h-6 w-6 mr-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <h3
              className={`text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Pending Payments
            </h3>
          </div>
          <p
            className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            ${stats.pendingPayments}
          </p>
        </div>

        {/* Last Month */}
        <div
          className={`rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow p-6`}
        >
          <div className="flex items-center mb-4">
            <BanknotesIcon
              className={`h-6 w-6 mr-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <h3
              className={`text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Last Month
            </h3>
          </div>
          <p
            className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            ${stats.lastMonthEarnings}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex space-x-4">
        {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === status
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
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className={`rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow p-6`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <h3
                    className={`text-lg font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {payment.clientName}
                  </h3>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CreditCardIcon
                      className={`h-5 w-5 mr-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {payment.method === 'credit_card'
                        ? 'Credit Card'
                        : 'Bank Transfer'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon
                      className={`h-5 w-5 mr-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {format(payment.date, 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Transaction ID: {payment.transactionId}
                </p>
              </div>
              <div className="flex items-center">
                {getStatusIcon(payment.status)}
                <span
                  className={`ml-2 text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  ${payment.amount}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredPayments.length === 0 && (
          <div
            className={`text-center py-12 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <CurrencyDollarIcon className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">No payments found</h3>
            <p>Try adjusting your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
