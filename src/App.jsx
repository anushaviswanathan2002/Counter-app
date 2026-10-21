import { useState, useEffect } from 'react';

const VALUE_KEY = 'counter-value';
const STEP_KEY = 'counter-step';
const HISTORY_KEY = 'counter-history';

function loadNumber(key, fallback) {
  const n = parseInt(localStorage.getItem(key) || '', 10);
  return Number.isNaN(n) ? fallback : n;
}

function loadHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(raw) ? raw.slice(-50) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [count, setCount] = useState(() => loadNumber(VALUE_KEY, 0));
  const [step, setStep] = useState(() => loadNumber(STEP_KEY, 1));
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    localStorage.setItem(VALUE_KEY, String(count));
  }, [count]);

  useEffect(() => {
    localStorage.setItem(STEP_KEY, String(step));
  }, [step]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-50)));
  }, [history]);

  function record(op, prev, next) {
    setHistory((h) => [...h, { op, prev, next, at: Date.now() }]);
  }

  function changeBy(delta) {
    setCount((prev) => {
      const next = prev + delta;
      record(delta > 0 ? `+${delta}` : `${delta}`, prev, next);
      return next;
    });
  }

  function reset() {
    setCount((prev) => {
      record('reset', prev, 0);
      return 0;
    });
  }

  function undo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const last = h[h.length - 1];
      setCount(last.prev);
      return h.slice(0, -1);
    });
  }

  function clearHistory() {
    setHistory([]);
  }

  return (
    <div className="app">
      <h1>Counter</h1>
      <div className="count">{count}</div>

      <div className="step-row">
        <label htmlFor="step">Step</label>
        <button
          className="step-btn"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          aria-label="Decrease step"
        >
          −
        </button>
        <input
          id="step"
          type="number"
          min="1"
          value={step}
          onChange={(e) => setStep(Math.max(1, parseInt(e.target.value, 10) || 1))}
        />
        <button
          className="step-btn"
          onClick={() => setStep((s) => s + 1)}
          aria-label="Increase step"
        >
          +
        </button>
      </div>

      <div className="buttons">
        <button onClick={() => changeBy(-step)}>− {step}</button>
        <button onClick={() => changeBy(+step)}>+ {step}</button>
        <button className="secondary" onClick={undo} disabled={history.length === 0}>
          Undo
        </button>
        <button className="danger" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="history">
        <div className="history-head">
          <span>History</span>
          <button
            className="link"
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            Clear
          </button>
        </div>
        {history.length === 0 ? (
          <div className="history-empty">No actions yet.</div>
        ) : (
          <ul className="history-list">
            {[...history].reverse().map((h, i) => (
              <li key={`${h.at}-${i}`} className={h.next > h.prev ? 'pos' : 'neg'}>
                <span className="op">{h.op}</span>
                <span className="arrow">{h.prev} → {h.next}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}