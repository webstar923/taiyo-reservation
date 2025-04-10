const PREFIX = 'photo';

// Helper function to generate a prefixed key
const getPrefixedKey = (key: string) => `${PREFIX}:${key}`;

// Save data to localStorage
export const saveToStorage = (key: string, value: unknown): void => {
  const prefixedKey = getPrefixedKey(key);
  localStorage.setItem(prefixedKey, JSON.stringify(value));
};

// Get data from localStorage
export const getFromStorage = <T>(key: string): T | null => {
  const prefixedKey = getPrefixedKey(key);
  const storedValue = localStorage.getItem(prefixedKey);
  return storedValue ? JSON.parse(storedValue) : null;
};

// Remove data from localStorage
export const removeFromStorage = (key: string): void => {
  const prefixedKey = getPrefixedKey(key);
  localStorage.removeItem(prefixedKey);
};

// Clear all app-related data from localStorage
export const clearAppStorage = (): void => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`${PREFIX}:`)) {
      localStorage.removeItem(key);
    }
  });
};

