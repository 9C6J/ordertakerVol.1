import React, { useState } from "react";
import { FaBars, FaHome, FaTimes } from "react-icons/fa";
import { useAuth } from "~/common/auth";

import Link from "next/link"
import { Button } from "~/components/ui/button"
import { CardHeader, CardContent, Card } from "~/components/ui/card"
import { Avatar } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { SVGProps } from "react"
import { MountainIcon } from "lucide-react";
import router from "next/router";

const Navbar = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const { user, loggedIn, signOut } = useAuth();

  return (
    <nav className="bg-gray-200">
      <div className="mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {/* logo */}
            <div>
              <a href="/" className="flex items-center py-5 px-2 text-gray-700">
                <MountainIcon className="w-6 h-6" />
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <a href="/product" 
                className="py-5 px-3 text-gray-700 hover:text-gray-900"> 상품목록 </a>
              <a href="/purchase/history" 
                className="py-5 px-3 text-gray-700 hover:text-gray-900"> 주문조회</a>
              {
                loggedIn ? (
                  <>
                    <a href="/admin/purchaseHistory"
                      className="py-5 px-3 text-gray-700 hover:text-gray-900"> 관리자-주문조회 </a>
                    <a href="/admin/createProduct"
                      className="py-5 px-3 text-gray-700 hover:text-gray-900"> 상품등록 </a>
                  </>
                ) : ""
              }
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <a href="/purchase" 
              className="py-5 px-3"> 장바구니 </a>
            {
              loggedIn ? (
                <>
                  ({user?.email})
                  <a
                    href="/profile"
                    className="py-5 px-3 text-gray-700 hover:text-gray-900" > 마이페이지 </a>
                    <button className="py-5 px-3" onClick={signOut}> 로그아웃 </button>
                </>
              ) : 
              (
                <>
                  <a
                    href="/auth"
                    className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300" > 관리자 로그인 </a>
                  {/* <Button onClick={()=>router.push("/auth")}>관리자 로그인</Button> */}
                </>
              )
            }
          </div>

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
        <a href="/product" className="block py-2 px-4 text-sm hover:bg-gray-200">
          상품목록
        </a>
        <a href="/purchase/history" className="block py-2 px-4 text-sm hover:bg-gray-200">
          주문조회
        </a>
        
        {
          loggedIn ? (
            <>
              <a href="/admin/createProduct" className="block py-2 px-4 text-sm hover:bg-gray-200">
                상품등록
              </a>
              <a href="/admin/purchaseHistory" className="block py-2 px-4 text-sm hover:bg-gray-200">
                관리자-주문조회
              </a>
            </>
          ) : ""
        }
        
        <a
          href="/purchase"
          className="block py-2 px-4 text-sm hover:bg-gray-200"
        >
          장바구니
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
              관리자 로그인
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;