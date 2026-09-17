const defaultTransactions = [
  { id: 't1', payee: 'Apple Store', date: 'Today, 10:14 AM', amount: -899.00, type: 'card outgoing', status: 'Approved', category: 'Hardware', createdAt: Date.now() - 10000000 },
  { id: 't2', payee: 'Payroll Direct Deposit', date: 'Yesterday', amount: 4250.00, type: 'incoming', status: 'Approved', category: 'Acme Corp', createdAt: Date.now() - 20000000 },
  { id: 't3', payee: 'Whole Foods Market', date: 'Oct 22, 2025', amount: -84.20, type: 'card outgoing', status: 'Approved', category: 'Groceries', createdAt: Date.now() - 30000000 }
];

const defaultProfile = {
  name: 'Alex Morgan',
  dob: 'March 14, 1991',
  email: 'alex.morgan@domain.com',
  phone: '+1 (555) 234-8901',
  address: '742 Evergreen Terrace, Suite 400, San Francisco, CA 94107',
  checking: '0923 8491 4820',
  routing: '121000358',
  savings: '3847 2910 9104'
};

function initState() {
  if (!localStorage.getItem('tb_initialized')) {
    localStorage.setItem('tb_balance', '24850.40');
    localStorage.setItem('tb_transferLimit', '5000.00');
    localStorage.setItem('tb_transactions', JSON.stringify(defaultTransactions));
    localStorage.setItem('tb_profile', JSON.stringify(defaultProfile));
    localStorage.setItem('tb_messages', JSON.stringify([]));
    localStorage.setItem('tb_initialized', 'true');
  }
}

function getProfile() {
  return JSON.parse(localStorage.getItem('tb_profile') || JSON.stringify(defaultProfile));
}

function setProfile(profileObj) {
  localStorage.setItem('tb_profile', JSON.stringify(profileObj));
}

function getMessages() {
  return JSON.parse(localStorage.getItem('tb_messages') || '[]');
}

function addMessage(sender, text) {
  const msgs = getMessages();
  msgs.push({ sender, text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
  localStorage.setItem('tb_messages', JSON.stringify(msgs));
}

function getBalance() {
  return parseFloat(localStorage.getItem('tb_balance') || '0');
}

function setBalance(amount) {
  localStorage.setItem('tb_balance', amount.toFixed(2));
}

function getTransferLimit() {
  return parseFloat(localStorage.getItem('tb_transferLimit') || '5000');
}

function setTransferLimit(amount) {
  localStorage.setItem('tb_transferLimit', amount.toFixed(2));
}

function getTransactions() {
  let txs = JSON.parse(localStorage.getItem('tb_transactions') || '[]');
  let updated = false;
  const now = Date.now();
  
  // Auto-decline pending transactions older than 3 minutes (180000 ms)
  txs.forEach(tx => {
    if (tx.status === 'Pending' && tx.createdAt && (now - tx.createdAt > 180000)) {
      tx.status = 'Declined';
      tx.note = 'Declined: Go to Customer Care';
      updated = true;
    }
  });
  
  if (updated) {
    localStorage.setItem('tb_transactions', JSON.stringify(txs));
  }
  
  return txs;
}

function getTransaction(id) {
  const txs = getTransactions();
  return txs.find(t => t.id === id);
}

function addTransaction(tx) {
  const txs = getTransactions();
  tx.id = 't_' + Date.now();
  tx.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  tx.createdAt = Date.now();
  txs.unshift(tx);
  localStorage.setItem('tb_transactions', JSON.stringify(txs));
  return tx.id;
}

function updateTransactionStatus(id, status) {
  const txs = getTransactions();
  const tx = txs.find(t => t.id === id);
  if (tx && tx.status === 'Pending') {
    tx.status = status;
    if (status === 'Approved' && tx.amount < 0) {
      // Deduct from balance
      setBalance(getBalance() + tx.amount);
    }
    localStorage.setItem('tb_transactions', JSON.stringify(txs));
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Initialize on script load
initState();
