import React from 'react';

export function TitleSlide({ slide }) {
  const { title, attributes, content } = slide;

  return (
    <div className="title-slide-content">
      <div className="company-branding animate-item">
        <div className="company-logo">InnoBioSystems</div>
        <div className="company-tagline">Science and Medtech</div>
      </div>

      <div className="title-content animate-item">
        <h1 className="project-title">{title}</h1>
        {attributes.subtitle && (
          <p className="project-subtitle">{attributes.subtitle}</p>
        )}
      </div>

      <div className="title-meta animate-item">
        {attributes.date && <div className="presentation-date">{attributes.date}</div>}
        {attributes.author && <div className="presentation-author">{attributes.author}</div>}
      </div>

      {content && (
        <div 
          className="additional-content animate-item" 
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}