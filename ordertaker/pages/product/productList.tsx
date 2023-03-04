import React, { useState, useEffect} from "react";

import { supabase } from '../api/supabase';
import Image from 'next/image'
import Link from 'next/link'

// type ImageProps = {
//   data: string;
//   status: string;
//   statusText : string;
// };

// const IMAGE_VALUES: ImageProps = {
//   data: "",
//   status: "",
//   statusText : "",
// };

// 서버로부터 완전하게 만들어진 html파일을 받아와 페이지 전체를 렌더링 하는 방식
// 남용시 서버에 부담을 줄 수 있다.
export const getServerSideProps = async () => {
  const { data: products } = await supabase.from('product').select('*');

  return {
    props: {
      products
    }
  };
}

function BlurImage({image} : {image : Product}) {
  const [isLoading, setLoading] = useState(true)
  return (
    <a href={`/product/${image.id}`} >
      <div className="group aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        
          {/* <Link href={`/product/${image.id}`}> */}
            <Image
              alt=""
              src={image.imageSrc}
              priority={true}
              width={500}
              height={500}
              className={cn(
                'duration-700 ease-in-out group-hover:opacity-80',
                isLoading
                  ? 'scale-110 blur-2xl grayscale'
                  : 'scale-100 blur-0 grayscale-0'
              )}
              onLoadingComplete={() => setLoading(false)}
            />
          {/* </Link> */}
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{image.title}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.price}</p>
    </a>
  )
};


/**
 * 배열 안에 존재할 수 있는 falsy한 값들을 제거하여 배열을 믿을 수 있는 상태로 만들기 위해 사용
 * 참고: https://velog.io/@yongbum/filter-boolean
*/
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
};


type Product = {
  id: number;
  created_at: string;
  title: string;
  imageSrc : string;
  price : number;
};

// const Gallery = (props : Image|Image[]) => {
function ProductList({products} : { products : Product[]}){
    return (
    <div className="container px-5 py-10 mx-auto w-2/3">
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
            <BlurImage key={product.id} image={product} />
        ))}
      </div>

    </div>
  );
};

export default ProductList;