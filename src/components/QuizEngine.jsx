import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flag, BookmarkPlus, BookmarkCheck, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { addWrongAnswer, removeWrongAnswer, toggleBookmark, getBookmarks, toggleMarkForReview, getMarkedForReview, saveQuizResult } from '../store';

export default function QuizEngine({ questions, title, timerEnabled, timerMinutes, onFinish }) {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [bookmarks, setBookmarks] = useState(getBookmarks());
  const [marked, setMarked] = useState(getMarkedForReview());
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerEnabled ? timerMinutes * 60 : null);
  const [showNav, setShowNav] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const totalQ = questions.length;
  const q = questions[currentIdx];

  const handleFinish = useCallback(() => {
    const currentAnswers = answersRef.current;
    setFinished(true);
    const correct = questions.filter(q => currentAnswers[q.id] === q.answer).length;
    const wrong = questions.filter(q => currentAnswers[q.id] !== undefined && currentAnswers[q.id] !== q.answer).length;
    const unanswered = totalQ - Object.keys(currentAnswers).length;
    const wrongIds = questions.filter(q => currentAnswers[q.id] !== undefined && currentAnswers[q.id] !== q.answer).map(q => q.id);
    const result = { title, total: totalQ, correct, wrong, unanswered, wrongIds, timeUsed: timerEnabled ? (timerMinutes * 60 - (timeLeft || 0)) : null };
    saveQuizResult(result);
    if (onFinish) onFinish(result);
  }, [questions, totalQ, title, timerEnabled, timerMinutes, timeLeft, onFinish]);

  // Timer
  useEffect(() => {
    if (!timerEnabled || timeLeft === null || finished) return;
    if (timeLeft <= 0) { handleFinish(); return; }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerEnabled, finished, handleFinish]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleSelect = (optIdx) => {
    if (answers[q.id] !== undefined) return;
    setAnswers(prev => ({ ...prev, [q.id]: optIdx }));
    setRevealed(prev => ({ ...prev, [q.id]: true }));
    if (optIdx !== q.answer) addWrongAnswer(q.id);
    else removeWrongAnswer(q.id);
  };

  const handleBookmark = () => {
    const updated = toggleBookmark(q.id);
    setBookmarks([...updated]);
  };

  const handleMark = () => {
    const updated = toggleMarkForReview(q.id);
    setMarked([...updated]);
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(q => answers[q.id] === q.answer).length;

  if (finished) {
    const wrong = answeredCount - correctCount;
    const unanswered = totalQ - answeredCount;
    const pct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const grade = pct >= 80 ? 'great' : pct >= 50 ? 'okay' : 'poor';
    const wrongQs = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.answer);

    return (
      <div className="results-container animate-in">
        <div className="page-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title">Quiz Complete!</h1>
          <p className="page-subtitle">{title}</p>
        </div>
        <div className={`results-score-circle ${grade}`}>
          {pct}%
          <small>{correctCount}/{totalQ}</small>
        </div>
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon green"><CheckCircle2 size={22} /></div>
            <div className="stat-info"><h4>Correct</h4><p>{correctCount}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red"><XCircle size={22} /></div>
            <div className="stat-info"><h4>Wrong</h4><p>{wrong}</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Eye size={22} /></div>
            <div className="stat-info"><h4>Skipped</h4><p>{unanswered}</p></div>
          </div>
        </div>
        {timerEnabled && timeLeft !== null && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            ⏱ Time used: {formatTime(timerMinutes * 60 - (timeLeft || 0))}
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {wrongQs.length > 0 && (
            <button className="btn btn-danger" onClick={() => {
              setFinished(false);
              const wrongIds = wrongQs.map(q => q.id);
              // Navigate to retry - re-initialize with only wrong questions
              navigate('/practice', { state: { retryIds: wrongIds } });
            }}>
              Retry {wrongQs.length} Wrong
            </button>
          )}
          <button className="btn btn-primary" onClick={() => {
            setFinished(false); setCurrentIdx(0); setAnswers({}); setRevealed({});
            if (timerEnabled) setTimeLeft(timerMinutes * 60);
          }}>Restart Quiz</button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Home</button>
        </div>

        {/* Review all questions */}
        <div style={{ marginTop: '2.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Review All Questions</h3>
          {questions.map((question, idx) => {
            const userAns = answers[question.id];
            const isCorrect = userAns === question.answer;
            return (
              <div key={question.id} className="card" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500, flex: 1 }}>
                    <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>Q{idx + 1}. </span>
                    {question.q}
                  </p>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 6,
                    background: userAns === undefined ? 'var(--warning-bg)' : isCorrect ? 'var(--success-bg)' : 'var(--error-bg)',
                    color: userAns === undefined ? 'var(--warning)' : isCorrect ? 'var(--success)' : 'var(--error)',
                    fontWeight: 600, flexShrink: 0, marginLeft: 8
                  }}>
                    {userAns === undefined ? 'Skipped' : isCorrect ? '✓' : '✗'}
                  </span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--success)' }}>Answer: {String.fromCharCode(65 + question.answer)}) {question.options[question.answer]}</span>
                  {userAns !== undefined && !isCorrect && (
                    <span style={{ marginLeft: 12, color: 'var(--error)' }}>Your pick: {String.fromCharCode(65 + userAns)}) {question.options[userAns]}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container animate-in">
      {/* Top bar */}
      <div className="quiz-topbar">
        <span className="quiz-progress-text">
          Question <strong>{currentIdx + 1}</strong> of <strong>{totalQ}</strong>
          {answeredCount > 0 && <> · {correctCount}/{answeredCount} correct</>}
        </span>
        {timerEnabled && timeLeft !== null && (
          <div className={`quiz-timer ${timeLeft < 60 ? 'danger' : ''}`}>
            <Clock size={16} /> {formatTime(timeLeft)}
          </div>
        )}
        <button className="btn btn-sm btn-secondary" onClick={() => setShowNav(!showNav)}>
          {showNav ? 'Hide' : 'Show'} Nav
        </button>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${(answeredCount / totalQ) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="question-card" key={q.id}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="question-num">Question {currentIdx + 1} · {q.id.startsWith('u3') ? 'Unit 3' : 'Unit 4'}</div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button className="btn btn-icon btn-secondary btn-sm" onClick={handleMark} title="Mark for review"
              style={marked.includes(q.id) ? { color: 'var(--warning)', borderColor: 'var(--warning)' } : {}}>
              <Flag size={16} />
            </button>
            <button className="btn btn-icon btn-secondary btn-sm" onClick={handleBookmark} title="Bookmark"
              style={bookmarks.includes(q.id) ? { color: 'var(--warning)', borderColor: 'var(--warning)' } : {}}>
              {bookmarks.includes(q.id) ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
            </button>
          </div>
        </div>
        <p className="question-text">{q.q}</p>
        <div className="options-list">
          {q.options.map((opt, i) => {
            const userAns = answers[q.id];
            const isRevealed = revealed[q.id];
            let cls = 'option-btn';
            if (isRevealed) {
              cls += ' disabled';
              if (i === q.answer) cls += ' correct';
              else if (i === userAns) cls += ' wrong';
            } else if (userAns === i) {
              cls += ' selected';
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={isRevealed}>
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        {revealed[q.id] && (
          <div className={`feedback-bar ${answers[q.id] === q.answer ? 'correct' : 'wrong'}`}>
            {answers[q.id] === q.answer
              ? <><CheckCircle2 size={18} /> Correct!</>
              : <><XCircle size={18} /> Wrong — Answer: {String.fromCharCode(65 + q.answer)}) {q.options[q.answer]}</>
            }
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="quiz-actions">
        <div className="quiz-actions-left">
          <button className="btn btn-secondary" disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}>
            <ChevronLeft size={16} /> Prev
          </button>
          <button className="btn btn-secondary" disabled={currentIdx === totalQ - 1}
            onClick={() => setCurrentIdx(prev => prev + 1)}>
            Next <ChevronRight size={16} />
          </button>
        </div>
        <div className="quiz-actions-right">
          <button className="btn btn-primary" onClick={handleFinish}>
            Finish Quiz
          </button>
        </div>
      </div>

      {/* Question Navigation Grid */}
      {showNav && (
        <div className="question-nav fade-in">
          <h4>Question Navigator</h4>
          {questions.map((question, idx) => {
            let cls = 'qnav-btn';
            if (idx === currentIdx) cls += ' current';
            else if (answers[question.id] !== undefined) {
              cls += answers[question.id] === question.answer ? ' answered' : ' wrong-answered';
            }
            if (marked.includes(question.id)) cls += ' marked';
            if (bookmarks.includes(question.id)) cls += ' bookmarked';
            return (
              <button key={question.id} className={cls} onClick={() => setCurrentIdx(idx)}>
                {idx + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
