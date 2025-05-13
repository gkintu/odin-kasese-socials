// src/lib/store/authStore.ts
import { create } from 'zustand'; // Import the create function from Zustand
import { getSetCookie } from 'cookies-next'; // Assuming this is where you might use it, or remove if not used elsewhere

// Define the interface for the authentication state
interface AuthState {
  isAuthenticated: boolean; // Is the user currently authenticated?
  userEmail: string | null; // Email of the authenticated user, or null if not logged in
  displayName: string | null; // Added displayName
  isLoading: boolean; // Is an authentication request (e.g., login) in progress?
  error: string | null; // Stores any authentication error messages
  loginRequest: () => void; // Action to set loading state for login
  loginSuccess: (user: User, token: string) => void; // Modified loginSuccess
  loginFailure: (errorMessage: string) => void; // Action to handle failed login
  logout: () => void; // Action to handle user logout
  isGuest: boolean; // Is the user currently browsing as a guest?
  loginAsGuest: () => void; // Action to start a guest session
  updateDisplayName: (newName: string) => void; // Added action to update display name
}

// Create the Zustand store for authentication
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state values
  isAuthenticated: false, // User is not authenticated initially
  userEmail: null, // No user email initially
  displayName: null, // Initialize displayName
  isLoading: false, // Not loading initially
  error: null, // No error initially
  isGuest: false, // Initialize isGuest to false

  // Action to indicate a login attempt has started
  loginRequest: () =>
    set({ isLoading: true, error: null, isGuest: false, displayName: null }), // Reset displayName on new login attempt

  // Action to handle successful login
  // Sets isAuthenticated to true, stores userEmail, and resets isLoading
  loginSuccess: (user, token) => {
    set((state) => ({
      ...state,
      isAuthenticated: true,
      isGuest: false,
      userEmail: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      isLoading: false,
      error: null,
    }));
    // setCookie('authToken', token, { req, res, maxAge: 60 * 60 * 24 }); // Example: if using cookies-next
    // localStorage.setItem('authToken', token); // Or localStorage
    // console.log('Login successful, token set (conceptual)');
  },

  // Action to handle failed login
  // Sets isAuthenticated to false, stores the error message, and resets isLoading
  loginFailure: (errorMessage) =>
    set({
      isAuthenticated: false,
      userEmail: null,
      displayName: null, // Reset displayName on failure
      isLoading: false,
      error: errorMessage,
      isGuest: false,
    }),

  // Action to handle user logout
  // Resets isAuthenticated and userEmail to their initial states
  logout: () =>
    set({
      isAuthenticated: false,
      userEmail: null,
      displayName: null, // Reset displayName on logout
      isGuest: false, // Ensure isGuest is false on logout
      isLoading: false,
      error: null,
    }),

  // Action to handle starting a guest session
  loginAsGuest: () =>
    set({
      isAuthenticated: false, // Guest is not a fully authenticated user
      userEmail: null, // No email for guest users
      displayName: null, // Guests don't have a persistent display name this way
      isGuest: true, // Set isGuest to true
      isLoading: false, // Not loading during guest session
      error: null, // No error during guest session
    }),

  // Action to update the display name
  updateDisplayName: (newName) =>
    set({
      displayName: newName,
    }),
}));
