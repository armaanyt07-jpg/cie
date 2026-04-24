import { Trophy, Target, TrendingUp, AlertTriangle, Trash2 } from 'lucide-react';
import { getStats, getWrongAnswers, clearAllData } from '../store';
import { allQuestions } from '../data/questions';
import { useState } from 'react';

export default function DashboardPage() {
  const [, forceUpdate] = useState(0);
  const stats = getStats();
  const wrongIds = getWrongAnswers();
  const accuracy = stats.totalAttempted > 0 ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) : 0;
  const quizzes = stats.quizHistory || [];

  const handleClear = () => {
    if (window.confirm('Are you sure? This will reset ALL progress, bookmarks, and wrong answers.')) {
      clearAllData();
      forceUpdate(n => n + 1);
    }
  };

  return (
    <div className="page">
      <div className="page-header animate-in">
        <h1 className="page-title">Progress Dashboard</h1>
        <p className="page-subtitle">Track your performance across all quizzes</p>
      </div>

      <div className="grid-4 animate-in" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon purple"><Target size={20} /></div>
          <div className="stat-info"><h4>Attempted</h4><p>{stats.totalAttempted}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Trophy size={20} /></div>
          <div className="stat-info"><h4>Correct</h4><p>{stats.totalCorrect}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><TrendingUp size={20} /></div>
          <div className="stat-info"><h4>Accuracy</h4><p>{accuracy}%</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><AlertTriangle size={20} /></div>
          <div className="stat-info"><h4>Wrong Pool</h4><p>{wrongIds.length}</p></div>
        </div>
      </div>

      {/* Weak Areas */}
      {Object.keys(stats.weakTopics || {}).length > 0 && (
        <div className="card animate-in" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>⚠️ Weak Areas</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {Object.entries(stats.weakTopics).sort((a, b) => b[1] - a[1]).map(([topic, count]) => (
              <div key={topic} style={{
                padding: '0.75rem 1.25rem', background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10, fontSize: '0.85rem', fontWeight: 600
              }}>
                <span style={{ color: 'var(--error)' }}>{topic}</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>{count} wrong</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz History */}
      <div className="card animate-in" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>📝 Quiz History</h3>
        {quizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No quizzes yet</h3>
            <p>Complete a quiz to see your history here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[...quizzes].reverse().slice(0, 15).map((quiz, i) => {
              const pct = quiz.total > 0 ? Math.round((quiz.correct / quiz.total) * 100) : 0;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem', background: 'var(--bg-glass)', borderRadius: 10,
                  border: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem'
                }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{quiz.title}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 8 }}>
                      {new Date(quiz.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ {quiz.correct}</span>
                    <span style={{ color: 'var(--error)', fontWeight: 600 }}>✗ {quiz.wrong}</span>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 700, fontSize: '0.8rem',
                      background: pct >= 80 ? 'var(--success-bg)' : pct >= 50 ? 'var(--warning-bg)' : 'var(--error-bg)',
                      color: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)'
                    }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="animate-in" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={handleClear} style={{ color: 'var(--error)' }}>
          <Trash2 size={14} /> Reset All Progress
        </button>
      </div>
    </div>
  );
}
