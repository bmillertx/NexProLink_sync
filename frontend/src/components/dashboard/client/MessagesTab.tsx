import { useState } from 'react';
import { format } from 'date-fns';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/utils/styles';

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
          unread: true,
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

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMsg] }
          : conv
      )
    );

    setNewMessage('');
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={classNames(
                'p-4 cursor-pointer hover:bg-gray-50',
                selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
              )}
            >
              <div className="flex items-center space-x-3">
                {conversation.avatar ? (
                  <img
                    src={conversation.avatar}
                    alt={conversation.with}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {conversation.with}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.messages[conversation.messages.length - 1].preview}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">
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
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {selectedConversation.avatar ? (
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.with}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedConversation.with}
                  </h2>
                  <p className="text-sm text-gray-500">Online</p>
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
                      'max-w-[70%] rounded-lg p-3',
                      message.from === 'You'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    <p>{message.fullMessage || message.preview}</p>
                    <p
                      className={classNames(
                        'text-xs mt-1',
                        message.from === 'You' ? 'text-blue-100' : 'text-gray-500'
                      )}
                    >
                      {format(message.timestamp, 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="inline-flex items-center justify-center p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
