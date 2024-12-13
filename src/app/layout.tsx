import { ThemeProvider } from '@/components/theme-provider';
import { ChatProvider } from '@/lib/chat-context';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/navigation';
import '@/styles/globals.css';

export const metadata = {
  title: 'Intellisync Solutions - Smart Financial Calculator',
  description: 'Comprehensive financial calculator with AI-powered insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-inter min-h-screen bg-background">
        <ThemeProvider
          defaultTheme="system"
          storageKey="intellisync-theme"
        >
          <ChatProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
