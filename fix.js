const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(
    /<link href=\"https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined:[^\"]+\" rel=\"stylesheet\">/g,
    '<link href=\"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1&display=swap\" rel=\"stylesheet\">'
  );
  fs.writeFileSync(f, content);
});

let receipt = fs.readFileSync('receipt.html', 'utf8');
receipt = receipt.replace(
  /} else if \(tx.status === 'Approved'\) {[^}]*}/s,
  `} else if (tx.status === 'Approved') {
      statusHtml = \`<span style="color: #16a34a; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 1.2rem; margin-top: 10px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> TRANSACTION SUCCESSFUL</span>\`;
    }`
);
fs.writeFileSync('receipt.html', receipt);
