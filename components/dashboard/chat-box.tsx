'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Mock data for initial messages
const initialMessages = [
  {
    id: '1',
    sender: 'Mission Control',
    content: 'All systems go for today\'s launch. Weather conditions are ideal.',
    timestamp: '10:15 AM',
    isUser: false
  },
  {
    id: '2',
    sender: 'Jane Smith',
    content: 'Any updates on the payload deployment schedule?',
    timestamp: '10:17 AM',
    isUser: true
  },
  {
    id: '3',
    sender: 'Mission Control',
    content: 'Payload deployment is scheduled for T+45 minutes after launch.',
    timestamp: '10:18 AM',
    isUser: false
  }
];

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage.trim(),
      timestamp: timeString,
      isUser: true
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate response after 1 second
    setTimeout(() => {
      const responses = [
        'Received your message. Stand by for further updates.',
        'Roger that. Information has been relayed to the team.',
        'Copy. We\'ll look into that and get back to you.',
        'Understood. Mission Control is processing your request.'
      ];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'Mission Control',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: `${formattedHours}:${formattedMinutes} ${ampm}`,
        isUser: false
      };
      
      setMessages(prevMessages => [...prevMessages, responseMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card variant="bordered" className="overflow-hidden h-[493px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 px-5 border-b border-[#1a1a1a]">
        <CardTitle className="text-sm font-medium text-[#f5f5f5]">Communications Channel</CardTitle>
        <div className="flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1.5" />
          <span className="text-xs text-[#a3a3a3]">Online</span>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-y-auto">
        <div className="p-4 space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  message.isUser 
                    ? 'bg-[#ff6b00]/10 text-[#f5f5f5]' 
                    : 'bg-[#1a1a1a] text-[#e0e0e0]'
                }`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-medium">
                    {message.sender}
                  </span>
                  <span className="text-xs text-[#a3a3a3] ml-2">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="flex w-full">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-[#121212] border-[#2a2a2a] rounded-r-none"
          />
          <Button 
            type="button"
            onClick={handleSendMessage} 
            className="bg-[#ff6b00] hover:bg-[#ff6b00]/80 text-white rounded-l-none"
          >
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 