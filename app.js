import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// Your verified web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz1tego-FMhtuD7tGr2Cj1ZLtxdE4NTjs",
  authDomain: "apexx-ff8bc.firebaseapp.com",
  projectId: "apexx-ff8bc",
  storageBucket: "apexx-ff8bc.firebasestorage.app",
  messagingSenderId: "690467870799",
  appId: "1:690467870799:web:be7b185cb9b7349bdff23a",
  measurementId: "G-YR7YX1FMJ7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Single global document reference point for cross-device syncing
const dbRef = doc(db, "app_state", "global_data");

export const defaultTransactions1 = [
  { id: 't1', payee: 'Apple Store', date: 'Today, 10:14 AM', amount: -899.00, type: 'card outgoing', status: 'Approved', category: 'Hardware', createdAt: Date.now() - 10000000 },
  { id: 't2', payee: 'Payroll Direct Deposit', date: 'Yesterday', amount: 4250.00, type: 'incoming', status: 'Approved', category: 'Acme Corp', createdAt: Date.now() - 20000000 },
  { id: 't3', payee: 'Whole Foods Market', date: 'Oct 22, 2025', amount: -84.20, type: 'card outgoing', status: 'Approved', category: 'Groceries', createdAt: Date.now() - 30000000 }
];

export const defaultTransactions2 = [
  { id: 't201', payee: 'Nordstrom', date: 'Today, 11:30 AM', amount: -245.50, type: 'card outgoing', status: 'Approved', category: 'Shopping', createdAt: Date.now() - 5000000 },
  { id: 't202', payee: 'Consulting Retainer Direct Deposit', date: 'Yesterday', amount: 3800.00, type: 'incoming', status: 'Approved', category: 'Income', createdAt: Date.now() - 15000000 },
  { id: 't203', payee: 'Trader Joe\'s', date: 'Oct 20, 2025', amount: -92.40, type: 'card outgoing', status: 'Approved', category: 'Groceries', createdAt: Date.now() - 25000000 }
];

export const defaultProfile1 = {
  name: 'Alex Morgan',
  dob: 'March 14, 1991',
  email: 'alex.morgan@domain.com',
  phone: '+1 (555) 234-8901',
  address: '742 Evergreen Terrace, Suite 400, San Francisco, CA 94107',
  checking: '0923 8491 4820',
  routing: '121000358',
  savings: '3847 2910 9104',
  avatar: ''
};

export const defaultProfile2 = {
  name: 'Jordan Taylor',
  dob: 'July 22, 1994',
  email: 'jordan.taylor@domain.com',
  phone: '+1 (555) 987-6543',
  address: '1024 Market Street, Apt 5B, San Francisco, CA 94103',
  checking: '5821 9302 1145',
  routing: '121000358',
  savings: '6712 4430 8921',
  avatar: ''
};

export const defaultState = {
  accounts: {
    account1: {
      id: 'account1',
      email: '@trustbank25',
      password: '222653',
      balance: 24850.40,
      transferLimit: 5000.00,
      profile: defaultProfile1,
      transactions: defaultTransactions1,
      messages: []
    },
    account2: {
      id: 'account2',
      email: '@trustbank26',
      password: '222653',
      balance: 18450.00,
      transferLimit: 5000.00,
      profile: defaultProfile2,
      transactions: defaultTransactions2,
      messages: []
    }
  },
  tb_admin_email: 'admin@com',
  tb_admin_pass: '00000',
  tb_messages: [],
  // Legacy backward compatibility fields
  tb_balance: 24850.40,
  tb_transferLimit: 5000.00,
  tb_transactions: defaultTransactions1,
  tb_profile: defaultProfile1,
  tb_user_email: '@trustbank25',
  tb_user_pass: '222653'
};

