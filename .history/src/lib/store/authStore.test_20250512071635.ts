// src/lib/store/authStore.test.ts
import { useAuthStore } from './authStore'; // Import the store

// Reset store to initial state before each test
const originalState = useAuthStore.getState();
beforeEach(() => {
  useAuthStore.setState(originalState);
});

describe('useAuthStore', () => {
  // Test for loginSuccess action
  it('should set isAuthenticated to true and store userEmail on loginSuccess', () => {
    // Get the loginSuccess action from the store
    const { loginSuccess } = useAuthStore.getState();
    // Call the action
    loginSuccess('test@example.com');

    // Assert that the state has been updated correctly
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().userEmail).toBe('test@example.com');
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  // Test for logout action
  it('should set isAuthenticated to false and clear userEmail on logout', () => {
    // First, simulate a login
    useAuthStore.getState().loginSuccess('tst@example.com');
    expect(useAuthStore.getState().isAuthenticated).toBe(true); // Pre-condition

    // Get and call the logout action
    const { logout } = useAuthStore.getState();
    logout();

    // Assert that the state has been reset for logout
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().userEmail).toBe(null);
  });

  // Test for loginRequest action
  it('should set isLoading to true on loginRequest', () => {
    const { loginRequest } = useAuthStore.getState();
    loginRequest();
    expect(useAuthStore.getState().isLoading).toBe(true);
    expect(useAuthStore.getState().error).toBe(null);
  });

  // Test for loginFailure action
  it('should set isLoading to false and store error message on loginFailure', () => {
    const { loginFailure } = useAuthStore.getState();
    loginFailure('Invalid credentials');
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().error).toBe('Invalid credentials');
  });
});
