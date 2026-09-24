import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Shell from './layouts/Shell';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AddTx } from './pages/AddTx';
import { Transactions } from './pages/Transactions';
import { Calendar } from './pages/Calendar';
import { Budget } from './pages/Budget';
import { Accounts } from './pages/Accounts';
import { Transfer } from './pages/Transfer';
import { Analytics } from './pages/Analytics';
import { Goals } from './pages/Goals';
import { Subscriptions } from './pages/Subscriptions';
import { MoneyOwed } from './pages/MoneyOwed';
import { More } from './pages/More';
import { useAuth } from './stores/auth';

function Guard({ children }: { children: JSX.Element }) {
  const { token, hydrate } = useAuth();
  useEffect(() => { hydrate(); }, []);
  if (!token && !localStorage.getItem('sb_token')) return <Navigate to="/welcome" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<AuthPage mode="login" />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route element={<Guard><Shell /></Guard>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTx />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/money-owed" element={<MoneyOwed />} />
          <Route path="/more" element={<More />} />
          <Route path="/settings" element={<More />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