export function formatCurrency(value) {
  const amount = Number.parseFloat(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    : '$0.00';
}

// Current active session account helper
export function getCurrentAccountId() {
  try {
    return sessionStorage.getItem('tb_current_account') || localStorage.getItem('tb_current_account') || 'account1';
  } catch (e) {
    return 'account1';
  }
}

export function setCurrentAccountId(accountId) {
  try {
    sessionStorage.setItem('tb_current_account', accountId);
    localStorage.setItem('tb_current_account', accountId);
  } catch (e) {
    console.error('Failed to set current account id:', e);
  }
}

// Normalizes an account object to make sure it has all required fields
function normalizeAccount(raw, defaultAcc) {
  if (!raw) return { ...defaultAcc };
  return {
    ...defaultAcc,
    ...raw,
    balance: Number.isFinite(parseFloat(raw.balance)) ? parseFloat(raw.balance) : defaultAcc.balance,
    transferLimit: Number.isFinite(parseFloat(raw.transferLimit)) ? parseFloat(raw.transferLimit) : defaultAcc.transferLimit,
    profile: {
      ...defaultAcc.profile,
      ...(raw.profile || {})
    },
    transactions: Array.isArray(raw.transactions) ? raw.transactions : (defaultAcc.transactions || []),
    messages: Array.isArray(raw.messages) ? raw.messages : (defaultAcc.messages || [])
  };
}

const initialization = initializeState();

// Checks if database is blank or needs migration to 2 accounts
export async function initializeState() {
  try {
    const docSnap = await getDoc(dbRef);
    if (!docSnap.exists()) {
      await setDoc(dbRef, defaultState);
      console.log("Firebase Database successfully initialized with multi-account baseline!");
      return defaultState;
    }

    const data = docSnap.data();
    const patches = {};

    // Check if multi-account structure exists
    let accounts = data.accounts || {};
    let needsUpdate = false;

    if (!accounts.account1) {
      needsUpdate = true;
      accounts.account1 = {
        id: 'account1',
        email: data.tb_user_email || '@trustbank25',
        password: data.tb_user_pass || '222653',
        balance: parseFloat(data.tb_balance) || 24850.40,
        transferLimit: parseFloat(data.tb_transferLimit) || 5000.00,
        profile: data.tb_profile ? { ...defaultProfile1, ...data.tb_profile } : defaultProfile1,
        transactions: data.tb_transactions || defaultTransactions1,
        messages: Array.isArray(data.tb_messages) ? data.tb_messages : []
      };
    } else {
      if (!Array.isArray(accounts.account1.messages)) {
        accounts.account1.messages = Array.isArray(data.tb_messages) ? data.tb_messages : [];
        needsUpdate = true;
      }
      accounts.account1 = normalizeAccount(accounts.account1, defaultState.accounts.account1);
    }

    if (!accounts.account2) {
      needsUpdate = true;
      accounts.account2 = {
        id: 'account2',
        email: '@trustbank26',
        password: '222653',
        balance: 18450.00,
        transferLimit: 5000.00,
        profile: defaultProfile2,
        transactions: defaultTransactions2,
        messages: []
      };
    } else {
      if (!Array.isArray(accounts.account2.messages)) {
        accounts.account2.messages = [];
        needsUpdate = true;
      }
      accounts.account2 = normalizeAccount(accounts.account2, defaultState.accounts.account2);
    }

    if (needsUpdate) {
      patches.accounts = accounts;
      // Also ensure admin credentials
      if (!data.tb_admin_email) patches.tb_admin_email = 'admin@com';
      if (!data.tb_admin_pass) patches.tb_admin_pass = '00000';
      await setDoc(dbRef, patches, { merge: true });
      console.log("Firebase database migrated to multi-account schema!");
    }

    return { ...data, ...patches };
  } catch (error) {
    console.error("Initialization failure:", error);
    return defaultState;
  }
}

export const initState = initializeState;

// GET ALL ACCOUNTS (useful for admin and login)
export async function getAllAccounts() {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const accounts = data.accounts || {};
      return {
        account1: normalizeAccount(accounts.account1, defaultState.accounts.account1),
        account2: normalizeAccount(accounts.account2, defaultState.accounts.account2)
      };
    }
    return defaultState.accounts;
  } catch (error) {
    console.error("Read failure (accounts):", error);
    return defaultState.accounts;
  }
}

// GET SINGLE ACCOUNT DATA
export async function getAccount(accountId = getCurrentAccountId()) {
  const accounts = await getAllAccounts();
  return accounts[accountId] || accounts.account1;
}

// UPDATE ENTIRE ACCOUNT
export async function updateAccount(accountId, updates) {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    const data = docSnap.exists() ? docSnap.data() : defaultState;
    const currentAccounts = data.accounts || defaultState.accounts;
    const existing = currentAccounts[accountId] || defaultState.accounts[accountId];

    const updatedAccount = {
      ...existing,
      ...updates,
      profile: {
        ...(existing.profile || {}),
        ...(updates.profile || {})
      }
    };

    const newAccounts = {
      ...currentAccounts,
      [accountId]: updatedAccount
    };

    const patches = { accounts: newAccounts };

    // If updating account1, keep legacy fields in sync
    if (accountId === 'account1') {
      if (updatedAccount.balance !== undefined) patches.tb_balance = updatedAccount.balance;
      if (updatedAccount.transferLimit !== undefined) patches.tb_transferLimit = updatedAccount.transferLimit;
      if (updatedAccount.profile) patches.tb_profile = updatedAccount.profile;
      if (updatedAccount.email) patches.tb_user_email = updatedAccount.email;
      if (updatedAccount.password) patches.tb_user_pass = updatedAccount.password;
      if (updatedAccount.transactions !== undefined) patches.tb_transactions = updatedAccount.transactions;
      if (updatedAccount.messages !== undefined) patches.tb_messages = updatedAccount.messages;
    }

    await setDoc(dbRef, patches, { merge: true });
    console.log(`Account ${accountId} successfully synchronized.`);
    return updatedAccount;
  } catch (error) {
    console.error(`Write failure (account ${accountId}):`, error);
    throw error;
  }
}

