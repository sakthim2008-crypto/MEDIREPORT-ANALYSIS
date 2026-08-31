import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Languages, AlertTriangle } from 'lucide-react';
import { fetchReportById } from '../services/aiService';
import ResultCard from '../components/ResultCard';

const ResultPage = ({ token }) => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTamil, setIsTamil] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await fetchReportById(id, token);
        setReport(data);
      } catch (err) {
        console.error(err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id, token]);

  const handleTTS = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (isTamil) {
        // Try to find a Tamil voice
        const voices = window.speechSynthesis.getVoices();
        const tamilVoice = voices.find(v => v.lang.includes('ta'));
        if (tamilVoice) utterance.voice = tamilVoice;
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-US';
      }
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-Speech is not supported in your browser.');
    }
  };

  if (loading) {
    return (
      <div className="container flex-col items-center justify-center min-h-[50vh]" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div className="spinner mb-4"></div>
        <p>Loading analysis...</p>
      </div>
    );
  }

  if (!report) return <div className="container">Report not found.</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="flex items-center gap-2 text-muted hover:text-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className={`btn ${isTamil ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setIsTamil(!isTamil)}
            style={{ padding: '0.5rem 1rem' }}
          >
            <Languages size={18} />
            {isTamil ? 'English' : 'தமிழ் (Tamil)'}
          </button>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => window.print()}>
            <Download size={18} />
            Download Summary
          </button>
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="mb-2">Medical Report Analysis</h1>
        <p className="text-xl text-primary">{report.document_type}</p>
      </div>

      <div className="glass-panel p-6 mb-8" style={{ borderLeft: '4px solid var(--primary)' }}>
        <h2 className="mb-4">Patient-Friendly Summary</h2>
        <p className="text-lg leading-relaxed">
          {isTamil ? report.overall_tamil_summary : report.overall_summary}
        </p>
      </div>

      {report.important_findings && report.important_findings.length > 0 && (
        <div className="glass-panel p-6 mb-8" style={{ borderLeft: '4px solid var(--status-low)', background: 'rgba(245, 158, 11, 0.05)' }}>
          <div className="flex items-center gap-2 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle className="text-[var(--status-low)]" style={{ color: 'var(--status-low)' }} size={24} />
            <h2 style={{ margin: 0 }}>Important Findings</h2>
          </div>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {report.important_findings.map((finding, idx) => (
              <li key={idx} className="mb-2">{finding}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="mb-6">Test Results</h2>
      <div className="flex-col gap-6" style={{ display: 'flex', flexDirection: 'column' }}>
        {report.tests.map((test, idx) => (
          <ResultCard 
            key={idx} 
            test={test} 
            isTamil={isTamil} 
            onTTS={handleTTS} 
          />
        ))}
      </div>

      <div className="glass-panel p-6 mt-8">
        <h3 className="mb-4">Medical Terms Explained</h3>
        <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {report.medical_terms.map((term, idx) => (
            <div key={idx} className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h4 className="text-primary mb-1">{term.term}</h4>
              <p className="text-sm">{term.simple_meaning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 p-6 rounded text-sm text-muted text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p>{report.disclaimer}</p>
      </div>
    </div>
  );
};

export default ResultPage;
