// src/components/posts/CreatePostForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast'; // For dummy image add feedback

// Form Values Type (can also be imported from a shared types file)
export interface CreatePostFormValues {
  contentText: string;
  // imageUrl?: string; // Future: For image URL input
  // imageFile?: FileList; // Future: For direct file upload
}

// Props for the component
interface CreatePostFormProps {
  onSubmit: SubmitHandler<CreatePostFormValues>; // Function to call on successful submission
  isSubmitting: boolean; // To disable button during submission
  onCancel?: () => void; // Optional: Handler for a cancel action
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // To clear the form after submission
  } = useForm<CreatePostFormValues>();

  // Wrapper for submission to also reset the form
  const processSubmit: SubmitHandler<CreatePostFormValues> = async (data) => {
    await onSubmit(data); // Call the passed onSubmit handler
    // Only reset form if onSubmit doesn't throw an error (implicitly handled by async/await)
    // or based on success feedback from onSubmit if it returns a status.
    // For now, we assume onSubmit handles its own success/failure states before this point.
    reset(); // Clear form fields after successful submission
  };

  // Dummy handler for adding an image
  const handleAddImageClick = () => {
    toast.success('Image upload functionality coming soon!', { icon: '🖼️' });
  };

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
          placeholder="What&apos;s on your mind?"
          {...register('contentText', {
            required: 'Post content cannot be empty',
            maxLength: {
              value: 500,
              message: 'Post content must be 500 characters or less',
            },
          })}
          className={`mt-1 block w-full p-3 border ${errors.contentText ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          aria-invalid={errors.contentText ? 'true' : 'false'}
        />
        {errors.contentText && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contentText.message}
          </p>
        )}
      </div>

      {/* Dummy Image Upload Placeholder */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleAddImageClick}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {/* Icon placeholder or text */}
          📷 Add Image
        </button>
        <span className="text-xs text-gray-500">(Optional, coming soon)</span>
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
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;
