import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Posts from "../app/posts/page";

// Mock global fetch
global.fetch = jest.fn();

describe("Posts Page", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders loading state initially", async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})); // Never resolves to keep loading
    render(<Posts />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders posts on success", async () => {
    const mockPosts = [
      { _id: "1", title: "Test Post 1", description: "Desc 1" },
      { _id: "2", title: "Test Post 2", description: "Desc 2" },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockPosts }),
    });

    render(<Posts />);

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders error message on failure", async () => {
    fetch.mockRejectedValueOnce(new Error("API Failure"));

    render(<Posts />);

    await waitFor(() => {
      expect(screen.getByText(/Error: API Failure/i)).toBeInTheDocument();
    });
  });
});
