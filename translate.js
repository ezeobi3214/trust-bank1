/**
 * Trust Bank Draggable Translation Widget
 * Supports full mouse & touch drag-and-drop to anywhere on the screen with persistent position.
 */

(function () {
  const languages = [
    { code: 'af', name: 'Afrikaans' },
    { code: 'sq', name: 'Albanian' },
    { code: 'am', name: 'Amharic' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hy', name: 'Armenian' },
    { code: 'az', name: 'Azerbaijani' },
    { code: 'eu', name: 'Basque' },
    { code: 'be', name: 'Belarusian' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bs', name: 'Bosnian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'ca', name: 'Catalan' },
    { code: 'ceb', name: 'Cebuano' },
    { code: 'ny', name: 'Chichewa' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' },
    { code: 'co', name: 'Corsican' },
    { code: 'hr', name: 'Croatian' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'en', name: 'English' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'et', name: 'Estonian' },
    { code: 'tl', name: 'Filipino' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
    { code: 'fy', name: 'Frisian' },
    { code: 'gl', name: 'Galician' },
    { code: 'ka', name: 'Georgian' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ht', name: 'Haitian Creole' },
    { code: 'ha', name: 'Hausa' },
    { code: 'haw', name: 'Hawaiian' },
    { code: 'he', name: 'Hebrew' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hmn', name: 'Hmong' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'ig', name: 'Igbo' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ga', name: 'Irish' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'jw', name: 'Javanese' },
    { code: 'kn', name: 'Kannada' },
    { code: 'kk', name: 'Kazakh' },
    { code: 'km', name: 'Khmer' },
    { code: 'rw', name: 'Kinyarwanda' },
    { code: 'ko', name: 'Korean' },
    { code: 'ku', name: 'Kurdish (Kurmanji)' },
    { code: 'ky', name: 'Kyrgyz' },
    { code: 'lo', name: 'Lao' },
    { code: 'la', name: 'Latin' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'lb', name: 'Luxembourgish' },
    { code: 'mk', name: 'Macedonian' },
    { code: 'mg', name: 'Malagasy' },
    { code: 'ms', name: 'Malay' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mt', name: 'Maltese' },
    { code: 'mi', name: 'Maori' },
    { code: 'mr', name: 'Marathi' },
    { code: 'mn', name: 'Mongolian' },
    { code: 'my', name: 'Myanmar (Burmese)' },
    { code: 'ne', name: 'Nepali' },
    { code: 'no', name: 'Norwegian' },
    { code: 'or', name: 'Odia (Oriya)' },
    { code: 'ps', name: 'Pashto' },
    { code: 'fa', name: 'Persian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'sm', name: 'Samoan' },
    { code: 'gd', name: 'Scots Gaelic' },
    { code: 'sr', name: 'Serbian' },
    { code: 'st', name: 'Sesotho' },
    { code: 'sn', name: 'Shona' },
    { code: 'sd', name: 'Sindhi' },
    { code: 'si', name: 'Sinhala' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'so', name: 'Somali' },
    { code: 'es', name: 'Spanish' },
    { code: 'su', name: 'Sundanese' },
    { code: 'sw', name: 'Swahili' },
    { code: 'sv', name: 'Swedish' },
    { code: 'tg', name: 'Tajik' },
    { code: 'ta', name: 'Tamil' },
    { code: 'tt', name: 'Tatar' },
    { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' },
    { code: 'tr', name: 'Turkish' },
    { code: 'tk', name: 'Turkmen' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ug', name: 'Uyghur' },
    { code: 'uz', name: 'Uzbek' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'cy', name: 'Welsh' },
    { code: 'xh', name: 'Xhosa' },
    { code: 'yi', name: 'Yiddish' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'zu', name: 'Zulu' }
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

  function injectStyles() {
    if (document.getElementById('tb-translate-styles')) return;
    const style = document.createElement('style');
    style.id = 'tb-translate-styles';
    style.innerHTML = `
      .skiptranslate iframe { display: none !important; }
      body { top: 0 !important; }
      .goog-te-combo { display: none !important; }
      #custom-translate-widget {
        position: fixed;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
      }
      #translate-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #004ac6, #1d4ed8);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        touch-action: none;
      }
      #translate-btn:active {
        cursor: grabbing;
        transform: scale(0.96);
      }
      #translate-btn:hover {
        box-shadow: 0 6px 18px rgba(0, 74, 198, 0.4);
      }
      #translate-menu {
        display: none;
        position: absolute;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        width: 230px;
        max-height: 340px;
        overflow-y: auto;
        border: 1px solid #e2e8f0;
        z-index: 100000;
      }
      #translate-menu::-webkit-scrollbar { width: 5px; }
      #translate-menu::-webkit-scrollbar-track { background: #f8fafc; }
      #translate-menu::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      .translate-menu-header {
        padding: 10px 14px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: #64748b;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        letter-spacing: 0.05em;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .translate-option {
        padding: 10px 14px;
        cursor: pointer;
        color: #1e293b;
        transition: background 0.15s, color 0.15s;
        font-size: 13.5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f1f5f9;
      }
      .translate-option:last-child { border-bottom: none; }
      .translate-option:hover { background: #f1f5f9; color: #004ac6; }
      .translate-option.active { background: #e0e7ff; color: #1d4ed8; font-weight: 600; }
    `;
    document.head.appendChild(style);
  }

  function initWidget() {
    injectStyles();

    let widget = document.getElementById('custom-translate-widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'custom-translate-widget';
      widget.className = 'notranslate';
      widget.setAttribute('translate', 'no');
      document.body.appendChild(widget);
    }

    widget.innerHTML = `
      <div id="translate-menu" class="notranslate" translate="no">
        <div class="translate-menu-header">
          <span>Select Language</span>
          <span style="font-size: 10px; font-weight: normal; color: #94a3b8;">(Drag icon to move)</span>
        </div>
        <div id="translate-options-container"></div>
      </div>
      <button id="translate-btn" class="notranslate" translate="no" title="Change Language (Drag anywhere to move)" aria-label="Translate Website">
        <span class="material-symbols-outlined notranslate" translate="no" style="font-size: 24px; color: #ffffff; pointer-events: none;">translate</span>
      </button>
    `;

    let googleElem = document.getElementById('google_translate_element');
    if (!googleElem) {
      googleElem = document.createElement('div');
      googleElem.id = 'google_translate_element';
      googleElem.style.display = 'none';
      document.body.appendChild(googleElem);
    }

    const menu = document.getElementById('translate-menu');
    const btn = document.getElementById('translate-btn');
    const optionsContainer = document.getElementById('translate-options-container');

    // Populate languages
    let currentLang = 'en';
    const cookie = getCookie('googtrans');
    if (cookie) {
      const parts = cookie.split('/');
      if (parts.length > 2) currentLang = parts[2];
    }

    languages.forEach(lang => {
      const div = document.createElement('div');
      div.className = 'translate-option' + (currentLang === lang.code ? ' active' : '');
      div.innerHTML = `<span>${lang.name}</span>` + (currentLang === lang.code ? `<span class="material-symbols-outlined notranslate" style="font-size:16px;">check</span>` : '');
      div.onclick = (e) => {
        e.stopPropagation();
        menu.style.display = 'none';
        if (currentLang !== lang.code) setLanguage(lang.code);
      };
      optionsContainer.appendChild(div);
    });

    // ==========================================
    // POSITION PERSISTENCE & POSITIONING LOGIC
    // ==========================================
    function applySavedPosition() {
      const savedPos = localStorage.getItem('tb_translate_pos');
      const btnSize = 50;
      const margin = 16;
      let x, y;

      if (savedPos) {
        try {
          const parsed = JSON.parse(savedPos);
          x = parsed.x;
          y = parsed.y;
        } catch (e) {}
      }

      // Default bottom-right if no position saved or out-of-bounds
      if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
        x = window.innerWidth - btnSize - margin;
        y = window.innerHeight - btnSize - margin;
      }

      // Clamp to current viewport
      x = Math.max(margin, Math.min(x, window.innerWidth - btnSize - margin));
      y = Math.max(margin, Math.min(y, window.innerHeight - btnSize - margin));

      widget.style.left = x + 'px';
      widget.style.top = y + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
    }

    applySavedPosition();
    window.addEventListener('resize', applySavedPosition);

    function updateMenuPlacement() {
      const rect = widget.getBoundingClientRect();
      const menuHeight = 340;
      const menuWidth = 230;

      // Vertical placement: upward or downward
      if (rect.top > menuHeight + 20) {
        menu.style.bottom = '58px';
        menu.style.top = 'auto';
      } else {
        menu.style.top = '58px';
        menu.style.bottom = 'auto';
      }

      // Horizontal placement: right-aligned or left-aligned
      if (rect.left < menuWidth) {
        menu.style.left = '0px';
        menu.style.right = 'auto';
      } else {
        menu.style.right = '0px';
        menu.style.left = 'auto';
      }
    }

    // ==========================================
    // DRAGGABLE LOGIC (MOUSE & TOUCH)
    // ==========================================
    let isDragging = false;
    let dragThresholdPassed = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    function onStart(clientX, clientY) {
      isDragging = true;
      dragThresholdPassed = false;
      startX = clientX;
      startY = clientY;
      const rect = widget.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      btn.style.cursor = 'grabbing';
    }

    function onMove(clientX, clientY, e) {
      if (!isDragging) return;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      if (!dragThresholdPassed) {
        if (Math.hypot(deltaX, deltaY) > 5) {
          dragThresholdPassed = true;
          menu.style.display = 'none'; // Close menu when dragging starts
        }
      }

      if (dragThresholdPassed) {
        if (e && e.cancelable) e.preventDefault();

        const btnSize = 50;
        let newX = initialLeft + deltaX;
        let newY = initialTop + deltaY;

        // Viewport bounds
        newX = Math.max(8, Math.min(newX, window.innerWidth - btnSize - 8));
        newY = Math.max(8, Math.min(newY, window.innerHeight - btnSize - 8));

        widget.style.left = newX + 'px';
        widget.style.top = newY + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
      }
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      btn.style.cursor = 'grab';

      if (dragThresholdPassed) {
        const rect = widget.getBoundingClientRect();
        localStorage.setItem('tb_translate_pos', JSON.stringify({
          x: Math.round(rect.left),
          y: Math.round(rect.top)
        }));
        setTimeout(() => {
          dragThresholdPassed = false;
        }, 80);
      }
    }

    // Button Click: Only toggle if not dragged
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dragThresholdPassed) {
        return;
      }
      updateMenuPlacement();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
      }
    });

    // Google Translate script init
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
      }, 'google_translate_element');
    };

    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(s);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
