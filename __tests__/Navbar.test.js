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
