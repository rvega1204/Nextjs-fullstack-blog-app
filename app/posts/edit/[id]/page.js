"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

/**
 * UpdatePost component for editing an existing post.
 * It fetches the post data based on the ID from the URL parameters,
 * and allows the user to update the title and description of the post.
 * Uses Formik for form management and validation.
 *
 * @param {object} props - The component props.
 * @param {object} props.params - The route parameters, containing the post ID.
 * @param {string} props.params.id - The ID of the post to be updated.
 * @returns {JSX.Element} The Update Post form.
 */
const UpdatePost = ({ params }) => {
  const { id } = React.use(params); // Access the post ID from the URL parameters
  const [data, setData] = useState(null); // State to store the fetched post data
  const [submitErr, setSubmitErr] = useState(null); // State to store submission errors
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    /**
     * Fetches the post data from the API based on the provided ID.
     */
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching post: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setSubmitErr(error); // Display fetch error to user
      }
    };
    fetchData();
  }, [id]); // Re-run effect if 'id' changes

  const formik = useFormik({
    initialValues: {
      description: data?.post?.description || "",
      title: data?.post?.title || "",
    },
    enableReinitialize: true, // Reinitialize form values when 'data' changes
    onSubmit: async (values) => {
      setSubmitErr(null); // Clear previous errors
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const result = await response.json();
        if (response.ok) {
          router.push("/posts"); // Redirect to posts list on successful update
        } else {
          // Throw an error if the API response indicates a failure
          throw new Error(
            result.message || "An error occurred while updating the post"
          );
        }

        formik.resetForm(); // Reset form fields after successful submission (though we are redirecting)
      } catch (error) {
        console.error("Failed to update post:", error);
        setSubmitErr(error); // Set submission error to display to the user
      }
    },
  });

  // Display a loading state or handle data not being available yet
  if (!data && !submitErr) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        Loading post...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-lg w-full p-8 bg-white shadow-xl rounded-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Update Post</h1>
        {submitErr && (
          <div className="text-red-500 mb-4">{submitErr.message}</div>
        )}
        <p className="text-gray-500">Edit your post</p>
        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
          <div>
            <input
              className="w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Enter Title"
              name="title"
              {...formik.getFieldProps("title")}
            />
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
              {...formik.getFieldProps("description")}
              rows="5"
              maxLength="5000"
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </div>
            )}
          </div>
          <button
            type="submit"
            // Disable button if form is not valid or actively submitting
            disabled={!formik.isValid || formik.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {formik.isSubmitting ? "Processing..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
