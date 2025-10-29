import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Импортируем компоненты (будут созданы позже)
import { PresentationApp } from './src/PresentationApp.jsx';
import { loadPresentation } from './src/utils/markdownLoader.js';

function App() {
  const [presentationData, setPresentationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPresentation('./data/presentation.md')
      .then(data => {
        setPresentationData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="spinner"></div>
          <p>Загрузка презентации...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h1>Ошибка загрузки</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return <PresentationApp data={presentationData} />;
}

// Запуск приложения
if (typeof document !== 'undefined') {
  // Создаем корень React приложения
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  } else {
    console.error('Element with id "root" not found');
  }
}

export default App;