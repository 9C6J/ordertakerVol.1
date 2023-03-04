// /product/[id].tsx

import { useRouter } from 'next/router';
import Image from 'next/image';
import { supabase } from '../api/supabase';
import React, { useState, useEffect} from "react";

// 서버로부터 완전하게 만들어진 html파일을 받아와 페이지 전체를 렌더링 하는 방식
// 남용시 서버에 부담을 줄 수 있다.
export const getServerSideProps = async (router: { query: { id: string; }; }) => {
  // const router = useRouter();
  const { id } = router.query;

  const { data, error } = await supabase
  .from('product')
  .select()
  .eq('id', id) 

  if(data){
    
    return {
      props: {
        product : data[0]
      }
    };
  }else if(error){
    console.error(error);
  }
  
}


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
  content : string;
};

const DetailProduct = ({product} : {product : Product}) => {
  const [isLoading, setLoading] = useState(true)
  
  return (
    
      <div>

      <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
            
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품명
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              name="title"
              type="title"
              placeholder=""
              required
              value={product.title}
              readOnly
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
              value={product.price}
              readOnly

            />
          </div>
            
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품이미지
            </label>
            <Image
              alt=""
              src={product.imageSrc}
              priority={true}
              width={500}
              height={500}
              className={cn(
                'duration-700 ease-in-out group-hover:opacity-80 mx-auto',
                isLoading
                  ? 'scale-110 blur-2xl grayscale'
                  : 'scale-100 blur-0 grayscale-0'
              )}
              onLoadingComplete={() => setLoading(false)}
            />
          </div>
          
            
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
              value={product.content}
              readOnly
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

export default DetailProduct