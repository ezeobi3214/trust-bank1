const fs = require('fs');
let html = fs.readFileSync('dashboard.html', 'utf8');

html = html.replace('>Alex Morgan<', '>---<');
html = html.replace('>Alex Morgan<', '>---<');
html = html.replace('Checking ••4820', 'Checking ••----');
html = html.replace('Good morning, Alex', 'Good morning, ---');
html = html.replace('>24,850.40<', ' id="main-balance-text">---<');
html = html.replace('<span class="font-label-md text-label-md text-outline ml-space-xs">USD</span>', '<span class="font-label-md text-label-md text-outline ml-space-xs">USD</span>\n<button id="toggle-balance-btn" class="ml-2 text-on-surface-variant hover:text-on-surface flex items-center"><span class="material-symbols-outlined text-[20px]" id="toggle-balance-icon">visibility</span></button>');

html = html.replace(
  /<button class="px-space-md py-3 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-space-sm transition-all active:scale-\[0\.98\]" type="button">\s*<span class="material-symbols-outlined text-\[18px\] text-on-surface-variant">atm<\/span>\s*<span>Withdraw<\/span>\s*<\/button>/,
  `<a href="history.html" class="px-space-md py-3 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-space-sm transition-all active:scale-[0.98]">
<span class="material-symbols-outlined text-[18px] text-on-surface-variant">history</span>
<span>History</span>
</a>`
);

html = html.replace(
  /<button class="px-space-md py-3 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-space-sm transition-all active:scale-\[0\.98\]" type="button">\s*<span class="material-symbols-outlined text-\[18px\] text-on-surface-variant">add<\/span>\s*<span>Add Money<\/span>\s*<\/button>/,
  `<a href="chat.html" class="px-space-md py-3 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-space-sm transition-all active:scale-[0.98]">
<span class="material-symbols-outlined text-[18px] text-on-surface-variant">support_agent</span>
<span>Customer Care</span>
</a>`
);

html = html.replace('>•••• 4820<', '>•••• ----<');
html = html.replace('>$18,420.15<', '>---<');
html = html.replace('>$6,430.25<', '>---<');

fs.writeFileSync('dashboard.html', html);
