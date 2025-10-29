import React from 'react';

export function Navigation({ onPrev, onNext, canGoPrev, canGoNext, isAnimating }) {
  return (
    <nav className="presentation-navigation">
      <button 
        className="nav-btn prev-btn"
        onClick={onPrev}
        disabled={!canGoPrev || isAnimating}
        aria-label="Предыдущий слайд"
      >
        ◀ Назад
      </button>

      <button 
        className="nav-btn next-btn"
        onClick={onNext}
        disabled={!canGoNext || isAnimating}
        aria-label="Следующий слайд"
      >
        Вперед ▶
      </button>
    </nav>
  );
}