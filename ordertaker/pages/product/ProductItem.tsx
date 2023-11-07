import Link from "next/link";
import React, { useState } from "react";
import BlurImage from "~/common/BlurImage";

type Product = {
  id: number;
  quantity? : number;
  created_at: string;
  title: string;
  imageSrc : string;
  price : number;
};

export default function ProductItem(
  props : {
    product : Product,
    width? : number,
    height? : number,
    linkOption? : Boolean|null
  },
  ) {
  return (
    // 여기까지 a태그
    <Link href={props.linkOption? `/product/${props.product.id}` : ''} className="font-bold text-blue-500">
      <div className="group aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
          <BlurImage
            imageSrc={props.product.imageSrc}
            width={props.width ? props.width : 500}
            height={props.height ? props.height : 500}
          />
      </div>
      {/* <input type="number"/> */}
      <p className="mt-1 text-lg font-medium text-gray-900 text-right">{props.product.title}</p>
      <h3 className="mt-4 text-sm text-gray-700 text-right">{(props.product.price).toLocaleString()} 원</h3>
  </Link>
  )
};


