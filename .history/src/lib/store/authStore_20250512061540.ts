// src/lib/store/authStore.ts
import { create } from 'zustand'; // Import the create function from Zustand

// Define the interface for the authentication state
interface AuthState {
  isAuthenticated: boolean; // Is the user currently authenticated?
  userEmail: string | null; // Email of the authenticated user, or null if not logged in
  isLoading: boolean; // Is an authentication request (e.g., login) in progress?
  error: string | null; // Stores any authentication error messages
  loginRequest: () => void; // Action to set loading state for login
  loginSuccess: (email: string) => void; // Action to handle successful login
  loginFailure: (errorMessage: string) => void; // Action to handle failed login
  logout: () => void; // Action to handle user logout
}

// Create the Zustand store for authentication
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state values
  isAuthenticated: false, // User is not authenticated initially
  userEmail: null, // No user email initially
  isLoading: false, // Not loading initially
  error: null, // No error initially

  // Action to indicate a login attempt has started
  loginRequest: () => set({ isLoading: true, error: null }),

  // Action to handle successful login
  // Sets isAuthenticated to true, stores userEmail, and resets isLoading
  loginSuccess: (email) =>
    set({
      isAuthenticated: true,
      userEmail: email,
      isLoading: false,
      error: null,
    }),

  // Action to handle failed login
  // Sets isAuthenticated to false, stores the error message, and resets isLoading
  loginFailure: (errorMessage) =>
    set({
      isAuthenticated: false,
      userEmail: null,
      isLoading: false,
      error: errorMessage,
    }),

  // Action to handle user logout
  // Resets isAuthenticated and userEmail to their initial states
  logout: () =>
    set({
      isAuthenticated: false,
      userEmail: null,
      isLoading: false,
      error: null,
    }),
}));
