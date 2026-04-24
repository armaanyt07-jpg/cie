import { NavLink } from 'react-router-dom';
import { Home, PlayCircle, BarChart3, Bookmark, RotateCcw } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <div className="logo-icon">CIE</div>
        <span>MCQ Master</span>
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <Home size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Home
        </NavLink>
        <NavLink to="/practice" className={({ isActive }) => isActive ? 'active' : ''}>
          <PlayCircle size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Practice
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <BarChart3 size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Dashboard
        </NavLink>
        <NavLink to="/bookmarks" className={({ isActive }) => isActive ? 'active' : ''}>
          <Bookmark size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Saved
        </NavLink>
        <NavLink to="/revise" className={({ isActive }) => isActive ? 'active' : ''}>
          <RotateCcw size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Revise
        </NavLink>
      </div>
    </nav>
  );
}