// PROFILE LOGIC
export async function getProfile(accountId = getCurrentAccountId()) {
  try {
    const acc = await getAccount(accountId);
    return acc.profile || (accountId === 'account2' ? defaultProfile2 : defaultProfile1);
  } catch (error) {
    console.error("Read failure (profile):", error);
    return accountId === 'account2' ? defaultProfile2 : defaultProfile1;
  }
}

export async function setProfile(profileObj, accountId = getCurrentAccountId()) {
  try {
    await initialization;
    const acc = await getAccount(accountId);
    const updatedProfile = { ...acc.profile, ...profileObj };
    await updateAccount(accountId, { profile: updatedProfile });
    console.log(`Profile for ${accountId} synchronized cross-device.`);
  } catch (error) {
    console.error("Write failure (profile):", error);
  }
}

// BALANCE & LIMIT LOGIC
export async function getFinancials(accountId = getCurrentAccountId()) {
  try {
    const acc = await getAccount(accountId);
    return {
      balance: parseFloat(acc.balance) || 0,
      limit: parseFloat(acc.transferLimit) || 0
    };
  } catch (error) {
    console.error("Read failure (financials):", error);
    return { balance: 24850.40, limit: 5000.00 };
  }
}

export async function updateFinancials(balance, limit, accountId = getCurrentAccountId()) {
  try {
    const balNum = parseFloat(parseFloat(balance).toFixed(2));
    const limNum = parseFloat(parseFloat(limit).toFixed(2));
    await updateAccount(accountId, {
      balance: balNum,
      transferLimit: limNum
    });
    console.log(`Financials for ${accountId} updated: bal=${balNum}, lim=${limNum}`);
  } catch (error) {
    console.error("Write failure (financials):", error);
  }
}

// TRANSACTIONS LOGIC
export async function getTransactions(accountId = getCurrentAccountId()) {
  try {
    const acc = await getAccount(accountId);
    return acc.transactions || [];
  } catch (error) {
    console.error("Read failure (transactions):", error);
    return [];
  }
}

export async function addTransaction(newTx, accountId = getCurrentAccountId()) {
  try {
    await initialization;
    const acc = await getAccount(accountId);
    const currentTx = acc.transactions || [];
    const transaction = {
      ...newTx,
      id: newTx.id || `tx-${Date.now()}`,
      accountId: accountId,
      accountName: acc.profile?.name || (accountId === 'account2' ? 'Jordan Taylor' : 'Alex Morgan'),
      date: newTx.date || new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      createdAt: newTx.createdAt || Date.now()
    };
    
    await updateAccount(accountId, {
      transactions: [transaction, ...currentTx]
    });
    
    return transaction.id;
  } catch (error) {
    console.error("Write failure (transaction):", error);
    return null;
  }
}

// GET TRANSACTION BY ID (searches active account first, then all accounts)
export async function getTransaction(id, accountId = null) {
  try {
    if (accountId) {
      const txs = await getTransactions(accountId);
      const found = txs.find(t => t.id === id);
      if (found) return found;
    }
    const accounts = await getAllAccounts();
    for (const key of ['account1', 'account2']) {
      const txs = accounts[key]?.transactions || [];
      const found = txs.find(t => t.id === id);
      if (found) return { ...found, accountId: key };
    }
    return null;
  } catch (e) {
    console.error('getTransaction error:', e);
    return null;
  }
}

