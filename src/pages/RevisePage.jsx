import { useState } from 'react';
import { Play, Trash2, RotateCcw } from 'lucide-react';
import { getWrongAnswers, removeWrongAnswer } from '../store';
import { allQuestions } from '../data/questions';
import QuizEngine from '../components/QuizEngine';

export default function RevisePage() {
  const [wrongIds, setWrongIds] = useState(getWrongAnswers());
  const [practicing, setPracticing] = useState(false);
  const wrongQs = allQuestions.filter(q => wrongIds.includes(q.id));

  const handleClearOne = (id) => {
    removeWrongAnswer(id);
    setWrongIds(getWrongAnswers());
  };

  if (practicing && wrongQs.length > 0) {
    return (
      <div className="page">
        <QuizEngine
          questions={wrongQs}
          title="Revise Wrong Answers"
          timerEnabled={false}
          timerMinutes={0}
          onFinish={() => {
            setWrongIds(getWrongAnswers());
            setPracticing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header animate-in">
        <h1 className="page-title">Revise Wrong Answers</h1>
        <p className="page-subtitle">
          {wrongQs.length} question{wrongQs.length !== 1 ? 's' : ''} to master — keep practicing until all are cleared!
        </p>
      </div>

      {wrongQs.length > 0 && (
        <div className="animate-in" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setPracticing(true)}>
            <Play size={16} /> Practice All Wrong ({wrongQs.length})
          </button>
        </div>
      )}

      {wrongQs.length === 0 ? (
        <div className="empty-state animate-in">
          <div className="empty-icon">🎉</div>
          <h3>All clear!</h3>
          <p>You've mastered all previously wrong questions. Great job!</p>
        </div>
      ) : (
        <div className="animate-in">
          {wrongQs.map(q => (
            <div key={q.id} className="bookmark-item">
              <div style={{ flex: 1 }}>
                <p>
                  <span style={{ color: 'var(--error)', fontWeight: 700 }}>
                    {q.id.startsWith('u3') ? 'U3' : 'U4'}
                  </span>{' '}
                  {q.q}
                </p>
                <div className="bookmark-meta">
                  Correct Answer: {String.fromCharCode(65 + q.answer)}) {q.options[q.answer]}
                </div>
              </div>
              <button className="btn btn-icon btn-secondary btn-sm" onClick={() => handleClearOne(q.id)}
                title="Mark as mastered" style={{ color: 'var(--success)', flexShrink: 0 }}>
                ✓
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
