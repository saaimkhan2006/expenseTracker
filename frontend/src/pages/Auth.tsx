import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../stores/auth';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const go = async () => {
    try {
      setErr('');
      if (mode === 'login') await login(email, password);
      else await register(name, email, password);
      nav('/');
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <p className="text-accent font-bold text-lg">💸 Smart Budget</p>
        <h1 className="text-5xl font-extrabold mt-2 leading-tight">Your money,<br />at a glance.</h1>
        <div className="card mt-8 space-y-4">
          {mode === 'register' && (<div><span className="label">Name</span><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav" /></div>)}
          <div><span className="label">Email</span><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" /></div>
          <div><span className="label">Password</span><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" /></div>
          {err && <p className="text-coral font-semibold">{err}</p>}
          <button className="btn-primary w-full" onClick={go}>{mode === 'login' ? 'Log in' : 'Create account'}</button>
          <p className="text-white/60 text-center">
            {mode === 'login' ? (<>New here? <Link className="text-accent font-bold" to="/register">Register</Link></>) : (<>Have an account? <Link className="text-accent font-bold" to="/login">Log in</Link></>)}
          </p>
        </div>
      </div>
    </div>
  );
}
