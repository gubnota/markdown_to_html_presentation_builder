#!/usr/bin/env bun

import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function buildPresentation() {
  console.log("🚀 Building presentation...");

  // Создаем папку dist
  await mkdir("./dist", { recursive: true });

  try {
    // Собираем JS bundle
    const result = await build({
      entryPoints: ["./app.jsx"],
      bundle: true,
      minify: true,
      format: "iife",
      globalName: "PresentationApp",
      write: false,
      jsx: "automatic",
      jsxImportSource: "react",
      platform: "browser",
      target: ["es2020"],
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      external: [], // встраиваем все зависимости
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
        ".ts": "tsx",
        ".tsx": "tsx",
      },
    });

    const jsCode = result.outputFiles[0].text;

    // Читаем CSS стили
    const baseCSS = await readFile("./src/styles/base.css", "utf-8");
    const mobileCSS = await readFile("./src/styles/mobile.css", "utf-8");
    const combinedCSS = baseCSS + "\n" + mobileCSS;

    // Читаем данные презентации
    const presentationMD = await readFile("./data/presentation.md", "utf-8");
    const escapedMD = presentationMD
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$");
    // Создаем итоговый HTML
    const htmlTemplate = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Презентация</title>
    <style>
        ${combinedCSS}

        /* Loading screen */
        .loading-screen {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--turquoise) 100%);
        }

        .loader {
            text-align: center;
            color: white;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--turquoise) 100%);
            color: white;
            text-align: center;
            padding: 40px;
        }

        .error-screen button {
            background: white;
            color: var(--primary-blue);
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 20px;
            cursor: pointer;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" defer></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" defer></script>
</head>
<body>
    <div id="root">
        <div class="loading-screen">
            <div class="loader">
                <div class="spinner"></div>
                <p>Загрузка презентации...</p>
            </div>
        </div>
    </div>

    <script>
        // Встраиваем данные презентации
        window.PRESENTATION_DATA = \`${escapedMD}\`;

        // Ожидаем загрузки всех библиотек
        function initApp() {
            if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof gsap !== 'undefined') {
                // Встраиваем JS код
                ${jsCode}
            } else {
                setTimeout(initApp, 100);
            }
        }

        document.addEventListener('DOMContentLoaded', initApp);
    </script>
</body>
</html>`;

    // Записываем итоговый файл
    await writeFile("./dist/index.html", htmlTemplate);

    console.log("✅ Презентация собрана в ./dist/index.html");
    console.log(`📦 Размер: \${(htmlTemplate.length / 1024).toFixed(1)} KB`);
  } catch (error) {
    console.error("❌ Ошибка сборки:", error);
    process.exit(1);
  }
}

buildPresentation();
