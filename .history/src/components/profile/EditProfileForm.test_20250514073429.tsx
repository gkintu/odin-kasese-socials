// src/components/profile/EditProfileForm.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
const mockCreateObjectURL = jest.fn(() => 'blob:mocked-url-123');
const mockRevokeObjectURL = jest.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

const initialData: EditProfileFormValues = {
  displayName: 'Test User',
  bio: 'This is a test bio.',
};

describe('EditProfileForm', () => {
  beforeEach(() => {
    mockSubmit.mockClear();
    mockCreateObjectURL.mockClear();
    mockRevokeObjectURL.mockClear();
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
      expect(mockSubmit).toHaveBeenCalledWith({
        displayName: 'New Name',
        bio: 'New bio content.',
        // profilePictureUrl might be handled differently, e.g. via a separate upload mechanism
        // For this test, we assume it remains unchanged or is not part of this specific form submission data structure
        // If it is, ensure it's included here.
      });
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
  it('handles profile picture change button click by triggering file input', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);
    const changePictureButton = screen.getByRole('button', {
      name: /change picture/i,
    });
    const fileInput = screen.getByLabelText(/upload profile picture/i) as HTMLInputElement;
    const fileInputClickSpy = jest.spyOn(fileInput, 'click').mockImplementation(() => {}); // Mock to prevent actual dialog

    await user.click(changePictureButton);

    expect(fileInputClickSpy).toHaveBeenCalledTimes(1);

    fileInputClickSpy.mockRestore(); // Clean up spy
  });

  it('should allow selecting an image file and show a preview', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);

    const fileInput = screen.getByLabelText(/upload profile picture/i) as HTMLInputElement;
    const changePicButton = screen.getByRole('button', { name: /change picture/i });

    const dummyFile = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', {
      value: [dummyFile],
    });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalledWith(dummyFile);
    });

    const previewImage = screen.getByAltText('Profile preview') as HTMLImageElement;
    expect(previewImage.src).toBe('blob:mocked-url-123');

    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should show an error toast for invalid file type', async () => {
    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);
    const fileInput = screen.getByLabelText(/upload profile picture/i) as HTMLInputElement;
    const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    Object.defineProperty(fileInput, 'files', { value: [invalidFile] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid file type. Please use PNG, JPG, GIF, or WEBP.');
    });
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
  });

  it('should show an error toast for oversized file', async () => {
    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);
    const fileInput = screen.getByLabelText(/upload profile picture/i) as HTMLInputElement;
    const oversizedFile = new File([new ArrayBuffer(3 * 1024 * 1024)], 'largefile.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', { value: [oversizedFile] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('File too large. Max 2MB.');
    });
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
  });

  it('should revoke object URL on unmount if a blob URL was created', () => {
    const { unmount } = render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);
    const fileInput = screen.getByLabelText(/upload profile picture/i) as HTMLInputElement;
    const dummyFile = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    Object.defineProperty(fileInput, 'files', { value: [dummyFile] });
    fireEvent.change(fileInput);

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);

    unmount();

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mocked-url-123');
  });
});
