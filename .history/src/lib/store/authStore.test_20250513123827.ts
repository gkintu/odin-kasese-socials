// src/lib/store/authStore.test.ts
import { useAuthStore } from './authStore'; // Import the store

// Reset store to initial state before each test
const originalState = useAuthStore.getState();
beforeEach(() => {
  // Ensure all relevant fields, including new ones, are reset
  useAuthStore.setState({
    ...originalState,
    isAuthenticated: false,
    userEmail: null,
    displayName: null, // Reset displayName
    isGuest: false, // Explicitly reset isGuest
    isLoading: false,
    error: null,
  });
});

describe('useAuthStore', () => {
  it('should set isAuthenticated to true and userEmail on loginSuccess, and isGuest to false', () => {
    const { loginSuccess } = useAuthStore.getState();
    loginSuccess('test@example.com');
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.userEmail).toBe('test@example.com');
    expect(state.isGuest).toBe(false); // Verify isGuest is false
    expect(state.isLoading).toBe(false);
  });

  it('should set isGuest to true on loginAsGuest, and isAuthenticated to false', () => {
    // First, ensure it's not a guest
    expect(useAuthStore.getState().isGuest).toBe(false);

    const { loginAsGuest } = useAuthStore.getState();
    loginAsGuest(); // Call the new action

    const state = useAuthStore.getState();
    expect(state.isGuest).toBe(true); // Verify isGuest is true
    expect(state.isAuthenticated).toBe(false); // Guest is not fully authenticated
    expect(state.userEmail).toBe(null);
    expect(state.isLoading).toBe(false);
  });

  it('should reset isAuthenticated, userEmail, and isGuest on logout', () => {
    // Simulate a registered user login
    useAuthStore.getState().loginSuccess('test@example.com');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Logout
    useAuthStore.getState().logout();
    let state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.userEmail).toBe(null);
    expect(state.isGuest).toBe(false);

    // Simulate a guest login
    useAuthStore.getState().loginAsGuest();
    expect(useAuthStore.getState().isGuest).toBe(true);

    // Logout
    useAuthStore.getState().logout();
    state = useAuthStore.getState(); // Re-fetch state after second logout
    expect(state.isAuthenticated).toBe(false);
    expect(state.userEmail).toBe(null);
    expect(state.isGuest).toBe(false); // Verify isGuest is also reset
  });

  // Test for loginRequest ensuring isGuest is reset
  it('should set isLoading to true and isGuest to false on loginRequest', () => {
    // Simulate being a guest first
    useAuthStore.getState().loginAsGuest();
    expect(useAuthStore.getState().isGuest).toBe(true);

    const { loginRequest } = useAuthStore.getState();
    loginRequest();
    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(true);
    expect(state.isGuest).toBe(false); // Ensure guest status is cleared
    expect(state.error).toBe(null);
  });

  // Test for loginFailure ensuring isGuest is reset
  it('should set isLoading to false, store error, and set isGuest to false on loginFailure', () => {
    // Simulate being a guest first
    useAuthStore.getState().loginAsGuest();
    expect(useAuthStore.getState().isGuest).toBe(true);

    const { loginFailure } = useAuthStore.getState();
    loginFailure('Invalid credentials');
    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isGuest).toBe(false); // Ensure guest status is cleared
    expect(state.error).toBe('Invalid credentials');
  });

  it('should set displayName on loginSuccess if provided', () => {
    const { loginSuccess } = useAuthStore.getState();
    loginSuccess('test@example.com', 'Test User');
    const state = useAuthStore.getState();
    expect(state.displayName).toBe('Test User');
  });

  it('should derive displayName from email if not provided on loginSuccess', () => {
    const { loginSuccess } = useAuthStore.getState();
    loginSuccess('test@example.com');
    const state = useAuthStore.getState();
    expect(state.displayName).toBe('test'); // Derived from email
  });

  it('should reset displayName on logout', () => {
    const { loginSuccess, logout } = useAuthStore.getState();
    loginSuccess('test@example.com', 'Test User');
    expect(useAuthStore.getState().displayName).toBe('Test User');

    logout();
    const state = useAuthStore.getState();
    expect(state.displayName).toBe(null); // Reset on logout
  });

  it('should update displayName using updateDisplayName action', () => {
    const { updateDisplayName } = useAuthStore.getState();
    updateDisplayName('New Display Name');
    const state = useAuthStore.getState();
    expect(state.displayName).toBe('New Display Name');
  });
});
