interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  userType: "customer" | "provider" | "admin";
  isVerified: boolean;
  isApproved: boolean;
}

export const AUTH_STORAGE_KEY = 'serviceconnect_user';

export const authUtils = {
  // Save user to localStorage
  saveUser: (user: User): void => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
  },

  // Get user from localStorage
  getUser: (): User | null => {
    try {
      const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to get user from localStorage:', error);
      return null;
    }
  },

  // Remove user from localStorage
  removeUser: (): void => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove user from localStorage:', error);
    }
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return authUtils.getUser() !== null;
  },

  // Get dashboard URL based on user type
  getDashboardUrl: (userType: string): string => {
    switch (userType) {
      case "customer":
        return "/customer/dashboard";
      case "provider":
        return "/provider/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  }
};

export type { User };