import { useState, useEffect } from 'react';

const COUNT_KEY = 'counter-value';
const STEP_KEY = 'counter-step';
const HISTORY_KEY = 'counter-history';
const MAX_HISTORY = 10;

function loadNumber(key, fallback) {
  const n = parseInt(localStorage.getItem(key) || String(fallback), 10);
  return Number.isNaN(n) ? fallback : n;
}

function loadHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    return Array.isArray(raw) ? raw.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [count, setCount] = useState(() => loadNumber(COUNT_KEY, 0));
  const [step, setStep] = useState(() => loadNumber(STEP_KEY, 1));
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    localStorage.setItem(COUNT_KEY, String(count));
  }, [count]);
  useEffect(() => {
    localStorage.setItem(STEP_KEY, String(step));
  }, [step]);
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  function applyChange(delta) {
    const next = count + delta;
    setCount(next);
    setHistory((h) => [{ delta, value: next, id: Date.now() }, ...h].slice(0, MAX_HISTORY));
  }

  function increment() { applyChange(step); }
  function decrement() { applyChange(-step); }
  function reset() {
    setCount(0);
    setHistory([]);
  }
  function undo() {
    if (history.length === 0) return;
    const [last, ...rest] = history;
    setCount(count - last.delta);
    setHistory(rest);
  }

  return (
    <div className="app">
      <h1>Counter</h1>
      <div className="count">{count}</div>

      <div className="step-row">
        <label>
          Step:
          <input
            type="number"
            min="1"
            max="1000"
            value={step}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!Number.isNaN(v) && v >= 1) setStep(v);
            }}
          />
        </label>
        <button
          className="secondary"
          disabled={history.length === 0}
          onClick={undo}
          title="Undo last action"
        >
          ↶ Undo
        </button>
      </div>

      <div className="buttons">
        <button onClick={decrement}>− {step}</button>
        <button onClick={increment}>+ {step}</button>
        <button className="danger" onClick={reset}>Reset</button>
      </div>

      {history.length > 0 && (
        <div className="history">
          <h2>History</h2>
          <ol>
            {history.map((h, i) => (
              <li key={h.id}>
                {h.delta > 0 ? '+' : ''}{h.delta} → <b>{h.value}</b>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}