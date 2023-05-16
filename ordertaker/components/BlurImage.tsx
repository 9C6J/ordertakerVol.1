import React, { useState } from "react";
import Image from 'next/image'
import { cn } from "../lib/utils";

export default function BlurImage(
  props : {
    imageSrc : string,
    width : number,
    height : number
  },
  ) {
  const [isLoading, setLoading] = useState(true)
  return (
    props.imageSrc? 
      // <a>
        <div className="group aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
            <Image
                alt=""
                src={props.imageSrc}
                priority={true}
                width={props.width? props.width: 500}
                height={props.height? props.height: 500}
                className={cn(
                  'duration-700 ease-in-out group-hover:opacity-80',
                  isLoading
                    ? 'scale-110 blur-2xl grayscale'
                    : 'scale-100 blur-0 grayscale-0'
                )}
                onLoadingComplete={() => setLoading(false)}
              />
        </div>
    //  </a> 
     :
    //  <a href={`/product/${image.id}`} >
      <div className="group aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <p className="flex justify-center items-center text-center text-gray-500">이미지없음</p>
      </div>
    // </a>
  )
};


