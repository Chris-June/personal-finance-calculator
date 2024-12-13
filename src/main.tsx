import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider } from '@/components/theme-provider';
import { ChatProvider } from '@/lib/chat-context';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JotaiProvider>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <ChatProvider>
          <App />
        </ChatProvider>
      </ThemeProvider>
    </JotaiProvider>
  </StrictMode>
);
