// src/components/profile/EditProfileForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfileForm, { EditProfileFormValues } from './EditProfileForm';

describe('EditProfileForm', () => {
  const mockSubmit = jest.fn();
  const initialData: EditProfileFormValues = {
    displayName: 'Initial Name',
    bio: 'Initial bio text.',
  };

  beforeEach(() => {
    mockSubmit.mockClear(); // Clear mock calls before each test
  });

  // Test 1: Renders form fields with initial data and placeholders
  it('should render form fields with initial data and placeholders for avatar', () => {
    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);

    // Check display name input
    expect(screen.getByLabelText(/display name/i)).toHaveValue(initialData.displayName);
    // Check bio textarea
    expect(screen.getByLabelText(/bio/i)).toHaveValue(initialData.bio);
    // Check placeholder for profile picture upload
    expect(screen.getByText(/profile picture/i)).toBeInTheDocument(); // Assuming a label/heading
    expect(screen.getByRole('button', { name: /change picture/i})).toBeInTheDocument(); // Dummy button
    // Check for Save Changes and Cancel buttons
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument(); // Optional Cancel
  });

  // Test 2: Allows typing in fields
  it('should allow typing in displayName and bio fields', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);
    
    const displayNameInput = screen.getByLabelText(/display name/i);
    const bioInput = screen.getByLabelText(/bio/i);

    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'New Name');
    expect(displayNameInput).toHaveValue('New Name');

    await user.clear(bioInput);
    await user.type(bioInput, 'New bio content.');
    expect(bioInput).toHaveValue('New bio content.');
  });

  // Test 3: Validation - Display Name required
  it('should show error if display name is empty on submit', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm onSubmit={mockSubmit} initialData={{ ...initialData, displayName: '' }} />);
    
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);

    // Expect an error message for display name
    expect(await screen.findByText(/display name is required/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  // Test 4: Validation - Bio max length (e.g., 200 chars)
  it('should show error if bio exceeds max length on submit', async () => {
    const user = userEvent.setup();
    const longBio = 'a'.repeat(201);
    render(<EditProfileForm onSubmit={mockSubmit} initialData={{ ...initialData, bio: longBio }} />);

    const bioInput = screen.getByLabelText(/bio/i);
    // For RHF, error might appear on change after first submit attempt or on submit
    // To be safe, we'll trigger submit
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);
    
    // Expect an error message for bio length
    expect(await screen.findByText(/bio must be 200 characters or less/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });
  
  // Test 5: Calls onSubmit with form data when valid
  it('should call onSubmit with updated data on valid submission', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm onSubmit={mockSubmit} initialData={initialData} />);

    const displayNameInput = screen.getByLabelText(/display name/i);
    const bioInput = screen.getByLabelText(/bio/i);
    const saveButton = screen.getByRole('button', { name: /save changes/i });

    // Modify data
    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'Updated Name');
    await user.clear(bioInput);
    await user.type(bioInput, 'Updated bio.');
    
    await user.click(saveButton);

    // Wait for submit to be called
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith({
        displayName: 'Updated Name',
        bio: 'Updated bio.',
      }, expect.anything()); // RHF passes event as second arg
    });
  });
});