import React, { useState } from "react";
import { FaBars, FaHome, FaTimes } from "react-icons/fa";
import { useAuth } from "../lib/auth";

const Navbar = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const { user, loggedIn, signOut } = useAuth();

  let status = "not authenticated";
  return (
    //   navbar goes here
    <nav className="bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {/* logo */}
            <div>
              <a href="/" className="flex items-center py-5 px-2 text-gray-700">
                <FaHome className="w-6 h-6" />
                {/* <span className="font-bold px-2"></span> */}
              </a>
            </div>

            {/* primary nav */}
            <div className="hidden md:flex items-center space-x-1">
            <a
                href="/gallery"
                className="py-5 px-3 text-gray-700 hover:text-gray-900"
              >
                갤러리
              </a>
              <a
                href="/product/productList"
                className="py-5 px-3 text-gray-700 hover:text-gray-900"
              >
                상품목록
              </a>
              <a
                href="/product/CreateProduct"
                className="py-5 px-3 text-gray-700 hover:text-gray-900"
              >
                상품등록
              </a>
              <a
                href="/profile"
                className="py-5 px-3 text-gray-700 hover:text-gray-900"
              >
                마이페이지
              </a>
            </div>
          </div>
          {/* secondary nav */}
          {loggedIn ? (
            <div className="hidden md:flex items-center space-x-1">
              ({user?.email})
              <button className="py-5 px-3" onClick={signOut}>
                로그아웃
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-1">
              <a href="/auth" className="py-5 px-3">
                로그인
              </a>
              <a
                href="/auth"
                className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
              >
                회원가입
              </a>
            </div>
          )}
          {/* mobile menu */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuToggle(!menuToggle)}>
              {menuToggle ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu items */}
      <div className={`${!menuToggle ? "hidden" : ""} md:hidden`}>
        <a href="/gallery" className="block py-2 px-4 text-sm hover:bg-gray-200">
          갤러리
        </a>
        <a href="/productList" className="block py-2 px-4 text-sm hover:bg-gray-200">
          상품목록
        </a>
        <a href="/product" className="block py-2 px-4 text-sm hover:bg-gray-200">
          상품등록
        </a>
        <a
          href="/profile"
          className="block py-2 px-4 text-sm hover:bg-gray-200"
        >
          마이페이지
        </a>

        {loggedIn ? (
          <button
            className="block py-2 px-4 text-sm hover:bg-gray-200"
            onClick={signOut}
          >
            로그아웃
          </button>
        ) : (
          <div>
            <a
              href="/auth"
              className="block py-2 px-4 text-sm hover:bg-gray-200"
            >
              로그인
            </a>
            <a
              href="/auth"
              className="block py-2 px-4 text-sm hover:bg-gray-200"
            >
              회원가입
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;