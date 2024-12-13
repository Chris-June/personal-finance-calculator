import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  calculatorData: Record<string, any>;
  setCalculatorData: (data: Record<string, any>) => void;
  chatHistory: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [calculatorData, setCalculatorData] = useState<Record<string, any>>({});
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const addMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        calculatorData, 
        setCalculatorData, 
        chatHistory, 
        addMessage 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}