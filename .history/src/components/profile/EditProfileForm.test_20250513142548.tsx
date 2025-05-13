// src/components/profile/EditProfileForm.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfileForm, { EditProfileFormValues } from './EditProfileForm';
import toast from 'react-hot-toast'; // Import toast

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  promise: jest.fn(),
  // Add any other toast functions you might use
}));

const mockSubmit = jest.fn();

const initialData: EditProfileFormValues = {
  displayName: 'Test User',
  bio: 'This is a test bio.',
};

describe('EditProfileForm', () => {
  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders with initial data', () => {
    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);
    expect(screen.getByLabelText(/display name/i)).toHaveValue(
      initialData.displayName
    );
    expect(screen.getByLabelText(/bio/i)).toHaveValue(initialData.bio);
    // Check for profile picture if applicable, depends on implementation
    // For example, if it's an img tag with alt text:
    // expect(screen.getByAltText(/profile picture/i)).toHaveAttribute('src', initialData.profilePictureUrl);
    expect(
      screen.getByRole('button', { name: /change picture/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);

    const displayNameInput = screen.getByLabelText(/display name/i);
    const bioInput = screen.getByLabelText(/bio/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });

    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'New Name');
    await user.clear(bioInput);
    await user.type(bioInput, 'New bio content.');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          displayName: 'New Name',
          bio: 'New bio content.',
          // profilePictureUrl might be handled differently, e.g. via a separate upload mechanism
          // For this test, we assume it remains unchanged or is not part of this specific form submission data structure
          // If it is, ensure it's included here.
        },
        expect.anything() // For the formik helpers or event
      );
    });
  });

  it('shows validation error for empty display name', async () => {
    const user = userEvent.setup();
    render(
      <EditProfileForm
        onSubmit={mockSubmit}
        initialData={{ ...initialData, displayName: '' }}
      />
    );
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);
    expect(
      await screen.findByText(/display name is required/i)
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for bio exceeding max length', async () => {
    const user = userEvent.setup();
    const longBio = 'a'.repeat(201);
    render(
      <EditProfileForm
        onSubmit={mockSubmit}
        initialData={{ ...initialData, bio: longBio }}
      />
    );
    // const bioInput = screen.getByLabelText(/bio/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });

    // await user.clear(bioInput);
    // await user.type(bioInput, longBio);
    await user.click(saveButton);

    expect(
      await screen.findByText(/bio must be 200 characters or less/i)
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  // Test for profile picture change functionality (if implemented within this form)
  it('handles profile picture change button click (mock)', async () => {
    // This test is highly dependent on how picture changes are implemented.
    // If it opens a modal, triggers a file input, etc.
    // For now, let's just check if the button exists and can be clicked.
    const user = userEvent.setup();

    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);
    const changePictureButton = screen.getByRole('button', {
      name: /change picture/i,
    });
    await user.click(changePictureButton);

    // Example: if clicking the button is supposed to call a prop or a specific function:
    // expect(mockChangePictureProp).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith( // Check if toast.success was called
      'Profile picture upload UI coming soon!',
      { icon: '🖼️' }
    );
    // Clean up mock
    (toast.success as jest.Mock).mockClear(); // Clear the toast mock
  });
});
