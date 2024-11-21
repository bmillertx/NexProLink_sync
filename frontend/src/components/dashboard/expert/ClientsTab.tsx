import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  UserCircleIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedDate: Date;
  lastSession: Date;
  totalSessions: number;
  rating: number;
  status: 'active' | 'inactive';
  notes?: string;
}

export default function ClientsTab() {
  const { isDarkMode } = useTheme();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    // In a real app, fetch clients from your backend
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        joinedDate: new Date(2023, 6, 15),
        lastSession: new Date(2024, 0, 10),
        totalSessions: 8,
        rating: 4.8,
        status: 'active',
        notes: 'Career transition coaching, focused on tech industry',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 987-6543',
        joinedDate: new Date(2023, 8, 20),
        lastSession: new Date(2024, 0, 15),
        totalSessions: 5,
        rating: 4.5,
        status: 'active',
        notes: 'Leadership development program',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        joinedDate: new Date(2023, 5, 1),
        lastSession: new Date(2023, 11, 1),
        totalSessions: 3,
        rating: 4.0,
        status: 'inactive',
        notes: 'Personal development coaching',
      },
    ];

    setClients(mockClients);
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || client.status === filter;
    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? isDarkMode
              ? 'text-yellow-400'
              : 'text-yellow-500'
            : isDarkMode
            ? 'text-gray-600'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="p-6">
      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div
          className={`flex items-center px-4 py-2 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow`}
        >
          <MagnifyingGlassIcon
            className={`h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`ml-2 flex-1 bg-transparent border-none focus:outline-none ${
              isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <div className="flex space-x-4">
          {(['all', 'active', 'inactive'] as const).map((status) => (
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
      </div>

      {/* Clients List */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => setSelectedClient(client)}
            className={`rounded-lg p-6 cursor-pointer ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <UserCircleIcon
                  className={`h-12 w-12 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <div className="ml-4">
                  <h3
                    className={`text-lg font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {client.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {client.email}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <CalendarIcon
                  className={`h-5 w-5 mr-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Last Session: {format(client.lastSession, 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon
                  className={`h-5 w-5 mr-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {client.totalSessions} Sessions
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {renderStars(client.rating)}
                <span
                  className={`ml-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {client.rating.toFixed(1)}
                </span>
              </div>
              <span
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Member since {format(client.joinedDate, 'MMM yyyy')}
              </span>
            </div>

            {client.notes && (
              <p
                className={`mt-4 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {client.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div
          className={`text-center py-12 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <UserCircleIcon className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">No clients found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