// UPDATE TRANSACTION STATUS (Handles deduction on approval per account)
export async function updateTransactionStatus(id, status, note = '') {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    if (!docSnap.exists()) return;
    const data = docSnap.data();
    const accounts = data.accounts || defaultState.accounts;

    let targetAccountId = null;
    let foundTx = null;

    for (const key of ['account1', 'account2']) {
      const txList = accounts[key]?.transactions || [];
      const match = txList.find(t => t.id === id);
      if (match) {
        targetAccountId = key;
        foundTx = match;
        break;
      }
    }

    if (!targetAccountId || !foundTx) {
      console.warn("Transaction not found for id:", id);
      return;
    }

    const acc = accounts[targetAccountId];
    let currentBalance = parseFloat(acc.balance) || 0;
    let deductedAmount = 0;

    const updatedTransactions = (acc.transactions || []).map(tx => {
      if (tx.id === id) {
        if (status === 'Approved' && tx.status !== 'Approved') {
          const amt = parseFloat(tx.amount) || 0;
          if (amt < 0) {
            deductedAmount = amt;
            currentBalance += amt;
          }
        }
        return { ...tx, status, ...(note ? { note } : {}) };
      }
      return tx;
    });

    const newBalance = parseFloat(currentBalance.toFixed(2));
    console.log(`[updateTransactionStatus] account=${targetAccountId} id=${id} status=${status} deducted=${deductedAmount} newBal=${newBalance}`);

    await updateAccount(targetAccountId, {
      transactions: updatedTransactions,
      balance: newBalance
    });

  } catch (err) {
    console.error('updateTransactionStatus error:', err);
  }
}

// ALL PENDING TRANSACTIONS (From all accounts for the Admin panel)
export async function getAllPendingTransactions() {
  try {
    const accounts = await getAllAccounts();
    const list = [];
    ['account1', 'account2'].forEach(accKey => {
      const acc = accounts[accKey];
      if (acc && Array.isArray(acc.transactions)) {
        acc.transactions
          .filter(t => t.status === 'Pending')
          .forEach(t => {
            list.push({
              ...t,
              accountId: accKey,
              accountName: acc.profile?.name || (accKey === 'account2' ? 'Jordan Taylor' : 'Alex Morgan'),
              accountEmail: acc.email
            });
          });
      }
    });
    // Sort newest first
    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (e) {
    console.error("Failed to load all pending transactions:", e);
    return [];
  }
}

// CLEAR TRANSACTIONS (Strictly isolated by accountId)
export async function clearTransactions(accountId = getCurrentAccountId()) {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    const data = docSnap.exists() ? docSnap.data() : defaultState;
    const currentAccounts = data.accounts || defaultState.accounts;

    if (accountId === 'all') {
      const updatedAccounts = {
        ...currentAccounts,
        account1: { ...(currentAccounts.account1 || {}), transactions: [] },
        account2: { ...(currentAccounts.account2 || {}), transactions: [] }
      };
      await setDoc(dbRef, { accounts: updatedAccounts, tb_transactions: [] }, { merge: true });
      console.log("All transactions cleared across both accounts.");
      return;
    }

    const targetId = (accountId === 'account2') ? 'account2' : 'account1';
    const targetAcc = currentAccounts[targetId] || defaultState.accounts[targetId] || {};
    
    const updatedAccount = {
      ...targetAcc,
      transactions: []
    };

    const newAccounts = {
      ...currentAccounts,
      [targetId]: updatedAccount
    };

    const patches = { accounts: newAccounts };
    if (targetId === 'account1') {
      patches.tb_transactions = [];
    }

    await setDoc(dbRef, patches, { merge: true });
    console.log(`Transactions cleared exclusively for ${targetId}.`);
  } catch (error) {
    console.error(`Failed to clear transactions for ${accountId}:`, error);
  }
}

// PASSWORDS & CREDENTIALS LOGIC
export async function getPasswords(accountId = 'account1') {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const accounts = data.accounts || {};
      const targetAcc = accounts[accountId] || accounts.account1 || {};
      return {
        userPass: targetAcc.password || data.tb_user_pass || '',
        adminPass: data.tb_admin_pass || '',
        adminEmail: data.tb_admin_email || 'admin@com',
        userEmail: targetAcc.email || data.tb_user_email || ''
      };
    }
  } catch (err) {
    console.error("Read failure (passwords):", err);
  }
  return { userPass: '', adminPass: '', userEmail: '' };
}

export async function updatePasswords(userPass, adminPass, accountId = 'account1') {
  try {
    await initialization;
    const patches = {};
    if (adminPass) patches.tb_admin_pass = adminPass;
    if (Object.keys(patches).length > 0) {
      await setDoc(dbRef, patches, { merge: true });
    }

    if (userPass) {
      await updateAccount(accountId, { password: userPass });
    }
    console.log(`Passwords updated for ${accountId} / admin.`);
  } catch (err) {
    console.error("Write failure (passwords):", err);
  }
}

export async function updateAccountCredentials(accountId, { email, password }) {
  try {
    const updates = {};
    if (email !== undefined) updates.email = email.trim();
    if (password !== undefined) updates.password = password.trim();
    await updateAccount(accountId, updates);
    console.log(`Credentials updated for ${accountId}: email=${email}`);
  } catch (err) {
    console.error(`Write failure (credentials for ${accountId}):`, err);
    throw err;
  }
}

