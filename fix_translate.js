const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newTranslateWidget = `
<!-- Custom Translate Widget -->
<div id="custom-translate-widget" class="notranslate" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: sans-serif;">
  <div id="translate-menu" style="display: none; position: absolute; bottom: 60px; right: 0; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); width: 220px; max-height: 350px; overflow-y: auto; border: 1px solid #e1e2e4;">
    <!-- Options injected by JS -->
  </div>
  <button id="translate-btn" style="width: 48px; height: 48px; border-radius: 50%; background: #004ac6; color: white; border: none; box-shadow: 0 4px 8px rgba(0,0,0,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
    <span class="material-symbols-outlined notranslate" style="font-size: 24px; color: white;">translate</span>
  </button>
</div>

<div id="google_translate_element" style="display: none;"></div>

<style>
/* Hide Google Translate Banner & native widget */
.skiptranslate iframe { display: none !important; }
body { top: 0 !important; }
.goog-te-combo { display: none !important; }
/* Scrollbar for menu */
#translate-menu::-webkit-scrollbar { width: 6px; }
#translate-menu::-webkit-scrollbar-track { background: transparent; }
#translate-menu::-webkit-scrollbar-thumb { background: #c3c6d7; border-radius: 4px; }
.translate-option { padding: 12px 16px; cursor: pointer; color: #141b2b; transition: background 0.2s; font-size: 14px; display: flex; align-items: center; border-bottom: 1px solid #f1f3ff; }
.translate-option:last-child { border-bottom: none; }
.translate-option:hover { background: #f1f3ff; }
.translate-option.active { background: #e9edff; color: #004ac6; font-weight: 600; }
</style>

<script type="text/javascript">
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'zh-CN', name: '中文 (简体)' },
    { code: 'zh-TW', name: '中文 (繁體)' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' },
    { code: 'ru', name: 'Русский' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pl', name: 'Polski' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'th', name: 'ไทย' },
    { code: 'id', name: 'Bahasa Indonesia' }
  ];

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setLanguage(langCode) {
    document.cookie = "googtrans=/en/" + langCode + "; path=/;";
    document.cookie = "googtrans=/en/" + langCode + "; domain=." + document.domain + "; path=/;";
    window.location.reload();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('translate-menu');
    const btn = document.getElementById('translate-btn');
    
    let currentLang = 'en';
    const cookie = getCookie('googtrans');
    if (cookie) {
      const parts = cookie.split('/');
      if (parts.length > 2) currentLang = parts[2];
    }

    languages.forEach(lang => {
      const div = document.createElement('div');
      div.className = 'translate-option' + (currentLang === lang.code ? ' active' : '');
      div.innerHTML = lang.name;
      div.onclick = () => {
        menu.style.display = 'none';
        if (currentLang !== lang.code) setLanguage(lang.code);
      };
      menu.appendChild(div);
    });

    btn.onclick = (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  });

  function googleTranslateElementInit() {
      new google.translate.TranslateElement({
          pageLanguage: 'en', 
          autoDisplay: false
      }, 'google_translate_element');
  }
</script>
<script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove old translate widget stuff.
  // The old block starts at '<div id="google_translate_element"' and ends right before '<script>\n  if ('serviceWorker' in navigator)'
  const oldTranslateRegex = /<div id="google_translate_element"[\s\S]*?<script type="text\/javascript" src="https:\/\/translate\.google\.com\/translate_a\/element\.js\?cb=googleTranslateElementInit"><\/script>\s*/;
  content = content.replace(oldTranslateRegex, '');

  // If there's an older variant without https
  const olderTranslateRegex = /<div id="google_translate_element"[\s\S]*?<script type="text\/javascript" src="\/\/:\/\/google\.com"><\/script>\s*/;
  content = content.replace(olderTranslateRegex, '');

  // 2. Add 'translate="no"' to material icons
  // Find <span class="material-symbols-outlined ...">
  content = content.replace(/class="([^"]*material-symbols-outlined[^"]*)"/g, (match, classes) => {
    if (!classes.includes('notranslate')) {
      return 'class="' + classes + ' notranslate"';
    }
    return match;
  });

  // Since notranslate is a class, it works. But let's also ensure translate="no" is added.
  // Using both is safest.
  content = content.replace(/(<span[^>]*class="[^"]*material-symbols-outlined[^"]*"[^>]*)>/gi, (match, p1) => {
    if (!p1.includes('translate=')) {
      return p1 + ' translate="no">';
    }
    return match;
  });

  // Also replace any standalone >Alex Morgan< if the tree walker is still doing stuff, but we did that already.

  // 3. Inject new custom widget before the PWA script or before </body>
  if (content.includes('<script>\n  if (\'serviceWorker\'')) {
    content = content.replace('<script>\n  if (\'serviceWorker\'', newTranslateWidget + '\n<script>\n  if (\'serviceWorker\'');
  } else {
    content = content.replace('</body>', newTranslateWidget + '\n</body>');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
}
