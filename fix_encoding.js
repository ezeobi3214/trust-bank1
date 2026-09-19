const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const safeLanguages = `
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Espa\\u00f1ol' },
    { code: 'fr', name: 'Fran\\u00e7ais' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Portugu\\u00eas' },
    { code: 'zh-CN', name: '\\u4e2d\\u6587 (\\u7b80\\u4f53)' },
    { code: 'zh-TW', name: '\\u4e2d\\u6587 (\\u7e41\\u9ad4)' },
    { code: 'ja', name: '\\u65e5\\u672c\\u8a9e' },
    { code: 'ko', name: '\\ud55c\\uad6d\\uc5b4' },
    { code: 'ar', name: '\\u0627\\u0644\\u0639\\u0631\\u0628\\u064a\\u0629' },
    { code: 'ru', name: '\\u0420\\u0443\\u0441\\u0441\\u043a\\u0438\\u0439' },
    { code: 'hi', name: '\\u0939\\u093f\\u0928\\u094d\\u0926\\u0940' },
    { code: 'tr', name: 'T\\u00fcrk\\u00e7e' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pl', name: 'Polski' },
    { code: 'vi', name: 'Ti\\u1ebfng Vi\\u1ec7t' },
    { code: 'th', name: '\\u0e44\\u0e17\\u0e22' },
    { code: 'id', name: 'Bahasa Indonesia' }
  ];
`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match the old corrupted languages array
  const languagesRegex = /const languages = \[[^\]]+\];/;
  content = content.replace(languagesRegex, safeLanguages.trim());

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed encoding in ' + file);
}
