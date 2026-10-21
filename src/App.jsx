import { useState, useEffect } from 'react';

const STORAGE_KEY = 'counter-value';
const STEP_KEY = 'counter-step';

function loadCount() {
  const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  return Number.isNaN(stored) ? 0 : stored;
}

function loadStep() {
  const stored = parseInt(localStorage.getItem(STEP_KEY) || '1', 10);
  return Number.isNaN(stored) || stored === 0 ? 1 : stored;
}

export default function App() {
  const [count, setCount] = useState(loadCount);
  const [step, setStep] = useState(loadStep);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(count));
  }, [count]);

  useEffect(() => {
    localStorage.setItem(STEP_KEY, String(step));
  }, [step]);

  return (
    <div className="app">
      <h1>Counter</h1>
      <div className="count">{count}</div>
      <div className="step-control">
        <label htmlFor="step">Step:</label>
        <input
          id="step"
          type="number"
          value={step}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            setStep(Number.isNaN(v) ? 0 : v);
          }}
        />
      </div>
      <div className="buttons">
        <button onClick={() => setCount(count - step)}>− Decrement</button>
        <button onClick={() => setCount(count + step)}>+ Increment</button>
        <button className="danger" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </div>
  );
}
