export interface Profile {
  email: string;
  balance: number;
  total_views: number;
  device_id: string;
}

export interface Transaction {
  id: string;
  email: string;
  amount: number;
  type: 'reward' | 'withdrawal';
  status: 'completed' | 'pending' | 'failed';
  currency?: string;
  created_at: string;
  details?: any;
}

const STORAGE_KEYS = {
  PROFILES: 'watchearn_profiles',
  TRANSACTIONS: 'watchearn_transactions',
  SESSION: 'watchearn_session',
  USERS: 'watchearn_users'
};

export const storage = {
  getUsers: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUser: (user: any) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  
  getSession: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null'),
  setSession: (user: any) => localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user)),
  clearSession: () => localStorage.removeItem(STORAGE_KEYS.SESSION),

  getProfiles: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}'),
  getProfile: (email: string): Profile | null => storage.getProfiles()[email] || null,
  saveProfile: (profile: Profile) => {
    const profiles = storage.getProfiles();
    profiles[profile.email] = profile;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  },

  getTransactions: (email: string): Transaction[] => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    return all.filter((tx: Transaction) => tx.email === email);
  },
  addTransaction: (tx: Transaction) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    all.push(tx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
  },

  incrementBalance: (email: string, amount: number) => {
    const profile = storage.getProfile(email);
    if (profile) {
      profile.balance += amount;
      profile.total_views += 1;
      storage.saveProfile(profile);
      
      storage.addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        email,
        amount,
        type: 'reward',
        status: 'completed',
        created_at: new Date().toISOString()
      });
      return true;
    }
    return false;
  },

  deductBalance: (email: string, amount: number, details: any, currency: string) => {
    const profile = storage.getProfile(email);
    if (profile && profile.balance >= amount) {
      profile.balance -= amount;
      storage.saveProfile(profile);
      
      storage.addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        email,
        amount,
        type: 'withdrawal',
        status: 'pending',
        currency,
        details,
        created_at: new Date().toISOString()
      });
      return true;
    }
    return false;
  }
};