import React from 'react';

export function InfoGridSlide({ slide }) {
  const { title, content, attributes } = slide;

  // Извлекаем карточки из атрибутов
  const cards = attributes.cards || [];

  return (
    <div className="info-grid-slide-wrapper">
      <header className="slide-header animate-item">
        <h1>{title}</h1>
        {attributes.subtitle && <p className="slide-subtitle">{attributes.subtitle}</p>}
      </header>

      {cards.length > 0 && (
        <div className="info-grid">
          {cards.map((card, index) => (
            <div key={index} className="info-card animate-item">
              {card.icon && <div className="card-icon">{card.icon}</div>}
              <h3 className="card-title">{card.title}</h3>
              <div className="card-content">{card.content}</div>
              {card.value && <div className="card-value">{card.value}</div>}
            </div>
          ))}
        </div>
      )}

      <div 
        className="slide-content animate-item"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}