import React from 'react';

export function ContentSlide({ slide }) {
  const { title, content, attributes } = slide;

  return (
    <div className="content-slide-wrapper">
      <header className="slide-header animate-item">
        <h1>{title}</h1>
        {attributes.subtitle && <p className="slide-subtitle">{attributes.subtitle}</p>}
      </header>

      <main 
        className="slide-content animate-item"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {attributes.footer && (
        <footer className="slide-footer animate-item">
          {attributes.footer}
        </footer>
      )}
    </div>
  );
}