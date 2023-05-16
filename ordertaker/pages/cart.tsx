import React, { useState, useEffect} from "react";
import { supabase } from './api/supabase';
import {getCookies, getCookie , setCookie, hasCookie, removeCookies, CookieValueTypes} from 'cookies-next';
import ProductItem  from "../components/ProductItem";

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

type Product = {
  id: number;
  quantity : number;
  created_at: string;
  title: string;
  imageSrc : string;
  price : number;
};

type ProductCookie = {
  product_id: number;
  quantity : number;
};


function Cart(){
  const [cookie, setCookieList] = useState<ProductCookie[]>([]);  
  const [cartList, setCartList] = useState<Product[]>([]);  

  useEffect(() => {
    // 쿠키id 값을받아서 유효성체크한후 object로 바꿔주는 공통함수필요할듯.
    const cartCookie : CookieValueTypes = getCookie("cart");
    console.log("cartCookie",cartCookie);

    if(typeof cartCookie === "string"){
      setCookieList(JSON.parse(cartCookie));
      console.log("쿠키저장완료",cartCookie)
    }else{
      console.log("쿠키저장실패")
    }
  }, []);
  
  useEffect(() => {
    async function fetchAndSetProduct() { 
      console.log("cookie있나요?",cookie)
      if(cookie.length){
        const aProductId : Array<number> = [...cookie].map((o)=>{return o.product_id});
        const { data , error } = await supabase.from("product")
        .select()
        .in('id', aProductId);
        
        data &&
        setCartList(cookie.map((o)=>{
          return Object.assign(o, data.filter((r)=>{return o.product_id == r.id})[0]); 
        }))
      
      }else{
        console.log("cookie없어요?",cookie)
      }
    }
      fetchAndSetProduct(); 
  },[cookie]);

    return (
    <div className="container px-5 py-10 mx-auto w-2/3">
      장바구니목록
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {cartList?.map((product: Product) => (
            <ProductItem key={product.id} product={product} width={500} height={500} linkOption={true} />
        ))}
      </div>

      전체선택

      총상품가격, 배송비

      주문하기
    </div>
  );
};

export default Cart;