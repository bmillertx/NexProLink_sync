import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: Date;
  unread: boolean;
  avatar?: string;
}

interface Conversation {
  id: string;
  participantName: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  avatar?: string;
}

export default function MessagesTab() {
  const { isDarkMode } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // In a real app, fetch conversations from your backend
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participantName: 'John Doe',
        lastMessage: 'Looking forward to our next session',
        timestamp: new Date(),
        unreadCount: 2,
      },
      {
        id: '2',
        participantName: 'Jane Smith',
        lastMessage: 'Thank you for the helpful advice',
        timestamp: new Date(Date.now() - 3600000),
        unreadCount: 0,
      },
      {
        id: '3',
        participantName: 'Mike Johnson',
        lastMessage: 'Can we reschedule our appointment?',
        timestamp: new Date(Date.now() - 7200000),
        unreadCount: 1,
      },
    ];

    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // In a real app, fetch messages for the selected conversation from your backend
      const mockMessages: Message[] = [
        {
          id: '1',
          from: 'John Doe',
          content: 'Hi, I have some questions about our upcoming session.',
          timestamp: new Date(Date.now() - 3600000),
          unread: true,
        },
        {
          id: '2',
          from: 'Expert',
          content: 'Of course! What would you like to know?',
          timestamp: new Date(Date.now() - 3500000),
          unread: false,
        },
        {
          id: '3',
          from: 'John Doe',
          content: 'What should I prepare beforehand?',
          timestamp: new Date(Date.now() - 3400000),
          unread: true,
        },
      ];

      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      from: 'Expert',
      content: newMessage,
      timestamp: new Date(),
      unread: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-16rem)]">
      {/* Conversations List */}
      <div
        className={`w-1/3 border-r ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        <div className="p-4">
          <h2
            className={`text-lg font-medium mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Conversations
          </h2>
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full text-left p-3 rounded-lg ${
                  selectedConversation === conversation.id
                    ? isDarkMode
                      ? 'bg-gray-700'
                      : 'bg-blue-50'
                    : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <UserCircleIcon
                      className={`h-10 w-10 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {conversation.participantName}
                      </p>
                      <p
                        className={`text-sm truncate ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {format(conversation.timestamp, 'h:mm a')}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages List */}
            <div
              className={`flex-1 p-4 overflow-y-auto ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.from === 'Expert' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-lg rounded-lg px-4 py-2 ${
                        message.from === 'Expert'
                          ? isDarkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-900'
                          : isDarkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.from === 'Expert'
                            ? isDarkMode
                              ? 'text-blue-200'
                              : 'text-blue-600'
                            : isDarkMode
                            ? 'text-gray-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {format(message.timestamp, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div
              className={`p-4 border-t ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 rounded-lg px-4 py-2 ${
                    isDarkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-100 hover:bg-blue-200'
                  } text-blue-600 font-medium flex items-center space-x-2`}
                >
                  <span>Send</span>
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`flex-1 flex items-center justify-center ${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}
          >
            <div className="text-center">
              <ChatBubbleLeftRightIcon
                className={`h-12 w-12 mx-auto ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`}
              />
              <p
                className={`mt-2 text-lg font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
