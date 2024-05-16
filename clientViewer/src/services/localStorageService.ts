const localStorageService = {
  getItem: (key: string): string | null => {
    try {
      const serializedItem = localStorage.getItem(key);
      if (serializedItem === null) {
        return null;
      }
      return JSON.parse(serializedItem);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  },
};

export default localStorageService;
