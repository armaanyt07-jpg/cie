import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Play, Trash2 } from 'lucide-react';
import { getBookmarks, toggleBookmark } from '../store';
import { allQuestions } from '../data/questions';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarkIds, setBookmarkIds] = useState(getBookmarks());
  const bookmarkedQs = allQuestions.filter(q => bookmarkIds.includes(q.id));

  const handleRemove = (id) => {
    const updated = toggleBookmark(id);
    setBookmarkIds([...updated]);
  };

  return (
    <div className="page">
      <div className="page-header animate-in">
        <h1 className="page-title">Bookmarked Questions</h1>
        <p className="page-subtitle">{bookmarkedQs.length} saved question{bookmarkedQs.length !== 1 ? 's' : ''}</p>
      </div>

      {bookmarkedQs.length > 0 && (
        <div className="animate-in" style={{ marginBottom: '1.5rem' }}>
          <button className="btn btn-primary" onClick={() =>
            navigate('/practice', { state: { retryIds: bookmarkedQs.map(q => q.id) } })
          }>
            <Play size={16} /> Practice Bookmarked ({bookmarkedQs.length})
          </button>
        </div>
      )}

      {bookmarkedQs.length === 0 ? (
        <div className="empty-state animate-in">
          <div className="empty-icon">🔖</div>
          <h3>No bookmarks yet</h3>
          <p>Bookmark tough questions during a quiz to find them here</p>
        </div>
      ) : (
        <div className="animate-in">
          {bookmarkedQs.map((q, idx) => (
            <div key={q.id} className="bookmark-item">
              <div style={{ flex: 1 }}>
                <p>
                  <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>
                    {q.id.startsWith('u3') ? 'U3' : 'U4'}
                  </span>{' '}
                  {q.q}
                </p>
                <div className="bookmark-meta">
                  Answer: {String.fromCharCode(65 + q.answer)}) {q.options[q.answer]}
                </div>
              </div>
              <button className="btn btn-icon btn-secondary btn-sm" onClick={() => handleRemove(q.id)}
                style={{ color: 'var(--error)', flexShrink: 0 }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
