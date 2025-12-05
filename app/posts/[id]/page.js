"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { MdEdit, MdDelete } from "react-icons/md";

/**
 * PostDetails functional component to display the details of a single post.
 * It fetches post data based on the provided ID from the URL parameters.
 * Allows editing and deleting the displayed post.
 *
 * @param {object} props - The component's properties.
 * @param {object} props.params - Next.js dynamic route parameters.
 * @param {string} props.params.id - The ID of the post to display.
 * @returns {JSX.Element} The rendered post details page.
 */
const PostDetails = ({ params }) => {
  const [data, setData] = useState(null);
  const { id } = React.use(params);
  const router = useRouter();

  /**
   * Fetches post data from the API based on the provided ID.
   * Updates the component's state with the fetched data.
   */
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`);
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, [id]);

  /**
   * Handles the deletion of the current post.
   * Sends a DELETE request to the API and redirects to the posts list on success.
   */
  const handleDeletePost = async () => {
    const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/posts");
    }
  };

  /**
   * Renders the post details page.
   * Displays the post title and description.
   * Provides options to edit or delete the post.
   */
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Details</h1>
        <div>
          <Link href={`/posts/edit/${data?.post?._id}`}>
            <button className="text-blue-500 hover:text-blue-700 mr-2">
              <MdEdit size="24" /> {/* Edit icon */}
            </button>
          </Link>
          <button
            onClick={handleDeletePost}
            className="text-red-500 hover:text-red-700"
          >
            <MdDelete size="24" /> {/* Delete icon */}
          </button>
        </div>
      </div>
      <p className="text-gray-500">{data?.post?.title}</p>
      <p className="text-gray-500">{data?.post?.description}</p>
    </div>
  );
};

export default PostDetails;
