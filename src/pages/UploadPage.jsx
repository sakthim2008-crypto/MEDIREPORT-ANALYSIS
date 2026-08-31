import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, CheckCircle, Loader2 } from 'lucide-react';
import { processMedicalReport } from '../services/aiService';

const UploadPage = ({ token }) => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    "Reading document...",
    "Extracting text & identifying tests...",
    "Checking reference ranges...",
    "Generating patient-friendly summary..."
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      // Simulate steps progress for UX
      for (let i = 0; i < steps.length; i++) {
        setStep(i);
        await new Promise(r => setTimeout(r, 800));
      }
      
      // Wait for final response
      const responseData = await processMedicalReport(file, token);
      
      // Navigate to result
      navigate(`/result/${responseData.id || 'latest'}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during analysis.');
      setProcessing(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="mb-2 text-center">Upload Medical Report</h1>
      <p className="text-muted text-center mb-8">Supported formats: PDF, PNG, JPG</p>

      {!processing ? (
        <div className="glass-panel p-8 text-center">
          <div 
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input 
              type="file" 
              id="fileUpload" 
              className="hidden" 
              accept=".pdf,image/png,image/jpeg"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            {file ? (
              <div className="flex-col items-center justify-center animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <File className="text-primary mb-4" size={48} />
                <h3 className="mb-2">{file.name}</h3>
                <p className="text-sm text-muted mb-6">Ready to analyze</p>
                <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-outline" onClick={() => setFile(null)}>Change File</button>
                  <button className="btn btn-primary" onClick={handleAnalyze}>Analyze Report</button>
                </div>
              </div>
            ) : (
              <label htmlFor="fileUpload" className="flex-col items-center justify-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', height: '100%', width: '100%' }}>
                <UploadCloud className="text-primary mb-4" size={48} />
                <h3 className="mb-2">Drag & Drop your report here</h3>
                <p className="text-muted mb-4">or click to browse</p>
                <span className="btn btn-primary">Browse Files</span>
              </label>
            )}
          </div>
          
          <div className="mt-8 text-sm text-muted text-left p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Privacy Notice:</h4>
            <p>Your documents are analyzed securely. This system is designed for patient education and does not provide medical diagnoses. Always consult a doctor for medical advice.</p>
          </div>
          
          {error && (
            <div className="mt-6 p-4 rounded text-left animate-fade-in" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--status-high)' }}>
              <h4 className="text-[var(--status-high)] mb-1">Analysis Failed</h4>
              <p className="text-sm text-muted">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-8 text-center animate-fade-in">
          <div className="spinner mb-6"></div>
          <h2 className="mb-6">Processing your report...</h2>
          
          <div className="flex-col gap-4 text-left max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            {steps.map((s, index) => (
              <div key={index} className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: index <= step ? 1 : 0.3, transition: 'opacity 0.3s' }}>
                {index < step ? (
                  <CheckCircle className="text-[var(--status-normal)]" size={24} style={{ color: 'var(--status-normal)' }} />
                ) : index === step ? (
                  <Loader2 className="text-primary" size={24} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }}></div>
                )}
                <span className={index === step ? 'font-semibold' : ''}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