export async function updateAdminCredentials({ email, password }) {
  try {
    await initialization;
    const patches = {};
    if (email) patches.tb_admin_email = email.trim();
    if (password) patches.tb_admin_pass = password.trim();
    if (Object.keys(patches).length > 0) {
      await setDoc(dbRef, patches, { merge: true });
      console.log("Admin credentials updated in Firebase.");
    }
  } catch (err) {
    console.error("Write failure (admin credentials):", err);
    throw err;
  }
}

// MESSAGES & SUPPORT CHAT (Isolated per account)
export async function getMessages(accountId = getCurrentAccountId()) {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    if (!docSnap.exists()) return [];
    const data = docSnap.data();
    const accounts = data.accounts || {};
    const acc = accounts[accountId];
    if (acc && Array.isArray(acc.messages)) {
      return acc.messages;
    }
    // Backward compatibility for account1
    if (accountId === 'account1' && Array.isArray(data.tb_messages)) {
      return data.tb_messages;
    }
    return [];
  } catch (error) {
    console.error("Read failure (messages):", error);
    return [];
  }
}

export async function addMessage(msg, accountId = getCurrentAccountId()) {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    const data = docSnap.exists() ? docSnap.data() : defaultState;
    const accounts = data.accounts || defaultState.accounts;
    const targetAcc = accounts[accountId] || defaultState.accounts[accountId] || {};
    const currentMsgs = Array.isArray(targetAcc.messages)
      ? targetAcc.messages
      : (accountId === 'account1' && Array.isArray(data.tb_messages) ? data.tb_messages : []);

    const updatedMsgs = [...currentMsgs, { ...msg, accountId }];

    const updatedAccount = {
      ...targetAcc,
      messages: updatedMsgs
    };

    const patches = {
      accounts: {
        ...accounts,
        [accountId]: updatedAccount
      }
    };

    // Keep legacy tb_messages in sync if account1
    if (accountId === 'account1') {
      patches.tb_messages = updatedMsgs;
    }

    await setDoc(dbRef, patches, { merge: true });
    console.log(`Message added to ${accountId}. Total: ${updatedMsgs.length}`);
  } catch (error) {
    console.error("Write failure (message):", error);
  }
}

// CLEAR MESSAGES (Strictly isolated by accountId)
export async function clearMessages(accountId = getCurrentAccountId()) {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    const data = docSnap.exists() ? docSnap.data() : defaultState;
    const currentAccounts = data.accounts || defaultState.accounts;

    if (accountId === 'all') {
      const updatedAccounts = {
        ...currentAccounts,
        account1: { ...(currentAccounts.account1 || {}), messages: [] },
        account2: { ...(currentAccounts.account2 || {}), messages: [] }
      };
      await setDoc(dbRef, { accounts: updatedAccounts, tb_messages: [] }, { merge: true });
      console.log("All messages cleared across both accounts.");
      return;
    }

    const targetId = (accountId === 'account2') ? 'account2' : 'account1';
    const targetAcc = currentAccounts[targetId] || defaultState.accounts[targetId] || {};
    
    const updatedAccount = {
      ...targetAcc,
      messages: []
    };

    const newAccounts = {
      ...currentAccounts,
      [targetId]: updatedAccount
    };

    const patches = { accounts: newAccounts };
    if (targetId === 'account1') {
      patches.tb_messages = [];
    }

    await setDoc(dbRef, patches, { merge: true });
    console.log(`Messages cleared exclusively for ${targetId}.`);
  } catch (error) {
    console.error(`Failed to clear messages for ${accountId}:`, error);
  }
}

// REAL-TIME EVENT STREAM LISTENER
export function listenToDatabaseChanges(callback) {
  let unsubscribe;
  initialization.then(() => {
    unsubscribe = onSnapshot(dbRef, snapshot => callback(snapshot.exists() ? snapshot.data() : null));
  });
  return () => unsubscribe?.();
}

// AUTO LOGOUT LOGIC (2 HOURS)
let inactivityTimer;
const INACTIVITY_LIMIT = 2 * 60 * 60 * 1000; // 2 hours

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
      window.location.href = 'index.html';
    }
  }, INACTIVITY_LIMIT);
}

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', resetInactivityTimer);
  window.addEventListener('keydown', resetInactivityTimer);
  window.addEventListener('click', resetInactivityTimer);
  window.addEventListener('scroll', resetInactivityTimer);
  window.addEventListener('touchstart', resetInactivityTimer);
  resetInactivityTimer();
}
