import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostDetails from "../app/posts/[id]/page";
import { useRouter } from "next/navigation";
import React from "react";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock React.use
// We need to mock the entire react module to override `use`
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    use: jest.fn(),
  };
});

// Mock global fetch
global.fetch = jest.fn();

describe("PostDetails", () => {
  const pushMock = jest.fn();
  const mockId = "123";

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: pushMock,
    });
    fetch.mockReset();
    pushMock.mockClear();
    // Mock use to return params unwrapped
    React.use.mockReturnValue({ id: mockId });
  });

  it("deletes the post successfully", async () => {
    // We don't need promise anymore since use is mocked

    // Mock fetch for initial load (GET)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        post: { title: "Some Title", description: "Some Desc" },
      }),
    });

    // Mock fetch for DELETE
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    // No Suspense needed now!
    // We pass params as object, or promise, doesn't matter since use is mocked.
    // But propType might matter.
    render(<PostDetails params={{ id: mockId }} />);

    // Check for "Post Details" h1
    expect(await screen.findByText("Post Details")).toBeInTheDocument();

    // Find delete button
    const buttons = screen.getAllByRole("button");
    // First is Edit, Second is Delete based on code order
    const deleteButton = buttons[1];

    fireEvent.click(deleteButton);

    await waitFor(() => {
      // The second fetch call is the delete (first was initial load)
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        `http://localhost:3000/api/posts/${mockId}`,
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
