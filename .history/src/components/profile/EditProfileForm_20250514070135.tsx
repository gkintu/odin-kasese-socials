// src/components/profile/EditProfileForm.tsx
import React, { useState, useEffect, useRef } from 'react'; // Added useState, useEffect, useRef
import { useForm, SubmitHandler } from 'react-hook-form'; // Removed unused Controller
import toast from 'react-hot-toast'; // For dummy avatar upload feedback

// Define Form Values Type (can be moved to a shared types file if preferred)
export interface EditProfileFormValues {
  displayName: string;
  bio: string;
  // avatarFile?: FileList; // For future actual file upload
}

// Define Props for the component
interface EditProfileFormProps {
  onSubmit: SubmitHandler<EditProfileFormValues>; // Function to call on successful submission
  initialData: {
    // Initial data to pre-fill the form
    displayName: string;
    bio: string;
    currentAvatarUrl?: string; // Add current avatar URL to initialData
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

  // State for the selected image file
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  // State for the URL of the image preview
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(initialData.currentAvatarUrl || '/img/default-avatar.png'); // Default fallback

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dummy handler for profile picture change
  const handleAvatarChangeClick = () => {
    toast.success('Profile picture upload UI coming soon!', { icon: '🖼️' });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the first file from the FileList
    const file = event.target.files?.[0];

    if (file) {
      // Basic Client-Side Validation (Example)
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please select an image (PNG, JPG, GIF, WEBP).');
        // Clear the file input value to allow re-selection of the same file if needed after error
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        toast.error('File is too large. Maximum size is 2MB.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // If a previous preview URL exists, revoke it to free up memory
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }

      // Store the selected file
      setSelectedImageFile(file);
      // Create and set a new preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(newPreviewUrl);
    } else {
      // No file selected, or selection was cancelled
      // Optionally, reset to default if desired, or do nothing
      // For now, we do nothing if no file is picked, existing preview remains
    }
  };

  useEffect(() => {
    // This is a cleanup function that will run when the component unmounts
    // or before the effect runs again if imagePreviewUrl changes.
    // We only want to revoke if it's a blob URL.
    const currentPreview = imagePreviewUrl; // Capture current value for cleanup
    return () => {
      if (currentPreview && currentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
        console.log('Revoked object URL:', currentPreview); // For debugging
      }
    };
  }, [imagePreviewUrl]); // Re-run effect if imagePreviewUrl changes, to manage cleanup of the *previous* URL

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

      {/* Profile Picture Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profile Picture
        </label>
        <div className="mt-1 flex items-center space-x-4">
          {/* Image Preview or Current Avatar */}
          <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow">
            {imagePreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreviewUrl}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              // Default placeholder icon if no preview
              <svg
                className="h-12 w-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </span>
          {/* Button to trigger file input */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Change Picture
          </button>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif, image/webp"
            className="hidden"
            aria-label="Upload profile picture"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, GIF, WEBP up to 2MB (dummy limit for now).
        </p>
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
