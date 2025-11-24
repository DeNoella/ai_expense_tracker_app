'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { aiAPI, chatAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  response: string;
  created_at: string;
}

export default function AIChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchChatHistory();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      const response = await chatAPI.getHistory(50);
      setMessages(response.data.history || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to UI immediately
    const tempId = Date.now().toString();
    const userMsg: Message = {
      id: tempId,
      message: userMessage,
      response: '',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await aiAPI.analyze(userMessage);
      const aiResponse = response.data.response;

      // Update the message with AI response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, response: aiResponse }
            : msg
        )
      );
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, response: 'Sorry, I encountered an error. Please try again.' }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all chat history?')) return;
    try {
      await chatAPI.clearHistory();
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const suggestedQuestions = [
    'How much did I spend on food this month?',
    'Am I on track with my budget?',
    'What category am I spending the most on?',
    'Predict next month\'s spending',
    'Give me cost-saving recommendations',
  ];

  if (loadingHistory) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              <span>AI Assistant</span>
            </h1>
            <p className="text-gray-600 mt-1">Ask questions about your expenses and get smart insights</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Try asking:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-left px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-blue-200 hover:border-blue-300"
                >
                  <p className="text-sm text-gray-700">{question}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start a conversation</h3>
                <p className="text-gray-600 max-w-md">
                  Ask me anything about your expenses, budget, or spending patterns. I'm here to help!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-4">
                  {/* User Message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-lg p-4">
                      <p className="text-gray-900">{msg.message}</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  {msg.response && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-wrap">{msg.response}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSend} className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your expenses..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

