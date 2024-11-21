import { useState } from 'react';
import { format } from 'date-fns';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/utils/styles';
import { useTheme } from '@/context/ThemeContext';

interface Message {
  id: string;
  from: string;
  preview: string;
  timestamp: Date;
  unread: boolean;
  avatar?: string;
  fullMessage?: string;
}

interface Conversation {
  id: string;
  with: string;
  messages: Message[];
  avatar?: string;
}

export default function MessagesTab() {
  const { isDarkMode } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      with: 'Dr. Sarah Chen',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      messages: [
        {
          id: '1',
          from: 'Dr. Sarah Chen',
          preview: 'Looking forward to our upcoming session!',
          timestamp: new Date(2024, 1, 14, 15, 30),
          unread: false,
          fullMessage: 'Looking forward to our upcoming session! Please make sure to review the materials I sent earlier.',
        },
        {
          id: '2',
          from: 'You',
          preview: 'Thank you, I will prepare accordingly.',
          timestamp: new Date(2024, 1, 14, 15, 35),
          unread: false,
        },
      ],
    },
    {
      id: '2',
      with: 'Robert Mitchell',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      messages: [
        {
          id: '3',
          from: 'Robert Mitchell',
          preview: 'Here are the financial planning documents we discussed',
          timestamp: new Date(2024, 1, 13, 10, 0),
          unread: false,
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      from: 'You',
      preview: newMessage,
      timestamp: new Date(),
      unread: false,
    };

    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
    };

    setSelectedConversation(updatedConversation);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id ? updatedConversation : conv
      )
    );

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    // Mark all messages in the conversation as read
    const updatedConversation = {
      ...conversation,
      messages: conversation.messages.map((msg) => ({ ...msg, unread: false })),
    };

    // Update both states
    setSelectedConversation(updatedConversation);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? updatedConversation : conv
      )
    );
  };

  return (
    <div className={`flex flex-col lg:flex-row h-[600px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
      {/* Conversations List */}
      <div className={`w-full lg:w-1/3 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className={classNames(
                'p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
                selectedConversation?.id === conversation.id
                  ? 'bg-blue-50 dark:bg-gray-700'
                  : ''
              )}
            >
              <div className="flex items-start space-x-3">
                {conversation.avatar ? (
                  <img
                    src={conversation.avatar}
                    alt={conversation.with}
                    className="h-10 w-10 rounded-full flex-shrink-0"
                  />
                ) : (
                  <UserCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                    {conversation.with}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                    {conversation.messages[conversation.messages.length - 1].preview}
                  </p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} whitespace-nowrap`}>
                    {format(
                      conversation.messages[conversation.messages.length - 1].timestamp,
                      'MMM d'
                    )}
                  </span>
                  {conversation.messages.some((m) => m.unread && m.from !== 'You') && (
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                      {
                        conversation.messages.filter(
                          (m) => m.unread && m.from !== 'You'
                        ).length
                      }
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3">
                {selectedConversation.avatar ? (
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.with}
                    className="h-10 w-10 rounded-full flex-shrink-0"
                  />
                ) : (
                  <UserCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                    {selectedConversation.with}
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={classNames(
                    'flex',
                    message.from === 'You' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={classNames(
                      'max-w-[85%] lg:max-w-[70%] rounded-lg p-3 break-words',
                      message.from === 'You'
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.fullMessage || message.preview}</p>
                    <p
                      className={classNames(
                        'text-xs mt-1',
                        message.from === 'You'
                          ? 'text-blue-100'
                          : isDarkMode
                            ? 'text-gray-400'
                            : 'text-gray-500'
                      )}
                    >
                      {format(message.timestamp, 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full px-4 py-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={classNames(
                    'inline-flex items-center justify-center p-3 rounded-full text-white transition-colors',
                    newMessage.trim()
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : isDarkMode
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-gray-300 cursor-not-allowed'
                  )}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
