import { useState, useEffect } from 'react';

const STORAGE_KEY = 'counter-value';
const THEME_KEY = 'counter-theme';

function loadCount() {
  const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  return Number.isNaN(stored) ? 0 : stored;
}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) === 'dark';
}

export default function App() {
  const [count, setCount] = useState(loadCount);
  const [dark, setDark] = useState(loadTheme);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(count));
  }, [count]);

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="app">
      <button
        className="theme-toggle"
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle dark mode"
      >
        {dark ? '☀️' : '🌙'}
      </button>
      <h1>Counter</h1>
      <div className="count">{count}</div>
      <div className="buttons">
        <button onClick={() => setCount(count - 1)}>− Decrement</button>
        <button onClick={() => setCount(count + 1)}>+ Increment</button>
        <button className="danger" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </div>
  );
}
