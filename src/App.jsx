import { useState, useEffect } from 'react';

const STORAGE_KEY = 'counter-value';

function loadCount() {
  const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  return Number.isNaN(stored) ? 0 : stored;
}

export default function App() {
  const [count, setCount] = useState(loadCount);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(count));
  }, [count]);

  return (
    <div className="app">
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
