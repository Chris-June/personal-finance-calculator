import { useState } from 'react';
import { CalculatorNav } from './calculator-nav';
import { ChatSidebar } from '../chat/chat-sidebar';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface CalculatorLayoutProps {
  children: React.ReactNode;
}

export function CalculatorLayout({ children }: CalculatorLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  
  // Extract calculator type from the current path
  const calculatorType = location.pathname.split('/')[1] || 'default';

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <CalculatorNav />
        <main className="flex-1 container mx-auto py-6">
          {children}
        </main>
      </div>

      {/* Chat Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <MessageSquare className={`h-5 w-5 transition-transform ${isChatOpen ? 'rotate-0' : '-rotate-90'}`} />
        <span className="sr-only">Toggle chat</span>
      </Button>

      {/* Chat Sidebar */}
      <ChatSidebar 
        calculatorType={calculatorType}
        isOpen={isChatOpen}
      />
    </div>
  );
}
