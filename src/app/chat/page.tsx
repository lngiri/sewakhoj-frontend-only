'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { LanguageProvider, useLanguage } from '@/components/LanguageSwitch';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ChatContent: React.FC = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { 
    chats, 
    currentChat, 
    messages, 
    loading, 
    error, 
    fetchChat, 
    sendMessage, 
    markAsRead 
  } = useChat();
  
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (selectedChatId) {
      fetchChat(selectedChatId);
      markAsRead(selectedChatId);
    }
  }, [selectedChatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChat) return;

    try {
      await sendMessage(currentChat._id, messageInput.trim());
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getOtherParticipant = (chat: any) => {
    if (!user) return null;
    return chat.participants.user1._id === user.id 
      ? chat.participants.user2 
      : chat.participants.user1;
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = getOtherParticipant(chat);
    if (!otherParticipant) return false;
    return otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const texts = {
    ne: {
      title: 'सन्देश',
      searchChats: 'सन्देशहरू खोज्नुहोस्',
      typeMessage: 'सन्देश टाइप गर्नुहोस्...',
      noChats: 'कुनै सन्देश छैन',
      selectChat: 'सन्देश गर्न कुनै सन्देश छनौट गर्नुहोस्',
      online: 'अनलाइन',
      offline: 'अफलाइन'
    },
    en: {
      title: 'Messages',
      searchChats: 'Search messages...',
      typeMessage: 'Type a message...',
      noChats: 'No messages yet',
      selectChat: 'Select a chat to start messaging',
      online: 'Online',
      offline: 'Offline'
    }
  };

  const t = texts[language];

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-full md:w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t.title}</h2>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.searchChats}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : filteredChats.length > 0 ? (
                  filteredChats.map((chat) => {
                    const otherParticipant = getOtherParticipant(chat);
                    if (!otherParticipant) return null;
                    
                    return (
                      <div
                        key={chat._id}
                        onClick={() => setSelectedChatId(chat._id)}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          selectedChatId === chat._id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {otherParticipant.profilePhoto ? (
                              <img
                                src={otherParticipant.profilePhoto}
                                alt={otherParticipant.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {otherParticipant.name}
                              </p>
                              {chat.lastMessage && (
                                <p className="text-xs text-gray-500">
                                  {formatTime(chat.lastMessage.createdAt)}
                                </p>
                              )}
                            </div>
                            
                            {chat.lastMessage && (
                              <p className="text-sm text-gray-600 truncate">
                                {chat.lastMessage.content}
                              </p>
                            )}
                            
                            {chat.jobId && (
                              <p className="text-xs text-blue-600 mt-1">
                                {chat.jobId.title}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {t.noChats}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="hidden md:flex flex-1 flex-col">
              {currentChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      {(() => {
                        const otherParticipant = getOtherParticipant(currentChat);
                        return otherParticipant ? (
                          <>
                            {otherParticipant.profilePhoto ? (
                              <img
                                src={otherParticipant.profilePhoto}
                                alt={otherParticipant.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{otherParticipant.name}</p>
                              <p className="text-xs text-green-600">{t.online}</p>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.senderId._id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId._id === user.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId._id === user.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={t.typeMessage}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">{t.selectChat}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function ChatPage() {
  return (
    <LanguageProvider>
      <ChatContent />
    </LanguageProvider>
  );
}
