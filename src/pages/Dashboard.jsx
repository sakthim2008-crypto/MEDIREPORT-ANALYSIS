import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Activity, TrendingUp } from 'lucide-react';
import { fetchReports } from '../services/aiService';

const Dashboard = ({ token }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports(token);
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [token]);

  const needsReviewCount = reports.filter(r => 
    r.tests && r.tests.some(t => t.status === 'HIGH' || t.status === 'LOW')
  ).length;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      <div className="flex-col items-center justify-center text-center py-8">
        <h1 className="mb-4">Welcome to Medi<span className="text-primary">Lens</span></h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
          Upload your medical reports for instant, patient-friendly AI analysis and visual insights.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/upload" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
            <Upload size={22} />
            Upload New Report
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="glass-panel p-6 hover-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary rounded-full" style={{ background: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%' }}>
              <FileText className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-lg mb-1" style={{ margin: 0 }}>Total Reports</h3>
              <p className="text-3xl font-bold">{loading ? '-' : reports.length}</p>
            </div>
          </div>
          <p className="text-sm text-muted">All uploaded reports</p>
        </div>
        
        <div className="glass-panel p-6 hover-card delay-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary rounded-full" style={{ background: 'rgba(244, 63, 94, 0.2)', borderRadius: '50%' }}>
              <Activity className="text-[var(--status-high)]" size={24} style={{ color: 'var(--status-high)' }} />
            </div>
            <div>
              <h3 className="text-lg mb-1" style={{ margin: 0 }}>Needs Review</h3>
              <p className="text-3xl font-bold">{loading ? '-' : needsReviewCount}</p>
            </div>
          </div>
          <p className="text-sm text-muted">Reports with abnormal values</p>
        </div>

        <div className="glass-panel p-6 hover-card delay-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary rounded-full" style={{ background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%' }}>
              <TrendingUp className="text-[var(--status-normal)]" size={24} style={{ color: 'var(--status-normal)' }} />
            </div>
            <div>
              <h3 className="text-lg mb-1" style={{ margin: 0 }}>Analysis Active</h3>
              <p className="text-xl font-bold mt-2" style={{ color: 'var(--status-normal)' }}>Ready</p>
            </div>
          </div>
          <p className="text-sm text-muted">Smart Fallback Engine running</p>
        </div>
      </div>
      
      <div className="mt-8 glass-panel p-6">
        <h2 className="mb-4 text-xl">Your Recent Analyses</h2>
        
        {loading ? (
          <div className="p-4 text-center text-muted">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-muted border border-dashed rounded" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            No reports uploaded yet. Click 'Upload New Report' to begin.
          </div>
        ) : (
          <div className="flex-col gap-4" style={{ display: 'flex', flexDirection: 'column' }}>
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <div className="flex items-center gap-4">
                  <FileText className="text-muted" size={20} />
                  <div>
                    <h4 className="font-semibold" style={{ margin: 0 }}>{report.filename} - {report.document_type}</h4>
                    <p className="text-sm text-muted">{new Date(report.date).toLocaleString()}</p>
                  </div>
                </div>
                <Link to={`/result/${report.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>View Analysis</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
