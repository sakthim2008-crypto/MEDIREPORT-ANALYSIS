import { Volume2 } from 'lucide-react';

const ResultCard = ({ test, isTamil, onTTS }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'LOW': return 'var(--status-low)';
      case 'HIGH': return 'var(--status-high)';
      case 'NORMAL': return 'var(--status-normal)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'LOW': return 'badge-low';
      case 'HIGH': return 'badge-high';
      case 'NORMAL': return 'badge-normal';
      default: return 'badge-unclear';
    }
  };

  // Calculate position for visual marker
  const calculatePosition = () => {
    if (!test.isNumeric) return 50;
    const range = test.scaleMax - test.scaleMin;
    const position = ((test.numericValue - test.scaleMin) / range) * 100;
    return Math.max(0, Math.min(100, position)); // clamp between 0 and 100
  };

  return (
    <div className="glass-panel p-6 hover-card mb-6">
      <div className="flex items-center justify-between mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="m-0" style={{ margin: 0 }}>{test.test_name}</h3>
        <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className={`badge ${getStatusBadgeClass(test.status)}`}>{test.status}</span>
          <button 
            onClick={() => onTTS(isTamil ? test.tts_tamil : test.tts_english)}
            className="btn btn-outline p-2" 
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            title="Read Aloud"
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        <div className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-sm text-muted mb-1">Your Result</p>
          <p className="text-2xl font-bold" style={{ color: getStatusColor(test.status) }}>
            {test.value} <span className="text-sm font-normal text-muted">{test.unit}</span>
          </p>
        </div>
        <div className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-sm text-muted mb-1">Reference Range</p>
          <p className="text-lg font-semibold">{test.reference_range}</p>
        </div>
      </div>

      {test.isNumeric && (
        <div className="range-bar-container mb-8">
          <div className="range-bar">
            <div 
              className="range-marker" 
              style={{ left: `${calculatePosition()}%`, borderColor: getStatusColor(test.status) }}
            ></div>
          </div>
          <div className="range-labels">
            <span>Low</span>
            <span>Normal Range: {test.reference_range}</span>
            <span>High</span>
          </div>
        </div>
      )}

      <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {isTamil ? (
          <div>
            <h4 className="text-primary mb-2">எளிய விளக்கம்</h4>
            <p>{test.tamil_explanation}</p>
          </div>
        ) : (
          <>
            <div>
              <h4 className="text-primary mb-1">What does this mean?</h4>
              <p>{test.simple_meaning}</p>
            </div>
            
            {test.possible_reasons && test.possible_reasons.length > 0 && (
              <div>
                <h4 className="text-primary mb-1">Why might this happen?</h4>
                <p className="mb-2">There are several possible reasons, including:</p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.5rem' }}>
                  {test.possible_reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="text-primary mb-1">What should you do?</h4>
              <p>{test.patient_guidance}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
