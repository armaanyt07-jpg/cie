const STORAGE_KEY = 'cie_mcq_data';

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getWrongAnswers() {
  return getStore().wrongAnswers || [];
}

export function addWrongAnswer(questionId) {
  const store = getStore();
  if (!store.wrongAnswers) store.wrongAnswers = [];
  if (!store.wrongAnswers.includes(questionId)) {
    store.wrongAnswers.push(questionId);
  }
  saveStore(store);
}

export function removeWrongAnswer(questionId) {
  const store = getStore();
  if (!store.wrongAnswers) return;
  store.wrongAnswers = store.wrongAnswers.filter(id => id !== questionId);
  saveStore(store);
}

export function getBookmarks() {
  return getStore().bookmarks || [];
}

export function toggleBookmark(questionId) {
  const store = getStore();
  if (!store.bookmarks) store.bookmarks = [];
  const idx = store.bookmarks.indexOf(questionId);
  if (idx >= 0) store.bookmarks.splice(idx, 1);
  else store.bookmarks.push(questionId);
  saveStore(store);
  return store.bookmarks;
}

export function getStats() {
  return getStore().stats || { totalAttempted: 0, totalCorrect: 0, totalWrong: 0, quizHistory: [], weakTopics: {} };
}

export function saveQuizResult(result) {
  const store = getStore();
  if (!store.stats) store.stats = { totalAttempted: 0, totalCorrect: 0, totalWrong: 0, quizHistory: [], weakTopics: {} };
  store.stats.totalAttempted += result.total;
  store.stats.totalCorrect += result.correct;
  store.stats.totalWrong += result.wrong;
  store.stats.quizHistory.push({ ...result, date: new Date().toISOString() });
  // Track weak topics
  if (result.wrongIds) {
    result.wrongIds.forEach(id => {
      const unit = id.startsWith('u3') ? 'Unit 3' : 'Unit 4';
      if (!store.stats.weakTopics[unit]) store.stats.weakTopics[unit] = 0;
      store.stats.weakTopics[unit]++;
    });
  }
  saveStore(store);
}

export function getMarkedForReview() {
  return getStore().markedForReview || [];
}

export function toggleMarkForReview(questionId) {
  const store = getStore();
  if (!store.markedForReview) store.markedForReview = [];
  const idx = store.markedForReview.indexOf(questionId);
  if (idx >= 0) store.markedForReview.splice(idx, 1);
  else store.markedForReview.push(questionId);
  saveStore(store);
  return store.markedForReview;
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}
