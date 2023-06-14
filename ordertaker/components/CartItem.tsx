import Link from "next/link";
import React, { useState, useEffect } from "react";
import BlurImage from "./BlurImage";
import Image from 'next/image'
import {getCookies, getCookie, setCookie, hasCookie, removeCookies} from 'cookies-next';
import { _getJsonCookie } from "../lib/utils";
import Numericinput from "./Numericinput";

type Product = {
  id: string;
  quantity : number;
  created_at: string;
  title: string;
  imageSrc : string;
  price : number;
  content : string;
  order_qunatity_limit : number;
};

export default function CartItem(
  props : {
    product : Product,
    width? : number,
    height? : number,
    linkOption? : Boolean|null,
    handleMap? : any
  },
  ) {
 
    function updateCartCookie(e:React.ChangeEvent<HTMLInputElement>, product_id:Product["id"]){
      let sTargetValue = e.target.value;

      debugger;
      if (parseInt(sTargetValue) > props.product.order_qunatity_limit ){
        sTargetValue = String(props.product.order_qunatity_limit);
      } else if (parseInt(sTargetValue) < 1 ){
        alert("최소 주문수량은 1개 입니다.");
        sTargetValue = "1";
      }

      
      props.handleMap(sTargetValue,'update',props.product.id);

    }

  return (
    // 여기까지 a태그
    <div className="md:flex items-strech py-8 md:py-10 lg:py-8 border-t border-gray-50">
      <div className="md:w-4/12 2xl:w-1/4 w-full">
        {/* 웹 */}
        {/* <image src={props.product.imageSrc} alt="" className="h-full object-center object-cover md:block hidden" /> */}
        {/* <img src={props.product.imageSrc} alt="Black Leather Bag" className="h-full object-center object-cover md:block hidden" /> */}
        <BlurImage
            imageSrc={props.product.imageSrc}
            width={500}
            height={10}
            className="h-full object-center object-cover md:block hidden"
          />
        {/* 모바일 */}
        <BlurImage
            imageSrc={props.product.imageSrc}
            width={500}
            height={10}
            className="md:hidden w-full h-full object-center object-cover"
          />
        {/* <img src={props.product.imageSrc} alt="Black Leather Bag" className="md:hidden w-full h-full object-center object-cover" /> */}

      </div>
      <div className="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
        <p className="text-xs leading-3 text-gray-800 dark:text-white md:pt-0 pt-4">{props.product.id}</p>
        <div className="flex items-center justify-between w-full pt-1">
          {/* 상품이름 */}
          <p className="text-base font-black leading-none text-gray-800 dark:text-white">{props.product.title}</p>
            <Numericinput
              id="numericInput"
              inputMode="numeric" // 모바일환경 숫자키패드 옵션
              value={props.product.quantity} 
              onChange={(e:any)=>{
                updateCartCookie(e,props.product.id)
              }} 
              min={1} 
              max={props.product.order_qunatity_limit} 
            />
           {/* <select aria-label="Select quantity" className="py-2 px-1 border border-gray-200 mr-6 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
            <option>01</option>
            <option>02</option>
            <option>03</option>
            <option>04</option>
            <option>05</option>
          </select> */}
        </div>
        {/* 상품설명 */}
        <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">{(props.product.price)?.toLocaleString()} 원</p>
        <p className="text-xs leading-3 text-gray-600 dark:text-white py-2">{props.product.content}</p>
        <p className="text-xs leading-3 text-gray-600 dark:text-white py-2">구매제한갯수 : {props.product.order_qunatity_limit} 개</p>
        <div className="flex items-center justify-between pt-5">
          <div className="flex itemms-center">
            <p className="text-xs leading-3 underline text-gray-800 dark:text-white cursor-pointer" onClick={(e)=>{props.handleMap(e,'detail',props.product.id);}} >상세정보</p>
            <p className="text-xs leading-3 underline text-red-500 pl-5 cursor-pointer" onClick={(e)=>{props.handleMap(e,'delete',props.product.id);}}>삭제</p>
          </div>
          <p className="text-base font-black leading-none text-gray-800 dark:text-white">{(props.product.price*props.product.quantity)?.toLocaleString()} 원</p>
        </div>
      </div>
    </div>
  )
};


