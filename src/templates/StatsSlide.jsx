import React from 'react';

export function StatsSlide({ slide }) {
  const { title, content, attributes } = slide;

  // Извлекаем статистики из атрибутов
  const stats = attributes.stats || [];

  return (
    <div className="stats-slide-wrapper">
      <header className="slide-header animate-item">
        <h1>{title}</h1>
        {attributes.subtitle && <p className="slide-subtitle">{attributes.subtitle}</p>}
      </header>

      {stats.length > 0 && (
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card animate-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              {stat.change && <div className="stat-change">{stat.change}</div>}
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