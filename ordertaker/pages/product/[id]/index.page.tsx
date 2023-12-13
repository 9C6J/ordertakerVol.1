import Image from 'next/image';
import { supabase } from '../../../src/api/supabase';
import React, { useState, useEffect} from "react";
import Router from "next/router";
import {getCookies, getCookie, setCookie, hasCookie, removeCookies} from 'cookies-next';
import Numericinput from '~/common/Numericinput';
import BlurImage from '~/common/BlurImage';
import { Product } from '~/types/product';
import { CartCookies } from '~/types/purchase';

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

  // 장바구니담기
  const handleAddCart = ()=>{
    let cart: CartCookies = [];
    const sProductId = product.id;

    debugger;
    if(hasCookie('cart')){
      const cartCookie = getCookie("cart");

      if(typeof cartCookie === 'string'){

        if(cartCookie.indexOf(`"product_id":${sProductId}`) > -1){
          moveToCart(confirm("상품이 이미 장바구니에 있습니다. 장바구니로 이동할까요?"))
        }else{
          let aCartCookie = JSON.parse(cartCookie) ;
          
          if(Array.isArray(aCartCookie)){
            aCartCookie.push({product_id : product.id, quantity})
          }else{
            aCartCookie = [cart];
            aCartCookie.push({product_id : product.id, quantity})
          }

          setCookie('cart',JSON.stringify(aCartCookie), {maxAge:30000});
          moveToCart(confirm("장바구니에 상품을 담았습니다. 장바구니로 이동할까요?"));
        }
      }
      
    }else{
      cart.push({product_id : Number(product.id), quantity});
      setCookie('cart',JSON.stringify(cart),{maxAge:30000});
      moveToCart(confirm("장바구니에 상품을 담았습니다. 장바구니로 이동할까요?"));
    }
  }

  const moveToCart = (flag : Boolean)=>{
    return flag ? Router.push("/purchase") : ''
  }



  // 주문
  const onSumbit  = async (event:React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  // const buttonValue = (event.target as HTMLButtonElement).activeElement?.getAttribute('value');
  alert("주문");

  const {data, error} = await supabase.from('order').insert(product);

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