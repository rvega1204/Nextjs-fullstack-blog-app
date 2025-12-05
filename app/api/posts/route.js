import connectDB from "@/utils/connectDb";
import Post from "@/models/Posts";
import { NextResponse } from "next/server";

/**
 * POST /api/posts
 * Creates a new post in the database
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with created post or error message
 *
 * @example
 * // Request body
 * {
 *   "title": "My Post Title",
 *   "description": "Post description here"
 * }
 *
 * @throws {400} - Missing required fields or validation errors
 * @throws {409} - Duplicate entry
 * @throws {500} - Internal server error
 */
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    console.log(data);
    // Validate required fields
    const { title, description } = data;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    // Validate types and length
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

    if (description.length > 400) {
      return NextResponse.json(
        { message: "Description must not exceed 400 characters" },
        { status: 400 }
      );
    }

    if (typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json(
        { message: "Description must be a non-empty string" },
        { status: 400 }
      );
    }

    // Sanitize data before saving
    const sanitizedData = {
      title: title.trim(),
      description: description.trim(),
    };

    const post = await Post.create(sanitizedData);

    return NextResponse.json(
      { message: "Post created successfully", post },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error.message);

    // Handle specific Mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Duplicate entry", field: Object.keys(error.keyPattern)[0] },
        { status: 409 }
      );
    }

    // Handle all other errors
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/posts
 * Retrieves all posts from the database
 *
 * @returns {Promise<NextResponse>} JSON response with array of posts or error message
 *
 * @example
 * // Response
 * {
 *   "posts": [
 *     {
 *       "_id": "123",
 *       "title": "Post Title",
 *       "content": "Post content",
 *       "createdAt": "2024-01-01T00:00:00.000Z"
 *     }
 *   ]
 * }
 *
 * @throws {500} - Internal server error
 */
export async function GET() {
  try {
    await connectDB();

    // Retrieve all posts from database
    const posts = await Post.find();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
