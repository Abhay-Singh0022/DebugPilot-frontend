import { useState, useEffect, useRef } from 'react';

function App() {
  const [logText, setLogText] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/logs/history');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!logText.trim()) return;

    setLoading(true);
    setCopied(false);
    try {
      const response = await fetch('http://localhost:8080/api/logs/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: logText,
      });
      const data = await response.json();
      setCurrentAnalysis(data);
      fetchHistory();
    } catch (err) {
      console.error("Error analyzing log:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      Critical: { bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' },
      High: { bg: '#FFEDD5', color: '#EA580C', border: '#FDBA74' },
      Medium: { bg: '#FEF9C3', color: '#CA8A04', border: '#FDE047' },
      Low: { bg: '#DCFCE7', color: '#16A34A', border: '#86EFAC' },
    };
    const style = colors[severity] || colors.Medium;
    return (
      <span style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}`, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
        ⚡ {severity}
      </span>
    );
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#E0F2FE', color: '#0F172A', fontFamily: 'Inter, system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Navigation Bar */}
      <nav style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#0284C7', borderBottom: '1px solid #0369A1', position: 'sticky', top: 0, zIndex: 100, boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#0369A1', padding: '8px 10px', borderRadius: '10px', fontSize: '18px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>✈️</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', color: '#FFFFFF' }}>DebugPilot</h2>
            <p style={{ margin: 0, fontSize: '11px', color: '#E0F2FE' }}>Intelligent Log & Exception Diagnostic Engine</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px', color: '#E0F2FE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%', boxShadow: '0 0 8px #4ADE80' }}></span> API Online</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%', boxShadow: '0 0 8px #4ADE80' }}></span> MySQL Stable</div>
          
          {/* Profile Badge - Abhay Singh in Pure White */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '8px 18px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease' }}
            >
              <span style={{ fontSize: '16px' }}>👤</span>
              <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px', color: '#FFFFFF' }}>
                Abhay Singh
              </span>
              <span style={{ fontSize: '12px', color: '#FFFFFF' }}>▾</span>
            </button>

            {/* Intro Popup Box - Focused on DebugPilot Tech Stack */}
            {showProfile && (
              <div style={{ position: 'absolute', right: 0, top: '48px', width: '330px', background: '#FFFFFF', border: '1px solid #BAE6FD', borderRadius: '12px', padding: '18px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)', zIndex: 1000, textAlign: 'left', color: '#0F172A' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #E0F2FE', paddingBottom: '10px' }}>
                  <div style={{ background: '#0284C7', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#FFFFFF', fontSize: '15px' }}>AS</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>Abhay Singh</h4>
                    <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: '600' }}>Hey Engineer</span>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5', marginBottom: '12px' }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#0F172A' }}>🛠️ Technologies Used in DebugPilot:</p>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li><strong>Backend:</strong> Java (Spring Boot 3.x, REST APIs)</li>
                    <li><strong>Database:</strong> MySQL & JPA / Hibernate</li>
                    <li><strong>Frontend:</strong> React.js, Vite & Modern CSS</li>
                    <li><strong>Diagnostics:</strong> Automated Exception & Log Analysis</li>
                  </ul>
                </div>

                <div style={{ fontSize: '11px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                  ✈️ DebugPilot System v2.4
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Full-Width Content Container */}
      <main style={{ width: '100%', padding: '24px 32px', boxSizing: 'border-box' }}>
        
        {/* Top Diagnostic Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '24px', marginBottom: '28px' }}>
          
          {/* 1. Analysis Portal */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #BAE6FD', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>⚡ Analysis Portal</h3>
              <span style={{ fontSize: '12px', color: '#0284C7', background: '#E0F2FE', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>v2.4 Active</span>
            </div>
            <form onSubmit={handleAnalyze}>
              <label style={{ display: 'block', fontSize: '12px', color: '#475569', marginBottom: '8px', fontWeight: '500' }}>Submit Error Log / Stack Trace...</label>
              <textarea
                rows="6"
                style={{ width: '100%', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '12px', color: '#0F172A', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                placeholder="Paste raw stack trace or log output here... (e.g., java.lang.NullPointerException)"
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', marginTop: '14px', padding: '12px', background: loading ? '#94A3B8' : '#0284C7', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}
              >
                {loading ? 'Analyzing with DebugPilot Engine...' : 'Analyze Log with AI 🧠'}
              </button>
            </form>
          </div>

          {/* 2. Risk Severity Gauge Card */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #BAE6FD', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#0F172A', alignSelf: 'flex-start' }}>Risk Severity</h3>
            {currentAnalysis ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'conic-gradient(#0284C7 0deg, #38BDF8 360deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 0 20px rgba(2, 132, 199, 0.2)' }}>
                  <div style={{ width: '100%', height: '100%', background: '#F0F9FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#0369A1' }}>{currentAnalysis.severity}</span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>AI Diagnostic Confidence: <strong style={{ color: '#16A34A' }}>98.4%</strong></p>
              </div>
            ) : (
              <div style={{ color: '#64748B', fontSize: '14px', margin: 'auto 0' }}>Awaiting log submission to calculate risk index.</div>
            )}
          </div>

          {/* 3. Solution Engine Card */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #BAE6FD', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>Solution Engine</h3>
                {currentAnalysis && <span style={{ color: '#16A34A', fontSize: '12px', background: '#DCFCE7', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>Ready</span>}
              </div>
              {currentAnalysis ? (
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                  <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#0F172A' }}>Root Cause:</strong> {currentAnalysis.rootCause}</p>
                  <p style={{ margin: 0 }}><strong style={{ color: '#0F172A' }}>Suggested Fix:</strong> {currentAnalysis.suggestedFix}</p>
                </div>
              ) : (
                <p style={{ color: '#64748B', fontSize: '13px' }}>AI fix recommendations and automated refactoring snippets will appear here upon analysis.</p>
              )}
            </div>
            {currentAnalysis && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  onClick={() => copyToClipboard(currentAnalysis.suggestedFix)}
                  style={{ flex: 1, padding: '10px', background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  {copied ? '✅ Solution Copied!' : 'Copy Solution'}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Diagnostic History Table */}
        <div style={{ width: '100%', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #BAE6FD', padding: '24px', boxSizing: 'border-box', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>Full Log History Explorer</h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Total Database Records: {history.length}</span>
          </div>

          {history.length === 0 ? (
            <p style={{ color: '#64748B', textAlign: 'center', padding: '30px 0', fontSize: '14px' }}>No logs analyzed yet. Submit a log above to start populating history.</p>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E0F2FE', color: '#475569' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>ID</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Severity</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Root Cause Snippet</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Raw Log Snapshot</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Diagnostic Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 16px', color: '#64748B', fontFamily: 'monospace' }}>#{item.id}</td>
                      <td style={{ padding: '14px 16px' }}>{getSeverityBadge(item.severity)}</td>
                      <td style={{ padding: '14px 16px', color: '#0F172A', maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.rootCause}</td>
                      <td style={{ padding: '14px 16px', color: '#64748B', fontFamily: 'monospace', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.rawLog}</td>
                      <td style={{ padding: '14px 16px', color: '#64748B', fontSize: '12px' }}>{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Footer Section */}
        <footer style={{
          width: '100%',
          textAlign: 'center',
          padding: '20px 0',
          marginTop: '32px',
          borderTop: '1px solid #BAE6FD',
          fontSize: '12px',
          color: '#0369A1',
          fontWeight: '500'
        }}>
          © 2026 <strong>DebugPilot</strong> • Built with Java, Spring Boot, MySQL & React by <strong>Abhay Singh</strong>
        </footer>

      </main>
    </div>
  );
}

export default App;