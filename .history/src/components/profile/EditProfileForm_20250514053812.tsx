// src/components/profile/EditProfileForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Removed unused Controller
import toast from 'react-hot-toast'; // For dummy avatar upload feedback

// Define Form Values Type (can be moved to a shared types file if preferred)
export interface EditProfileFormValues {
  displayName: string;
  bio: string;
  profilePictureUrl?: string; // Added profilePictureUrl
  // avatarFile?: FileList; // For future actual file upload
}

// Define Props for the component
interface EditProfileFormProps {
  onSubmit: SubmitHandler<EditProfileFormValues>; // Function to call on successful submission
  initialData: {
    // Initial data to pre-fill the form
    displayName: string;
    bio: string;
  };
  // onCancel?: () => void; // Optional cancel handler
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onSubmit,
  initialData,
}) => {
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    // control, // Removed unused control
    formState: { errors, isSubmitting }, // Get errors and submission state
  } = useForm<EditProfileFormValues>({
    defaultValues: initialData, // Pre-fill form with initialData
  });

  // Dummy handler for profile picture change
  const handleAvatarChangeClick = () => {
    toast.success('Profile picture upload UI coming soon!', { icon: '🖼️' });
  };

  return (
    // Handle form submission using RHF's handleSubmit
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Display Name Field */}
      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-gray-700"
        >
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          {...register('displayName', { required: 'Display name is required' })}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.displayName ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          aria-invalid={errors.displayName ? 'true' : 'false'}
        />
        {errors.displayName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.displayName.message}
          </p>
        )}
      </div>

      {/* Bio Field */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          {...register('bio', {
            maxLength: {
              value: 200,
              message: 'Bio must be 200 characters or less',
            },
          })}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.bio ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          aria-invalid={errors.bio ? 'true' : 'false'}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      {/* Profile Picture Placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture
        </label>
        <div className="mt-1 flex items-center space-x-4">
          {/* Dummy current avatar */}
          <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          <button
            type="button"
            onClick={handleAvatarChangeClick}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Change Picture
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">(Feature coming soon)</p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        {/* Optional Cancel Button
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
        */}
        <button
          type="submit"
          disabled={isSubmitting} // Disable button while submitting
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
