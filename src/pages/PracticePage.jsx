import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';
import { unit3Questions, unit4Questions, allQuestions } from '../data/questions';
import QuizEngine from '../components/QuizEngine';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticePage() {
  const location = useLocation();
  const preState = location.state || {};
  const retryIds = preState.retryIds;

  const [started, setStarted] = useState(!!retryIds);
  const [unit, setUnit] = useState(preState.unit || 'mixed');
  const [shuffle, setShuffle] = useState(true);
  const [timerOn, setTimerOn] = useState(preState.unit === 'mock');
  const [timerMins, setTimerMins] = useState(preState.unit === 'mock' ? 60 : 30);
  const [questionCount, setQuestionCount] = useState(0); // 0 = all

  const questions = useMemo(() => {
    if (retryIds) {
      return allQuestions.filter(q => retryIds.includes(q.id));
    }
    let base;
    if (unit === 'u3') base = [...unit3Questions];
    else if (unit === 'u4') base = [...unit4Questions];
    else base = [...allQuestions];

    if (shuffle) base = shuffleArray(base);
    if (questionCount > 0 && questionCount < base.length) base = base.slice(0, questionCount);
    return base;
  }, [unit, shuffle, questionCount, retryIds]);

  const titleMap = { u3: 'Unit 3 Practice', u4: 'Unit 4 Practice', mixed: 'Mixed Practice', mock: 'Mock Test' };

  if (started) {
    return (
      <div className="page">
        <QuizEngine
          questions={questions}
          title={retryIds ? 'Retry Wrong Answers' : titleMap[unit]}
          timerEnabled={timerOn}
          timerMinutes={timerMins}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header animate-in">
        <h1 className="page-title">Configure Quiz</h1>
        <p className="page-subtitle">Set up your practice session</p>
      </div>
      <div className="config-panel animate-in">
        <div className="config-group">
          <label>Select Unit</label>
          <div className="config-options">
            {[
              { val: 'u3', label: `Unit 3 (${unit3Questions.length})` },
              { val: 'u4', label: `Unit 4 (${unit4Questions.length})` },
              { val: 'mixed', label: `Mixed (${allQuestions.length})` },
              { val: 'mock', label: 'Mock Test' },
            ].map(opt => (
              <button key={opt.val} className={`config-chip ${unit === opt.val ? 'active' : ''}`}
                onClick={() => {
                  setUnit(opt.val);
                  if (opt.val === 'mock') { setTimerOn(true); setTimerMins(60); }
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="config-group">
          <label>Number of Questions</label>
          <div className="config-options">
            {[0, 10, 20, 30].map(n => (
              <button key={n} className={`config-chip ${questionCount === n ? 'active' : ''}`}
                onClick={() => setQuestionCount(n)}>
                {n === 0 ? 'All' : n}
              </button>
            ))}
          </div>
        </div>

        <div className="config-group">
          <div className="toggle-row">
            <span>Shuffle Questions</span>
            <div className={`toggle-switch ${shuffle ? 'on' : ''}`} onClick={() => setShuffle(!shuffle)}>
              <div className="toggle-knob" />
            </div>
          </div>
          <div className="toggle-row">
            <span>Enable Timer</span>
            <div className={`toggle-switch ${timerOn ? 'on' : ''}`} onClick={() => setTimerOn(!timerOn)}>
              <div className="toggle-knob" />
            </div>
          </div>
        </div>

        {timerOn && (
          <div className="config-group">
            <label>Timer Duration (minutes)</label>
            <div className="config-options">
              {[15, 30, 45, 60, 90].map(m => (
                <button key={m} className={`config-chip ${timerMins === m ? 'active' : ''}`}
                  onClick={() => setTimerMins(m)}>
                  {m} min
                </button>
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
          onClick={() => setStarted(true)}>
          <Play size={18} /> Start Quiz ({questions.length} questions)
        </button>
      </div>
    </div>
  );
}
