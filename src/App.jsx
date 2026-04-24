import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import DashboardPage from './pages/DashboardPage';
import BookmarksPage from './pages/BookmarksPage';
import RevisePage from './pages/RevisePage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/revise" element={<RevisePage />} />
      </Routes>
    </BrowserRouter>
  );
}
