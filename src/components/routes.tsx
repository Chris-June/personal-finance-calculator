import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { Home } from '@/pages/home';
import { NetWorth } from '@/pages/net-worth';
import { Budget } from '@/pages/budget';
import { Loan } from '@/pages/loan';
import { Retirement } from '@/pages/retirement';
import { Investment } from '@/pages/investment';
import { Debt } from '@/pages/debt';
import { About } from '@/pages/about';
import { Privacy } from '@/pages/privacy';
import { SignIn } from '@/pages/auth/signin';
import { SignUp } from '@/pages/auth/signup';
import { ProtectedRoute } from '@/lib/auth';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route 
        path="/net-worth" 
        element={
          <ProtectedRoute>
            <NetWorth />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/budget" 
        element={
          <ProtectedRoute>
            <Budget />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/loan" 
        element={
          <ProtectedRoute>
            <Loan />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/retirement" 
        element={
          <ProtectedRoute>
            <Retirement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/investment" 
        element={
          <ProtectedRoute>
            <Investment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/debt" 
        element={
          <ProtectedRoute>
            <Debt />
          </ProtectedRoute>
        } 
      />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
    </RouterRoutes>
  );
}