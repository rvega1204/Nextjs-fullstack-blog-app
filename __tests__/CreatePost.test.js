import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddNewPost from "../app/posts/create/page";
import { useRouter } from "next/navigation";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();

describe("AddNewPost", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: pushMock,
    });
    fetch.mockReset();
    pushMock.mockClear();
  });

  it("renders the form", () => {
    render(<AddNewPost />);
    expect(screen.getByPlaceholderText("Enter Title")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter description here...")
    ).toBeInTheDocument();
    // Select by role to avoid ambiguity with H1
    expect(
      screen.getByRole("button", { name: "Add Post" })
    ).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<AddNewPost />);

    fireEvent.change(screen.getByPlaceholderText("Enter Title"), {
      target: { value: "New Post Title" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter description here..."), {
      target: { value: "New Post Description" },
    });

    // Select by role
    fireEvent.click(screen.getByRole("button", { name: "Add Post" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/posts",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            title: "New Post Title",
            description: "New Post Description",
          }),
        })
      );
    });

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });

  it("handles submission error", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Creation failed" }),
    });

    render(<AddNewPost />);

    fireEvent.change(screen.getByPlaceholderText("Enter Title"), {
      target: { value: "Title" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter description here..."), {
      target: { value: "Desc" },
    });

    // Select by role
    fireEvent.click(screen.getByRole("button", { name: "Add Post" }));

    await waitFor(() => {
      expect(screen.getByText("Creation failed")).toBeInTheDocument();
    });
  });
});
