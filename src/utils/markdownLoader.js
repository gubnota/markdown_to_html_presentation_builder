export async function loadPresentation(path) {
  try {
    // В production данные уже встроены в window.PRESENTATION_DATA
    if (typeof window !== 'undefined' && window.PRESENTATION_DATA) {
      return window.PRESENTATION_DATA;
    }

    // В development загружаем файл
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Не удалось загрузить презентацию: \${response.statusText}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error('Ошибка загрузки презентации:', error);
    throw new Error('Не удалось загрузить файл презентации. Проверьте путь к data/presentation.md');
  }
}