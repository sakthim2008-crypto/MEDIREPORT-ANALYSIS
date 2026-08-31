import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Home, Upload } from 'lucide-react';

const Layout = ({ username, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary font-semibold' : 'text-muted hover:text-primary';
  };

  return (
    <div className="flex-col" style={{ minHeight: '100vh', display: 'flex' }}>
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container flex items-center justify-between py-4" style={{ padding: '1rem 2rem' }}>
          <Link to="/" className="flex items-center gap-2 text-lg font-bold" style={{ color: 'white' }}>
            <Activity className="text-primary" size={28} />
            <span>Medi<span className="text-primary">Lens</span></span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className={`flex items-center gap-2 ${isActive('/')}`}>
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/upload" className={`flex items-center gap-2 ${isActive('/upload')}`}>
              <Upload size={18} />
              <span>Upload</span>
            </Link>
            <div className="text-muted ml-4 pl-4 border-l border-[var(--border-color)] flex items-center gap-4">
              <span>Hi, {username}</span>
              <button onClick={onLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>Logout</button>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="glass-panel" style={{ borderRadius: 0, borderBottom: 0, borderLeft: 0, borderRight: 0, marginTop: 'auto' }}>
        <div className="container py-6 text-center text-muted text-sm">
          <p>© 2026 MediLens AI. This system is for educational purposes and does not replace professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
