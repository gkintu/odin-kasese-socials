// src/components/profile/EditProfileForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

export interface EditProfileFormValues {
  displayName: string;
  bio: string;
  // We are not yet including the image file in the form submission data for this phase
}

interface EditProfileFormProps {
  onSubmit: SubmitHandler<EditProfileFormValues>;
  initialData: {
    displayName: string;
    bio: string;
    currentAvatarUrl?: string; // URL of the user's current avatar
  };
  // onCancel?: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    defaultValues: {
      displayName: initialData.displayName,
      bio: initialData.bio,
    },
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  // Initialize with current avatar or a default if none provided
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(initialData.currentAvatarUrl || '/img/default-avatar.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (fileInputRef.current) {
      // Always reset the file input to allow re-selection of the same file
      fileInputRef.current.value = '';
    }

    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please use PNG, JPG, GIF, or WEBP.');
        return;
      }
      const maxSizeInBytes = 2 * 1024 * 1024; 
      if (file.size > maxSizeInBytes) {
        toast.error('File too large. Max 2MB.');
        return;
      }

      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setSelectedImageFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(newPreviewUrl);
    }
  };

  useEffect(() => {
    const currentPreview = imagePreviewUrl;
    return () => {
      if (currentPreview && currentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [imagePreviewUrl]);

  // The main onSubmit prop is for displayName and bio only for now.
  // selectedImageFile is available in state if needed for actual upload later.
  const formSubmitHandler: SubmitHandler<EditProfileFormValues> = (data) => {
    console.log("Form data to submit (text fields):", data);
    if (selectedImageFile) {
        console.log("Selected image file for upload (dummy):", selectedImageFile.name, selectedImageFile.type);
        // In a real app, you'd append selectedImageFile to FormData here.
    }
    onSubmit(data); // Call the original onSubmit passed from the page
  };

  return (
    <form onSubmit={handleSubmit(formSubmitHandler)} className="space-y-6">
      {/* Display Name Field (as before) */}
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
        <input id="displayName" type="text" {...register('displayName', { required: 'Display name is required' })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        {errors.displayName && <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>}
      </div>

      {/* Bio Field (as before) */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea id="bio" rows={4} {...register('bio', { maxLength: { value: 200, message: 'Bio must be 200 characters or less' } })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
      </div>
      
      {/* Profile Picture Section (Updated) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
        <div className="mt-1 flex items-center space-x-4">
          <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow">
            {imagePreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreviewUrl} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </span>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Change Picture</button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif, image/webp" className="hidden" aria-label="Upload profile picture" />
        </div>
        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 2MB (dummy limit).</p>
      </div>

      {/* Form Actions (as before) */}
      <div className="flex justify-end space-x-3 pt-4">
        <button type="submit" disabled={isSubmitting} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
