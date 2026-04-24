// src/services/auth.ts

export interface User {
  id: string;
  name: string;
  email: string;
  token: string; // Simulated JWT
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Fake authentication logic
        if (email && password.length >= 6) {
          resolve({
            id: "usr_101",
            name: "Premium Member",
            email: email,
            token: "mock_jwt_token_89432"
          });
        } else {
          reject(new Error("Invalid credentials or password too short."));
        }
      }, 1000); // 1s delay for realistic feel
    });
  },
  
  logout: async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
};