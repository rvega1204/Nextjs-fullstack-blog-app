import Posts from "@/models/Posts";
import connectDB from "@/utils/connectDb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

/**
 * Validates post ID format and existence
 *
 * @param {string} id - The post ID to validate
 * @returns {NextResponse|null} Error response if invalid, null if valid
 */
function validatePostId(id) {
  if (!id) {
    return NextResponse.json(
      { message: "Post ID is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid post ID format" },
      { status: 400 }
    );
  }

  return null;
}

/**
 * GET /api/posts/[id]
 * Retrieves a single post by ID
 *
 * @param {Request} request - The incoming request object
 * @param {Object} params - Route parameters
 * @param {string} params.id - The post ID
 * @returns {Promise<NextResponse>} JSON response with post or error message
 *
 * @example
 * // Response
 * {
 *   "post": {
 *     "_id": "123",
 *     "title": "Post Title",
 *     "content": "Post content",
 *     "createdAt": "2024-01-01T00:00:00.000Z"
 *   }
 * }
 *
 * @throws {400} - Missing or invalid post ID
 * @throws {404} - Post not found
 * @throws {500} - Internal server error
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const validationError = validatePostId(id);
    if (validationError) return validationError;

    const post = await Posts.findById(id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/[id]
 * Updates an existing post by ID
 *
 * @param {Request} request - The incoming request object
 * @param {Object} params - Route parameters
 * @param {string} params.id - The post ID
 * @returns {Promise<NextResponse>} JSON response with updated post or error message
 *
 * @example
 * // Request body
 * {
 *   "title": "Updated Title",
 *   "description": "Updated description"
 * }
 *
 * @throws {400} - Missing/invalid post ID or validation errors
 * @throws {404} - Post not found
 * @throws {500} - Internal server error
 */
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();

    const validationError = validatePostId(id);
    if (validationError) return validationError;

    // Validate and sanitize update data
    const { title, description } = data;
    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json(
          { message: "Title must be a non-empty string" },
          { status: 400 }
        );
      }

      if (title.length > 200) {
        return NextResponse.json(
          { message: "Title must not exceed 200 characters" },
          { status: 400 }
        );
      }

      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim().length === 0) {
        return NextResponse.json(
          { message: "Description must be a non-empty string" },
          { status: 400 }
        );
      }

      updateData.description = description.trim();
    }

    // Check if there's data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const post = await Posts.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post updated successfully", post },
      { status: 200 }
    );
  } catch (error) {
    // Handle specific Mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
 * Deletes a post by ID
 *
 * @param {Request} request - The incoming request object
 * @param {Object} params - Route parameters
 * @param {string} params.id - The post ID
 * @returns {Promise<NextResponse>} JSON response confirming deletion or error message
 *
 * @example
 * // Response
 * {
 *   "message": "Post deleted successfully",
 *   "post": { ... }
 * }
 *
 * @throws {400} - Missing or invalid post ID
 * @throws {404} - Post not found
 * @throws {500} - Internal server error
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const validationError = validatePostId(id);
    if (validationError) return validationError;

    const post = await Posts.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post deleted successfully", post },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
