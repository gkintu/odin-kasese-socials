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
  isGuest: boolean; // Is the user currently browsing as a guest?
  loginAsGuest: () => void; // Action to start a guest session
}

// Create the Zustand store for authentication
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state values
  isAuthenticated: false, // User is not authenticated initially
  userEmail: null, // No user email initially
  isLoading: false, // Not loading initially
  error: null, // No error initially
  isGuest: false, // Initialize isGuest to false

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
      isGuest: false, // Ensure isGuest is false on logout
      isLoading: false,
      error: null,
    }),

  // Action to handle starting a guest session
  loginAsGuest: () =>
    set({
      isAuthenticated: false, // Guest is not a fully authenticated user
      userEmail: null, // No email for guest users
      isGuest: true, // Set isGuest to true
      isLoading: false, // Not loading during guest session
      error: null, // No error during guest session
    }),
}));
