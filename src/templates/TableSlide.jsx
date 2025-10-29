import React from 'react';

export function TableSlide({ slide }) {
  const { title, content, attributes } = slide;

  return (
    <div className="table-slide-wrapper">
      <header className="slide-header animate-item">
        <h1>{title}</h1>
        {attributes.subtitle && <p className="slide-subtitle">{attributes.subtitle}</p>}
      </header>

      <div className="table-container animate-item">
        <div 
          className="slide-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {attributes.notes && (
        <div className="table-notes animate-item">
          <p>{attributes.notes}</p>
        </div>
      )}
    </div>
  );
}