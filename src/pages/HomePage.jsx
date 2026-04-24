import { useNavigate } from 'react-router-dom';
import { BookOpen, Shuffle, Timer, Zap, RotateCcw, BarChart3 } from 'lucide-react';
import { unit3Questions, unit4Questions, allQuestions } from '../data/questions';
import { getStats, getWrongAnswers } from '../store';

export default function HomePage() {
  const navigate = useNavigate();
  const stats = getStats();
  const wrongCount = getWrongAnswers().length;

  const modes = [
    { icon: <BookOpen size={28} />, color: 'var(--gradient-1)', title: 'Unit 3 Practice', desc: `Marketing + AI Research · ${unit3Questions.length} MCQs`, path: '/practice', state: { unit: 'u3' } },
    { icon: <BookOpen size={28} />, color: 'linear-gradient(135deg, #06b6d4, #3b82f6)', title: 'Unit 4 Practice', desc: `Startup Pitch + Prototyping · ${unit4Questions.length} MCQs`, path: '/practice', state: { unit: 'u4' } },
    { icon: <Shuffle size={28} />, color: 'linear-gradient(135deg, #8b5cf6, #d946ef)', title: 'Mixed Practice', desc: `All units shuffled · ${allQuestions.length} MCQs`, path: '/practice', state: { unit: 'mixed' } },
    { icon: <Timer size={28} />, color: 'linear-gradient(135deg, #f59e0b, #ef4444)', title: 'Mock Test', desc: 'Timed exam simulation with all questions', path: '/practice', state: { unit: 'mock' } },
    { icon: <RotateCcw size={28} />, color: 'linear-gradient(135deg, #ef4444, #dc2626)', title: 'Revise Wrong', desc: `${wrongCount} question${wrongCount !== 1 ? 's' : ''} to master`, path: '/revise' },
    { icon: <BarChart3 size={28} />, color: 'linear-gradient(135deg, #10b981, #059669)', title: 'Dashboard', desc: 'Track your progress and weak areas', path: '/dashboard' },
  ];

  return (
    <div className="page">
      <div className="page-header animate-in">
        <h1 className="page-title">CIE MCQ Master</h1>
        <p className="page-subtitle">Entrepreneurship & Innovation — Unit 3 & Unit 4 · {allQuestions.length} Questions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid-4 animate-in" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon purple"><Zap size={20} /></div>
          <div className="stat-info"><h4>Total Questions</h4><p>{allQuestions.length}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><BookOpen size={20} /></div>
          <div className="stat-info"><h4>Attempted</h4><p>{stats.totalAttempted}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><BarChart3 size={20} /></div>
          <div className="stat-info"><h4>Accuracy</h4><p>{stats.totalAttempted > 0 ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) : 0}%</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><RotateCcw size={20} /></div>
          <div className="stat-info"><h4>To Revise</h4><p>{wrongCount}</p></div>
        </div>
      </div>

      {/* Mode Cards */}
      <div className="grid-3 animate-in">
        {modes.map((mode, i) => (
          <div key={i} className="mode-card card-glow" onClick={() => navigate(mode.path, { state: mode.state })}>
            <div className="mode-icon" style={{ background: mode.color, color: 'white' }}>
              {mode.icon}
            </div>
            <h3>{mode.title}</h3>
            <p>{mode.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
