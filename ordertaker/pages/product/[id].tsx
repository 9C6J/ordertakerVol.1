// /product/[id].tsx

import { Router } from 'next/router';
import Image from 'next/image';
import { supabase } from '../api/supabase';
import React, { useState, useEffect} from "react";

import { cn } from "../../lib/utils";


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

type Product = {
  id: number;
  created_at: string;
  title: string;
  imageSrc : string;
  price : number;
  content : string;
};


// 주문
// const handleSumbit = async (event : any) => {
//   event.preventDefault();

//   const InsertValue = {...values};

//   // 파일서버 업로드 성공
//   try {
//     // 상품등록
//     const {data, error} = await supabase.from('product').insert(InsertValue);
    
//     if(error){
//       throw new Error(error.message);
//     }

//     console.log(data);
//   } catch (e) {
//     console.error(e);
//     // 에러처리
//   }
//   // Router.push("/product/productList");

//   // location.reload();
//   // resetFormFields();

// };


const DetailProduct = ({product} : {product : Product}) => {
  const [isLoading, setLoading] = useState(true)
  const [iSum, setCount] = useState(product.price);
  
  const handleCount = (e: any) => {
    let iCount = e.target.value;
    let iSum = e.target.value * product.price;
    setCount(iSum);
  }

  return (
      <form 
        // onSubmit={handleSumbit} 
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
          > 
            상품명
          </label>
          {product.title}
        </div>
            
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
          > 
            상품가격
          </label>
          {/* ko-KR */}
          {(product.price).toLocaleString()} 원
        </div>
            
        <div className="mb-6 w-1/4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
          > 
            상품이미지
          </label>
          {product.imageSrc ? 
                <Image
                    alt=""
                    src={product.imageSrc}
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
          : 
          <div className="overflow-hidden rounded-lg bg-gray-200 h-40 flex justify-center items-center" >
            <p className="text-gray-500">이미지없음</p>
          </div>} 
        </div> 
          
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          > 
            상품설명
          </label>
          {product.content}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          > 
            주문수량
          </label>
          <input 
            type="number"
            onChange={(e)=> { handleCount(e); }}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          > 
            주문총금액
          </label>
          {iSum}
        </div>
          
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            주문하기
          </button>
        </div>
      </form>
  )
}

export default DetailProduct