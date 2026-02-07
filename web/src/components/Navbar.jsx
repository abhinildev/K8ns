import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const navLinks = ["Home", "Company", "Resources", "About", "Contact"];

  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      {/* Logo */}
      <h1 className="text-3xl font-bold text-[#00df9a] cursor-pointer">
        Home
      </h1>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-2">
        {navLinks.map((link, index) => (
          <li
            key={index}
            className="
              relative
              px-4
              py-2
              cursor-pointer
              transition-all
              duration-300
              hover:text-[#00df9a]
              hover:-translate-y-1
              after:content-['']
              after:absolute
              after:left-0
              after:bottom-0
              after:h-[2px]
              after:w-0
              after:bg-[#00df9a]
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            {link}
          </li>
        ))}
      </ul>

      {/* Mobile Menu Icon */}
      <div
        onClick={() => setNav(!nav)}
        className="
          block
          md:hidden
          z-20
          cursor-pointer
          transition-transform
          duration-300
          hover:rotate-90
        "
      >
        {nav ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          fixed
          top-0
          left-0
          h-full
          w-[65%]
          bg-[#000300]
          border-r
          border-gray-800
          transition-all
          duration-500
          ease-in-out
          ${nav ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
        `}
      >
        <h1 className="text-3xl font-bold text-[#00df9a] m-4">
          Home
        </h1>

        <ul className="uppercase p-4 space-y-2">
          {navLinks.map((link, index) => (
            <li
              key={index}
              className="
                p-4
                border-b
                border-gray-700
                cursor-pointer
                transition-all
                duration-300
                hover:text-[#00df9a]
                hover:pl-6
              "
            >
              {link}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
