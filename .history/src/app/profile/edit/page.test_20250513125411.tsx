import { render, screen, fireEvent } from '@testing-library/react';
import EditProfilePage from './page';
import { useAuthStore } from '@/lib/store/authStore';

jest.mock('@/lib/store/authStore');

describe('EditProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUpdateProfile = jest.fn();

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      displayName: 'TestUser',
      updateProfile: mockUpdateProfile,
    });
  });

  it('should render the edit profile form with pre-filled user data', () => {
    render(<EditProfilePage />);

    expect(screen.getByLabelText(/display name/i)).toHaveValue('TestUser');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
  });

  it('should call updateProfile with updated data when form is submitted', () => {
    render(<EditProfilePage />);

    fireEvent.change(screen.getByLabelText(/display name/i), {
      target: { value: 'UpdatedUser' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(mockUpdateProfile).toHaveBeenCalledWith({
      displayName: 'UpdatedUser',
      email: 'test@example.com',
    });
  });

  it('should show an error message if updateProfile fails', async () => {
    mockUpdateProfile.mockRejectedValueOnce(new Error('Update failed'));

    render(<EditProfilePage />);

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    const errorMessage = await screen.findByText(/update failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should redirect to login if user is not authenticated', () => {
    mockUseAuthStore.mockReturnValueOnce({ isAuthenticated: false });

    render(<EditProfilePage />);

    expect(screen.getByText(/please log in to edit your profile/i)).toBeInTheDocument();
  });
});
