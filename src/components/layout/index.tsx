import { useState } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  // Get calculator type from current route
  const getCalculatorType = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'General';
    return path.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <ChatSidebar
          calculatorType={getCalculatorType()}
          calculatorData={{}} // This will be updated by individual calculators
          isOpen={isChatOpen}
        />
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
      <Footer />
    </div>
  );
}