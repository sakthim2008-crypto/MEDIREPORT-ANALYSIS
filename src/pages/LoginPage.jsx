import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Shield, Stethoscope, Microscope } from 'lucide-react';
import { login } from '../services/aiService';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await login(username, password);
      onLogin(data.token, data.username);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Use demo / demo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-col items-center justify-center animate-fade-in" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      
      {/* Floating Animated Icons */}
      <div style={{ position: 'absolute', top: '15%', left: '15%', opacity: 0.1, animation: 'float 8s ease-in-out infinite' }}>
        <Microscope size={120} />
      </div>
      <div style={{ position: 'absolute', bottom: '15%', right: '15%', opacity: 0.1, animation: 'float 10s ease-in-out infinite reverse' }}>
        <Stethoscope size={150} />
      </div>
      
      <div className="glass-panel p-8" style={{ width: '100%', maxWidth: '420px', zIndex: 10 }}>
        <div className="text-center mb-8">
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '1rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <Activity className="text-primary" size={40} style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          </div>
          <h2 className="mb-2 text-gradient">MediLens AI</h2>
          <p className="text-muted text-sm">Secure Medical Report Analysis Platform</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 rounded bg-[var(--status-high-bg)] text-[var(--status-high)] text-sm text-center border border-[var(--status-high)] animate-fade-in" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--status-high)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="text-sm text-muted mb-1 block font-semibold" style={{ display: 'block', marginBottom: '0.4rem' }}>Medical ID / Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded text-white focus:outline-none"
              style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', transition: 'all 0.3s' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <div>
            <label className="text-sm text-muted mb-1 block font-semibold" style={{ display: 'block', marginBottom: '0.4rem' }}>Access Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded text-white focus:outline-none"
              style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', transition: 'all 0.3s' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn btn-primary w-full mt-2" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', marginTop: '1rem' }}>
            {isLoading ? (
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
            ) : (
              <>
                <Lock size={18} className="mr-2" />
                Secure Login
              </>
            )}
          </button>
        </form>
        
        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-[var(--border-color)]">
          <Shield size={16} className="text-status-normal" style={{ color: '#10b981' }} />
          <p className="text-xs text-muted">
            End-to-End Encrypted System
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .7; transform: scale(1.05); }
        }
      `}} />
    </div>
  );
};

export default LoginPage;
