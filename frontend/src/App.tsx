import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Shell from './layouts/Shell';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AddTx } from './pages/AddTx';
import { Transactions } from './pages/Transactions';
import { Accounts } from './pages/Accounts';
import { Calendar } from './pages/Calendar';
import { Analytics } from './pages/Analytics';
import { More } from './pages/More';
import { useAuth } from './stores/auth';

function Guard({ children }: { children: JSX.Element }) {
  const { token, hydrate } = useAuth();
  useEffect(() => { hydrate(); }, []);
  if (!token && !localStorage.getItem('sb_token')) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route element={<Guard><Shell /></Guard>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTx />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/more" element={<More />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
