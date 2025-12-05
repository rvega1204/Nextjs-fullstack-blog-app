"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";

/**
 * AddNewPost component for creating new blog posts.
 * It uses Formik for form management and Yup for validation.
 *
 * @returns {JSX.Element} The AddNewPost form component.
 */
const AddNewPost = () => {
  const router = useRouter();
  /**
   * State to hold any error message from the API submission.
   * @type {[Error | null, React.Dispatch<React.SetStateAction<Error | null>>]}
   */
  const [submitErr, setSubmitErr] = useState(null);

  /**
   * Formik hook for managing form state, validation, and submission.
   */
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    // Uncomment the validationSchema below to enable client-side validation
    // validationSchema: Yup.object({
    //   title: Yup.string().required("Title is required"),
    //   description: Yup.string().required("Description is required"),
    // }),
    /**
     * Handles the form submission.
     * Sends a POST request to the API to create a new post.
     * @param {object} values - The form values (title, description).
     * @param {string} values.title - The title of the post.
     * @param {string} values.description - The description/content of the post.
     */
    onSubmit: async (values) => {
      try {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();
        if (response.ok) {
          router.push("/posts"); // Redirect to the posts page on success
        }

        if (!response.ok) {
          // If the response is not OK, throw an error with the message from the API
          throw new Error(
            result.message || "An error occurred while creating the post"
          );
        }

        formik.resetForm(); // Reset the form fields after successful submission
      } catch (error) {
        // Catch and set any submission errors
        setSubmitErr(error);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-lg w-full p-8 bg-white shadow-xl rounded-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Add Post</h1>
        {/* Display submission error if any */}
        {submitErr && <div className="text-red-500">{submitErr.message}</div>}
        <p className="text-gray-500">Create your dream post</p>
        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
          <div>
            <input
              className="w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Enter Title"
              name="title"
              {...formik.getFieldProps("title")} // Binds input to Formik state for 'title'
            />
            {/* Display title validation error */}
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.title}
              </div>
            )}
          </div>
          <div>
            <textarea
              className="w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Enter description here..."
              name="description"
              {...formik.getFieldProps("description")} // Binds textarea to Formik state for 'description'
              rows="5"
              maxLength="5000"
            />
            {/* Display description validation error */}
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </div>
            )}
          </div>

          <button
            type="submit"
            // Disable button if form is invalid or currently submitting
            disabled={!formik.isValid || formik.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {formik.isSubmitting ? "Processing..." : "Add Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewPost;
