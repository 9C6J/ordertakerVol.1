// /product/[id].tsx

import Image from 'next/image';
import { supabase } from '../../../src/api/supabase';
import React, { useState, useEffect} from "react";
import Router from "next/router";
import {getCookies, getCookie, setCookie, hasCookie, removeCookies} from 'cookies-next';
import Numericinput from '~/common/Numericinput';
import BlurImage from '~/common/BlurImage';


// 서버로부터 완전하게 만들어진 html파일을 받아와 페이지 전체를 렌더링 하는 방식
// 남용시 서버에 부담을 줄 수 있다.
export const getServerSideProps = async (router: { query: { id: string; }; }) => {
  // const router = useRouter();
  const { id } = router.query;

  const { data, error } = await supabase
  .from('product')
  .select()
  .eq('id', id) 

  if(error){
    console.error(error);
    return {
      redirect: {
          destination: '/',
          statusCode: 307
      }
    }
  }else{
    return {
      props: {
        product : data[0]
      }
    };
  }
  
}

type Product = {
  id: number;
  created_at: string;
  title: string;
  imageSrc : string;
  price : number;
  content : string;
  quantity : number;
  order_qunatity_limit : number;
};


const DetailProduct = ({product} : {product : Product}) => {
  const [isLoading, setLoading] = useState(true);
  const [iSum, setCount] = useState(product.price);
  const [quantity, setQuantity] = useState(1);
  

  useEffect(() => {
    const iSum = quantity * product.price;
    setCount(iSum);
    
  },[quantity]);

  const handleCount = (sTargetValue:string) => {
    const iQuantity = parseInt(sTargetValue);
    setQuantity(iQuantity);
  }

//  장바구니까지 -> 쿠키
//  위시 리스트 -> 디비저장
// 비회원일경우도 쿠키로처리하면 브라우저가 닫혀도 쿠키 유지시간동안 같은컴에서 장바구니를
// 확인 할수가 있겠지요...
// 쿠키를 구워서 장바구니를 구현하고 장바구니 비우기는 해당쿠키를 지워버리면 되지만
// 문제는 개별 지우기가 되겠지요? 제품의 고유번호를 쿠키로 구워서 쌓이게 되는형식이 되겠지요?
// 전 삭제 선택한 재품의 값을 받아서 그 선택한 재품의 값을 빼고 쿠키를 다시굽습니다.
// 이렇게 되면 장바구니 개별삭제가 가능하지요~


  // 장바구니담기
  const handleAddCart = ()=>{
    let cart: {product_id: string, quantity: number}[] = [];
    const sProductId : string = String(product.id);

    if(hasCookie('cart')){
      const cartCookie = getCookie("cart");

      if(typeof cartCookie === 'string'){

        if(cartCookie.indexOf(`"product_id":"${sProductId}"`) > -1){
          moveToCart(confirm("상품이 이미 장바구니에 있습니다. 장바구니로 이동할까요?"))
        }else{
          let aCartCookie = JSON.parse(cartCookie) ;
          
          if(Array.isArray(aCartCookie)){
            aCartCookie.push({product_id : String(product.id), quantity})
          }else{
            aCartCookie = cart;
            aCartCookie.push({product_id : String(product.id), quantity})
          }

          setCookie('cart',JSON.stringify(aCartCookie), {maxAge:30000});
          moveToCart(confirm("장바구니에 상품을 담았습니다. 장바구니로 이동할까요?"));
        }
      }
      
    }else{
      cart.push({product_id : String(product.id), quantity});
      setCookie('cart',JSON.stringify(cart),{maxAge:30000});
      moveToCart(confirm("장바구니에 상품을 담았습니다. 장바구니로 이동할까요?"));
    }
  }

  const moveToCart = (flag : Boolean)=>{
    return flag ? Router.push("/cart") : ''
  }

  type Order = {
    customer_id: string;
    total_price: number;
    address : string;
    payment_method : string;
  };

  // 주문
  const onSumbit  = async (event:React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  // const buttonValue = (event.target as HTMLButtonElement).activeElement?.getAttribute('value');
  alert("주문");
  
  const InsertOrderValue = {...product};
  const InsertOrderDetailValue = {...product};

  const s = {
    "customer_id" : "",
    "total_price" : "",
    "address" : "",
    "payment_method" : "",
  }
  // create table
  // public.order (
  //   id bigint generated by default as identity not null,
  //   customer_id character varying(36) not null,
  //   order_at timestamp without time zone not null,
  //   total_price integer not null default 0,
  //   address text not null,
  //   payment_method character varying(20) null,
  //   created_at timestamp with time zone null default now(),
  //   constraint order_pkey primary key (id)
  // ) tablespace pg_default;
    
  // 파일서버 업로드 성공
  // try {
    // 상품등록

    // total_price
    // address
    // payment_method

    const {data, error} = await supabase.from('order').insert(product);
    // const {data, error} = await supabase.from('orderDetail').insert(product);
    
    // if(error){
    //   throw new Error(error.message);
    // }

  //   console.log(data);
  // } catch (e) {
  //   console.error(e);
  //   // 에러처리
  // }
  // Router.push("/product");

  // location.reload();
  // resetFormFields();

};

  return (
      <form 
        onSubmit={onSumbit } 
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 content-center" >
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
            
        <div className="mb-6 " >
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
          > 
            상품이미지
          </label> 
          {/* 웹 */}
          <BlurImage
            imageSrc={product.imageSrc}
            width={500}
            height={500}
            className="h-full object-center object-cover md:block hidden"
          />
          {/* 모바일 */}
          <BlurImage
            imageSrc={product.imageSrc}
            width={1000}
            height={500}
            className="md:hidden w-full h-full object-center object-cover"
          />
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
          <Numericinput
              id="numericInput"
              inputMode="numeric" // 모바일환경 숫자키패드 옵션
              value={quantity} 
              onChange={(e:any)=>{
                handleCount(e)
              }} 
              min={1} 
              max={product.order_qunatity_limit}
            />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          > 
            주문총금액
          </label>
          {iSum? iSum.toLocaleString() : 0}원
        </div>
          
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleAddCart}
          >
            장바구니담기
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            주문하기
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={()=>{Router.push("/product")}}
          >
            목록으로
          </button>
        </div>

      </form>
  )
}

export default DetailProduct