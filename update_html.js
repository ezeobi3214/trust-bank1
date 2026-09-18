const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const manifestLink = '\n<link rel="manifest" href="manifest.json">';
const translateDiv = '\n<div id="google_translate_element" style="position:fixed; bottom:20px; right:20px; z-index:9999;"></div>\n';
const pwaScript = `
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
</script>
`;
const translateScript = `
<!-- Google Translate Logic and Initialize Function -->
<script type="text/javascript">
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: 'en', 
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    }
</script>
<script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Insert manifest
  if (!content.includes('href="manifest.json"')) {
    content = content.replace('</head>', `${manifestLink}\n</head>`);
    modified = true;
  }

  // Insert translate div and PWA script if not already there
  if (!content.includes('navigator.serviceWorker.register')) {
    content = content.replace('</body>', `${pwaScript}\n</body>`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
