import { marked } from 'marked';
import fm from 'front-matter';

export function parsePresentation(markdownContent) {
  try {
    // Разделяем на слайды по ---
    const slideBlocks = markdownContent.split(/^---$/gm).filter(block => block.trim());

    return slideBlocks.map((block, index) => {
      const parsed = fm(block.trim());
      const { attributes, body } = parsed;

      // Обрабатываем специальные расширения
      const processedBody = processMarkdownExtensions(body);

      // Парсим markdown в HTML
      const htmlContent = marked(processedBody);

      // Определяем тип слайда
      const slideType = attributes.type || detectSlideType(htmlContent, attributes);

      return {
        id: index,
        type: slideType,
        title: attributes.title || extractTitle(body),
        content: htmlContent,
        attributes,
        rawContent: body
      };
    });
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return [{
      id: 0,
      type: 'content',
      title: 'Ошибка',
      content: '<p>Ошибка парсинга презентации</p>',
      attributes: {},
      rawContent: 'Ошибка парсинга'
    }];
  }
}

function detectSlideType(htmlContent, attributes) {
  // Автоматическое определение типа слайда
  if (attributes.template) return attributes.template;
  if (attributes.stats && attributes.stats.length > 0) return 'stats';
  if (attributes.cards && attributes.cards.length > 0) return 'info-grid';

  const content = htmlContent.toLowerCase();

  if (content.includes('<table')) return 'table';
  if (content.includes('class="stats"') || content.includes('class="metrics"')) return 'stats';
  if (content.includes('class="info-grid"') || content.includes('class="cards"')) return 'info-grid';
  if (attributes.type === 'title' || content.includes('# ')) return 'title';

  return 'content'; // default
}

function extractTitle(markdown) {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].replace(/[📊🎯🚀💎⚡🏆]/g, '').trim() : 'Слайд';
}

export function processMarkdownExtensions(content) {
  // Обрабатываем специальные расширения для слайдов
  return content
    // Анимированные элементы
    .replace(/\{animate\}([\s\S]*?)\{\/animate\}/g, '<div class="animate-item">$1</div>')

    // Карточки статистики  
    .replace(/\{stat:([^}]+)\}([\s\S]*?)\{\/stat\}/g, 
      '<div class="stat-card animate-item"><div class="stat-value">$1</div><div class="stat-label">$2</div></div>')

    // Информационные карточки
    .replace(/\{card:([^}]+)\}([\s\S]*?)\{\/card\}/g,
      '<div class="info-card animate-item"><h3>$1</h3><div class="card-content">$2</div></div>')

    // Выделенные блоки
    .replace(/\{highlight\}([\s\S]*?)\{\/highlight\}/g,
      '<div class="highlight-box animate-item">$1</div>');
}