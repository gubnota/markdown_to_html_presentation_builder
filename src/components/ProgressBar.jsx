import React from 'react';

export function ProgressBar({ current, total }) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}