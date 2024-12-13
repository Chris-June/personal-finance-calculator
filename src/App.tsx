import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from '@/components/layout';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/lib/auth';
import { Dashboard } from '@/components/dashboard';

// Calculator Pages
import { NetWorth } from '@/pages/net-worth';
import { Budget } from '@/pages/budget';
import { Loan } from '@/pages/loan';
import { Retirement } from '@/pages/retirement';
import { Investment } from '@/pages/investment';
import { Debt } from '@/pages/debt';
import { Tax } from '@/pages/tax';

// Static Pages
import { About } from '@/pages/about';
import { Privacy } from '@/pages/privacy';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Calculator Routes */}
          <Route path="/net-worth" element={
            <ProtectedRoute>
              <NetWorth />
            </ProtectedRoute>
          } />
          <Route path="/budget" element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          } />
          <Route path="/loan" element={
            <ProtectedRoute>
              <Loan />
            </ProtectedRoute>
          } />
          <Route path="/retirement" element={
            <ProtectedRoute>
              <Retirement />
            </ProtectedRoute>
          } />
          <Route path="/investment" element={
            <ProtectedRoute>
              <Investment />
            </ProtectedRoute>
          } />
          <Route path="/debt" element={
            <ProtectedRoute>
              <Debt />
            </ProtectedRoute>
          } />
          <Route path="/tax" element={
            <ProtectedRoute>
              <Tax />
            </ProtectedRoute>
          } />

          {/* Static Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;