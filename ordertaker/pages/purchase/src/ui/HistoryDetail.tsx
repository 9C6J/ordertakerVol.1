import React, { useState, useEffect } from "react";
import BlurImage from "~/common/BlurImage";
import { _getJsonCookie } from "~/utils/utils";
import Numericinput from "~/common/Numericinput";
import {CartItem as CartItemType} from "~/types/purchase";

export default function CartItem(
  props : {
    product : CartItemType,
    width? : number,
    height? : number,
  },
  ) {

  return (
    <div className="md:flex items-strech py-8 md:py-10 lg:py-8 border-t border-gray-50">
      <div className=" w-full">
    {/* <div className="md:flex items-strech py-8 md:py-10 lg:py-8 border-t border-gray-50">
      <div className="md:w-4/12 2xl:w-1/4 w-full"> */}
        {/* 웹 */}
        {/* <img src={props.product.imageSrc} alt="Black Leather Bag" className="h-full object-center object-cover md:block hidden" /> */}
        <BlurImage
            imageSrc={props.product.imageSrc}
            width={500}
            height={500}
            className="h-full object-center object-cover md:block hidden"
          />
        {/* 모바일 */}
        <BlurImage
            imageSrc={props.product.imageSrc}
            width={1000}
            height={500}
            className="md:hidden w-full h-full object-center object-cover"
          />
        {/* <img src={props.product.imageSrc} alt="Black Leather Bag" className="md:hidden w-full h-full object-center object-cover" /> */}

      </div>
      <div className="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
        <div className="flex items-center justify-between w-full pt-1">
          {/* 상품이름 */}
          <p className="text-base font-black leading-none text-gray-800 dark:text-white">{props.product.title}</p>
        </div>
        {/* 상품설명 */}
        <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">{(props.product.price)?.toLocaleString()} 원 • {props.product.quantity} 개</p>
      </div>
    </div>
  )
};


