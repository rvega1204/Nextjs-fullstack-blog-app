import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";

describe("Navbar", () => {
  it("renders navbar links", () => {
    render(<Navbar />);

    expect(screen.getByText("My Blog")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
    expect(screen.getByText("Add New Post")).toBeInTheDocument();
  });

  it("toggles mobile menu", () => {
    render(<Navbar />);

    // Initial state: hidden on mobile (but standard check is class presence or visibility logic)
    // Since we can't easily check CSS classes for visibility in jsdom without layout, we'll check class modification

    const menuButton = screen.getByRole("button");
    const menuList = screen.getByRole("list");

    // Initially hidden logic checks for class "hidden"
    expect(menuList).toHaveClass("hidden");

    // Click to open
    fireEvent.click(menuButton);
    expect(menuList).toHaveClass("block");

    // Click to close
    fireEvent.click(menuButton);
    expect(menuList).toHaveClass("hidden");
  });
});
