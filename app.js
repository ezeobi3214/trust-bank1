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

const defaultState = {
  tb_balance: '24850.40',
  tb_transferLimit: '5000.00',
  tb_transactions: defaultTransactions,
  tb_profile: defaultProfile,
  tb_messages: [],
  tb_user_email: 'user@com',
  tb_user_pass: '11111',
  tb_admin_email: 'admin@com',
  tb_admin_pass: '00000'
};

export function formatCurrency(value) {
  const amount = Number.parseFloat(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    : '$0.00';
}

const initialization = initializeState();

// Checks if database is blank. If true, pushes starting state up to Firestore.
export async function initializeState() {
  try {
    const docSnap = await getDoc(dbRef);
    if (!docSnap.exists()) {
      await setDoc(dbRef, defaultState);
      console.log("Firebase Database successfully pre-populated with baseline datasets!");
    }
  } catch (error) {
    console.error("Initialization failure:", error);
  }
}

export const initState = initializeState;

// PROFILE LOGIC
export async function getProfile() {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    return docSnap.exists() ? { ...defaultProfile, ...docSnap.data().tb_profile } : defaultProfile;
  } catch (error) {
    console.error("Read failure (profile):", error);
    return defaultProfile;
  }
}

export async function setProfile(profileObj) {
  try {
    await initialization;
    await setDoc(dbRef, { tb_profile: profileObj }, { merge: true });
    console.log("Profile synchronized cross-device.");
  } catch (error) {
    console.error("Write failure (profile):", error);
  }
}

// BALANCE & CONFIG LOGIC
export async function getFinancials() {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { balance: data.tb_balance, limit: data.tb_transferLimit };
    }
    return { balance: '24850.40', limit: '5000.00' };
  } catch (error) {
    console.error("Read failure (financials):", error);
    return { balance: '24850.40', limit: '5000.00' };
  }
}

export async function updateFinancials(balance, limit) {
  try {
    await initialization;
    await setDoc(dbRef, { tb_balance: balance, tb_transferLimit: limit }, { merge: true });
    console.log("Financial modifications successfully synced.");
  } catch (error) {
    console.error("Write failure (financials):", error);
  }
}

// TRANSACTIONS LOGIC
export async function getTransactions() {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    return docSnap.exists() ? (docSnap.data().tb_transactions || []) : defaultTransactions;
  } catch (error) {
    console.error("Read failure (transactions):", error);
    return defaultTransactions;
  }
}

export async function addTransaction(newTx) {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    const currentTx = docSnap.exists() ? (docSnap.data().tb_transactions || []) : [];
    const transaction = {
      ...newTx,
      id: newTx.id || `tx-${Date.now()}`,
      date: newTx.date || new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      createdAt: newTx.createdAt || Date.now()
    };
    await setDoc(dbRef, { tb_transactions: [transaction, ...currentTx] }, { merge: true });
    return transaction.id;
  } catch (error) {
    console.error("Write failure (transaction):", error);
    return null;
  }
}

export async function updateTransactionStatus(id, status, note = '') {
  const transactions = await getTransactions();
  const updatedTransactions = transactions.map(transaction =>
    transaction.id === id ? { ...transaction, status, ...(note ? { note } : {}) } : transaction
  );
  await setDoc(dbRef, { tb_transactions: updatedTransactions }, { merge: true });
}

export async function getTransaction(id) {
  const transactions = await getTransactions();
  return transactions.find(transaction => transaction.id === id) || null;
}

// MESSAGES LOGIC
export async function getMessages() {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    return docSnap.exists() ? docSnap.data().tb_messages : [];
  } catch (error) {
    console.error("Read failure (messages):", error);
    return [];
  }
}

export async function addMessage(msg) {
  try {
    await initialization;
    const docSnap = await getDoc(dbRef);
    const currentMsgs = docSnap.exists() ? (docSnap.data().tb_messages || []) : [];
    await setDoc(dbRef, { tb_messages: [...currentMsgs, msg] }, { merge: true });
  } catch (error) {
    console.error("Write failure (message):", error);
  }
}

// ==========================================
// 4. REAL-TIME EVENT STREAM LISTENER
// ==========================================
export function listenToDatabaseChanges(callback) {
  let unsubscribe;
  initialization.then(() => {
    unsubscribe = onSnapshot(dbRef, snapshot => callback(snapshot.exists() ? snapshot.data() : null));
  });
  return () => unsubscribe?.();
}
