'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  content: string;
  type: 'text' | 'image' | 'location';
  isRead: boolean;
  createdAt: string;
}

interface Chat {
  _id: string;
  participants: {
    user1: {
      _id: string;
      name: string;
      profilePhoto?: string;
    };
    user2: {
      _id: string;
      name: string;
      profilePhoto?: string;
    };
  };
  jobId?: {
    _id: string;
    title: string;
  };
  lastMessage?: Message;
  unreadCounts: Map<string, number>;
  updatedAt: string;
}

interface ChatContextType {
  socket: Socket | null;
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
  fetchChats: () => Promise<void>;
  fetchChat: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, type?: string) => Promise<void>;
  createChat: (participantId: string, jobId?: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  typing: (chatId: string, isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectSocket = () => {
    if (!token || socket) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      auth: {
        token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    newSocket.on('newMessage', (message: Message) => {
      if (currentChat && currentChat._id === message.chatId) {
        setMessages(prev => [...prev, message]);
      }
      
      // Update chats list
      setChats(prev => prev.map(chat => 
        chat._id === message.chatId 
          ? { ...chat, lastMessage: message, updatedAt: message.createdAt }
          : chat
      ));
    });

    newSocket.on('unreadCountUpdate', ({ chatId, unreadCount }: { chatId: string; unreadCount: number }) => {
      setChats(prev => prev.map(chat => 
        chat._id === chatId 
          ? { ...chat, unreadCounts: new Map(chat.unreadCounts).set(chat.participants.user1._id, unreadCount) }
          : chat
      ));
    });

    newSocket.on('messagesRead', ({ chatId }: { chatId: string }) => {
      if (currentChat && currentChat._id === chatId) {
        setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
      }
    });

    newSocket.on('userTyping', ({ chatId, userId, isTyping }: { chatId: string; userId: string; isTyping: boolean }) => {
      // Handle typing indicators
      console.log(`User ${userId} is ${isTyping ? 'typing' : 'not typing'} in chat ${chatId}`);
    });

    newSocket.on('error', (errorMessage: string) => {
      setError(errorMessage);
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat');
      setChats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchChat = async (chatId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/chat/${chatId}`);
      setCurrentChat(response.data);
      setMessages(response.data.messages || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch chat');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (chatId: string, content: string, type = 'text') => {
    if (!socket) {
      setError('Not connected to chat server');
      return;
    }

    try {
      socket.emit('sendMessage', { chatId, content, type });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const createChat = async (participantId: string, jobId?: string) => {
    try {
      setLoading(true);
      const response = await api.post('/chat', { participantId, jobId });
      const newChat = response.data;
      setChats(prev => [newChat, ...prev]);
      return newChat;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create chat');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (chatId: string) => {
    if (!socket) {
      setError('Not connected to chat server');
      return;
    }

    try {
      socket.emit('markAsRead', chatId);
      await api.put(`/chat/${chatId}/read`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark messages as read');
    }
  };

  const joinChat = (chatId: string) => {
    if (socket) {
      socket.emit('joinChat', chatId);
    }
  };

  const leaveChat = (chatId: string) => {
    if (socket) {
      socket.emit('leaveChat', chatId);
    }
  };

  const typing = (chatId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { chatId, isTyping });
    }
  };

  useEffect(() => {
    if (user && token) {
      connectSocket();
      fetchChats();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, token]);

  const value: ChatContextType = {
    socket,
    chats,
    currentChat,
    messages,
    loading,
    error,
    connectSocket,
    disconnectSocket,
    fetchChats,
    fetchChat,
    sendMessage,
    createChat,
    markAsRead,
    joinChat,
    leaveChat,
    typing
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
