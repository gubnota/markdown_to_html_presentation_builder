import React from 'react';
import { TitleSlide } from '../templates/TitleSlide.jsx';
import { ContentSlide } from '../templates/ContentSlide.jsx';
import { StatsSlide } from '../templates/StatsSlide.jsx';
import { TableSlide } from '../templates/TableSlide.jsx';
import { InfoGridSlide } from '../templates/InfoGridSlide.jsx';

const slideTemplates = {
  title: TitleSlide,
  content: ContentSlide,
  stats: StatsSlide,
  table: TableSlide,
  'info-grid': InfoGridSlide
};

export function SlideRenderer({ slide, isActive, slideIndex }) {
  const SlideComponent = slideTemplates[slide.type] || ContentSlide;

  return (
    <div 
      className={`slide ${slide.type}-slide ${isActive ? 'active' : ''}`}
      data-slide={slideIndex}
      style={{ display: isActive ? 'block' : 'none' }}
    >
      <SlideComponent slide={slide} />
    </div>
  );
}