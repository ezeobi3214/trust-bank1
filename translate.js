/**
 * Trust Bank Draggable Translation Widget
 * Supports full pointer, mouse & touch drag-and-drop to anywhere on the screen with persistent position.
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
        position: fixed !important;
        z-index: 999999 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        user-select: none !important;
        -webkit-user-select: none !important;
        touch-action: none !important;
      }
      #translate-btn {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: linear-gradient(135deg, #004ac6, #2563eb);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 4px 16px rgba(0, 74, 198, 0.4), 0 2px 8px rgba(0,0,0,0.25);
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }
      #translate-btn:active {
        cursor: grabbing !important;
        transform: scale(0.94);
      }
      #translate-btn:hover {
        box-shadow: 0 6px 22px rgba(0, 74, 198, 0.55);
      }
      #translate-menu {
        display: none;
        position: absolute;
        background: #ffffff;
        border-radius: 14px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 240px;
        max-height: 340px;
        overflow-y: auto;
        border: 1px solid #e2e8f0;
        z-index: 1000000;
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
        position: sticky;
        top: 0;
        z-index: 1;
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
          <span style="font-size: 10px; font-weight: normal; color: #94a3b8;">(Drag to move)</span>
        </div>
        <div id="translate-options-container"></div>
      </div>
      <button id="translate-btn" class="notranslate" translate="no" title="Change Language (Drag anywhere on screen)" aria-label="Translate Website">
        <span class="material-symbols-outlined notranslate" translate="no" style="font-size: 26px; color: #ffffff; pointer-events: none;">translate</span>
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
    const btnSize = 54;
    const margin = 16;

    function applySavedPosition() {
      const savedPos = localStorage.getItem('tb_translate_pos');
      let x, y;

      if (savedPos) {
        try {
          const parsed = JSON.parse(savedPos);
          x = parsed.x;
          y = parsed.y;
        } catch (e) {}
      }

      const vw = window.innerWidth || document.documentElement.clientWidth || 360;
      const vh = window.innerHeight || document.documentElement.clientHeight || 640;

      // Default bottom-right if no position saved or invalid
      if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
        x = vw - btnSize - margin;
        y = vh - btnSize - margin;
      }

      // Clamp to current viewport
      x = Math.max(8, Math.min(x, vw - btnSize - 8));
      y = Math.max(8, Math.min(y, vh - btnSize - 8));

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
      const menuWidth = 240;
      const vw = window.innerWidth || document.documentElement.clientWidth || 360;
      const vh = window.innerHeight || document.documentElement.clientHeight || 640;

      // Vertical placement: upward or downward
      if (rect.top > menuHeight + 20) {
        menu.style.bottom = '64px';
        menu.style.top = 'auto';
      } else {
        menu.style.top = '64px';
        menu.style.bottom = 'auto';
      }

      // Horizontal placement: right-aligned or left-aligned
      if (rect.left + menuWidth > vw) {
        menu.style.right = '0px';
        menu.style.left = 'auto';
      } else {
        menu.style.left = '0px';
        menu.style.right = 'auto';
      }
    }

    // ==========================================
    // BULLETPROOF DRAGGING LOGIC (POINTER + TOUCH + MOUSE)
    // ==========================================
    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let dragSuppressClickUntil = 0;

    function startDrag(clientX, clientY, pointerId) {
      isDragging = true;
      hasMoved = false;
      startX = clientX;
      startY = clientY;

      const rect = widget.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      btn.style.cursor = 'grabbing';

      if (pointerId !== undefined && btn.setPointerCapture) {
        try {
          btn.setPointerCapture(pointerId);
        } catch (_) {}
      }

      // Add window-level move & up listeners to track everywhere
      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp, { passive: false });
      window.addEventListener('pointercancel', onPointerUp, { passive: false });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: false });
      window.addEventListener('touchcancel', onTouchEnd, { passive: false });
      window.addEventListener('mousemove', onMouseMove, { passive: false });
      window.addEventListener('mouseup', onMouseUp, { passive: false });
    }

    function doMove(clientX, clientY, e) {
      if (!isDragging) return;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      if (!hasMoved) {
        if (Math.hypot(deltaX, deltaY) > 4) {
          hasMoved = true;
          menu.style.display = 'none'; // Close menu while dragging
        }
      }

      if (hasMoved) {
        if (e && e.cancelable) {
          e.preventDefault();
        }

        const vw = window.innerWidth || document.documentElement.clientWidth || 360;
        const vh = window.innerHeight || document.documentElement.clientHeight || 640;

        let newX = initialLeft + deltaX;
        let newY = initialTop + deltaY;

        // Viewport bounds clamping
        newX = Math.max(8, Math.min(newX, vw - btnSize - 8));
        newY = Math.max(8, Math.min(newY, vh - btnSize - 8));

        widget.style.left = newX + 'px';
        widget.style.top = newY + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
      }
    }

    function endDrag(pointerId) {
      if (!isDragging) return;
      isDragging = false;
      btn.style.cursor = 'grab';

      // Clean up window listeners
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (pointerId !== undefined && btn.releasePointerCapture) {
        try {
          btn.releasePointerCapture(pointerId);
        } catch (_) {}
      }

      if (hasMoved) {
        dragSuppressClickUntil = Date.now() + 350;
        const rect = widget.getBoundingClientRect();
        localStorage.setItem('tb_translate_pos', JSON.stringify({
          x: Math.round(rect.left),
          y: Math.round(rect.top)
        }));
      }
    }

    // Pointer events handlers
    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      startDrag(e.clientX, e.clientY, e.pointerId);
    }
    function onPointerMove(e) {
      doMove(e.clientX, e.clientY, e);
    }
    function onPointerUp(e) {
      endDrag(e.pointerId);
    }

    // Touch events handlers
    function onTouchStart(e) {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
      }
    }
    function onTouchMove(e) {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        doMove(t.clientX, t.clientY, e);
      }
    }
    function onTouchEnd() {
      endDrag();
    }

    // Mouse events handlers
    function onMouseDown(e) {
      if (e.button !== 0) return;
      startDrag(e.clientX, e.clientY);
    }
    function onMouseMove(e) {
      doMove(e.clientX, e.clientY, e);
    }
    function onMouseUp() {
      endDrag();
    }

    btn.addEventListener('pointerdown', onPointerDown);
    // Fallback for non-pointer browsers
    if (!window.PointerEvent) {
      btn.addEventListener('touchstart', onTouchStart, { passive: false });
      btn.addEventListener('mousedown', onMouseDown);
    }

    // Toggle menu
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hasMoved || Date.now() < dragSuppressClickUntil) {
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

    // Google Translate script initialization
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
