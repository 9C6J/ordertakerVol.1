import React, { useState, useEffect} from "react";

import { supabase } from './api/supabase';
import Image from 'next/image'
import { useRouter} from "next/router";


export default function Product(){

// 상품번호 id
// 상품제목 title
// 상품가격 price
// 상품이미지 imageSrc
// 상품사이즈 size
// 상품설명 content

  return (
    <div>
      <form
          // onSubmit={}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
            
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품제목
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              name="title"
              type="title"
              placeholder=""
              required
            />
          </div>
            
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품가격
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              name="price"
              type="price"
              placeholder=""
              required
            />
          </div>
            
          <div className="mb-6 ">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품이미지
            </label>
            
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div> 

          </div>
          
            
          {/* <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품사이즈
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="size"
              name="size"
              type="size"
              placeholder=""
              required
            />
          </div> */}
            
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품설명
            </label>
            <textarea
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              cols={40}
              rows={8}
              id="content"
              name="content"
              placeholder=""
              required
            />
          </div>
          

          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              상품등록
            </button>
          </div>
        </form>
    </div>
  )

}
