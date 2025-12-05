"use client";
import React, { useState } from "react";
import {
  AiOutlineHome,
  AiOutlinePlusCircle,
  AiOutlineMenu,
} from "react-icons/ai";
import { MdOutlinePostAdd } from "react-icons/md";
import Link from "next/link";

/**
 * Navbar component displays a navigation bar with links to different pages.
 * It includes a toggle button for mobile devices and a list of links to different pages.
 *
 * @returns {JSX.Element} The rendered component.
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl">My Blog</h1>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <AiOutlineMenu size={24} />
          </button>
        </div>
        <ul
          className={`md:flex md:items-center md:justify-between flex-1 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <li className="mx-4 hover:text-gray-300">
            <Link href="/" className="flex items-center">
              <AiOutlineHome className="mr-2" />
              Home
            </Link>
          </li>
          <li className="mx-4 hover:text-gray-300">
            <Link href="/posts" className="flex items-center">
              <MdOutlinePostAdd className="mr-2" />
              Posts
            </Link>
          </li>
          <li className="mx-4 hover:text-gray-300">
            <Link href="/posts/create" className="flex items-center">
              <AiOutlinePlusCircle className="mr-2" />
              Add New Post
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
