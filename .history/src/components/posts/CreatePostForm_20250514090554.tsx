// src/components/posts/CreatePostForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import Image from 'next/image';

// Form Values Type (can also be imported from a shared types file)
export interface CreatePostFormValues {
  contentText: string;
  imageFile?: File; // Added to hold image info
}

// Props for the component
interface CreatePostFormProps {
  onSubmit: SubmitHandler<CreatePostFormValues>; // Function to call on successful submission
  isSubmitting: boolean; // To disable button during submission
  onCancel?: () => void; // Optional: Handler for a cancel action
}

const CreatePostForm = ({
  onSubmit,
  isSubmitting,
  onCancel,
}: CreatePostFormProps) => {
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // To clear the form after submission
  } = useForm<CreatePostFormValues>();

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Wrapper for submission to also reset the form
  const processSubmit: SubmitHandler<CreatePostFormValues> = async (data) => {
    if (selectedImageFile) {
      console.log('Selected image for post:', selectedImageFile.name);
    }
    await onSubmit(data); // Call the passed onSubmit handler
    reset(); // Clear form fields after successful submission
    setSelectedImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
  };

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (imageInputRef.current) imageInputRef.current.value = '';

    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please select an image.');
        return;
      }
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);

      setSelectedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const currentPreview = imagePreviewUrl;
    return () => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
    };
  }, [imagePreviewUrl]);

  return (
    // Use RHF's handleSubmit to manage validation and submission
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      {/* Content Text Area */}
      <div>
        <label
          htmlFor="contentText"
          className="block text-sm font-medium text-gray-700 sr-only"
        >
          What&apos;s on your mind?
        </label>
        <textarea
          id="contentText"
          rows={5}
          placeholder="What's on your mind?"
          {...register('contentText', {
            required: 'Post content cannot be empty',
            maxLength: {
              value: 500,
              message: 'Post content must be 500 characters or less',
            },
          })}
          className={`mt-1 block w-full p-3 border ${
            errors.contentText ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          aria-invalid={errors.contentText ? 'true' : 'false'}
        />
        {errors.contentText && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contentText.message}
          </p>
        )}
      </div>

      {/* Image Upload and Preview */}
      <div className="space-y-2">
        {imagePreviewUrl && (
          <div className="mt-2 border border-gray-300 rounded-md p-2">
            <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
            <div className="relative h-60 w-full">
              <Image
                src={imagePreviewUrl}
                alt="Selected preview"
                fill
                className="rounded-md object-contain"
              />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          📷 {selectedImageFile ? 'Change Image' : 'Add Image'}
        </button>
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageFileChange}
          accept="image/png, image/jpeg, image/gif, image/webp"
          className="hidden"
          aria-label="Upload image for post"
        />
        {selectedImageFile && (
          <button
            type="button"
            onClick={() => {
              setSelectedImageFile(null);
              if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
              setImagePreviewUrl(null);
            }}
            className="ml-2 px-3 py-2 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50"
          >
            Remove Image
          </button>
        )}
      </div>

      {/* Form Actions: Submit and Optional Cancel */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

CreatePostForm.displayName = 'CreatePostForm';

export default CreatePostForm;
