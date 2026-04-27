import { users } from '../mockData/mockDb';

export const authService = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email);
        if (user) {
          resolve({ token: "mock-jwt-token-12345", user });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  },
  getCurrentUser: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(null), 500);
    });
  }
};
