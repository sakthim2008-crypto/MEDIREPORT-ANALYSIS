import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock } from 'lucide-react';
import { login } from '../services/aiService';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(username, password);
      onLogin(data.token, data.username);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Use demo / demo');
    }
  };

  return (
    <div className="flex-col items-center justify-center animate-fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel p-8" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <Activity className="text-primary mx-auto mb-4" size={48} />
          <h2 className="mb-2">Medi<span className="text-primary">Lens</span> Login</h2>
          <p className="text-muted">Medical Report Analysis Platform</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-[var(--status-high-bg)] text-[var(--status-high)] text-sm text-center" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--status-high)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="text-sm text-muted mb-1 block" style={{ display: 'block', marginBottom: '0.25rem' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded bg-transparent border border-[var(--border-color)] text-white focus:outline-none focus:border-primary"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
            />
          </div>
          <div>
            <label className="text-sm text-muted mb-1 block" style={{ display: 'block', marginBottom: '0.25rem' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-transparent border border-[var(--border-color)] text-white focus:outline-none focus:border-primary"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Lock size={18} className="mr-2" />
            Sign In
          </button>
        </form>
        
        <p className="text-xs text-muted text-center mt-6">
          Use username: <strong>demo</strong> and password: <strong>demo</strong>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
