import React, { useState, useEffect, useRef} from "react";
import { supabase } from './api/supabase';
import {getCookies, getCookie , setCookie, hasCookie, removeCookies, CookieValueTypes} from 'cookies-next';
import ProductItem  from "../components/ProductItem";
import CartItem  from "../components/CartItem";
import Order  from "../components/Order";

import { useSetRecoilState, useRecoilValue ,useResetRecoilState } from 'recoil';
import { contentState } from '../recoil/state';
import { useFormFields, _getJsonCookie } from "../lib/utils";
import Router from "next/router";


// export const getServerSideProps = async () => {
//   const { data: products } = await supabase.from('product').select('*');

//   return {
//     props: {
//       products
//     }
//   };
// }

// 상품쿠키
type ProductCookie = {
  product_id: string;
  quantity : number;
};
// 상품
type Product = {
  id: string;
  quantity : number;
  created_at: string;
  title: string;
  imageSrc : string;
  price : number;
  content : string;
  order_qunatity_limit : number;
}


// 주문
type PurchaseOrder = {
  // id: string;
  // customer_id: string;
  // order_at: Date;
  total_price: number // 주문총금액
  ,address: string    // 받을주소
  ,payment_method: string // 주문방법
  ,status: string // 주문상태
  ,purchaser_name : string // 구매자이름
  ,recipient_name : string // 수령인이름
  ,purchaser_phoneNumber : string // 구매자연락처
  ,recipient_phoneNumber : string // 수령인연락처
  ,order_request : string // 배송요청사항
}


// 주문서 초기화
const PURCHASE_FORM_VALUES: PurchaseOrder = {
  // id: string;
  // customer_id: string;
  // order_at: Date;
  total_price: 0 // 주문총금액
  ,address: ""    // 받을주소
  ,payment_method: "무통장" // 주문방법
  ,status: "주문요청" // 주문상태     주문요청 주문확인 배송중 배송완료
  ,purchaser_name : "" // 구매자이름
  ,recipient_name : "" // 수령인이름
  ,purchaser_phoneNumber : "" // 구매자연락처
  ,recipient_phoneNumber : "" // 수령인연락처
  ,order_request : "" // 배송요청사항
};

// 주문상세
type PurchaseOrderDetail = {
  id: string,
  size: string,
  price: string,
  quantity: string,
  order_id: string,
  product_id: string,
}



function Cart(){
  // 쿠키
  // const [cartCookie, setCartCookie] = useState<ProductCookie[]>([]);  
  // 상품
  const [product, setProduct] = useState<Product[]>([]);
  // 장바구니리스트
  const [cartList, setCartList] = useState<Product[]>([]);
  // 주문서
  const [orderBtn, setOrderBtn] = useState(false);
  const [order, setOrder] = useState<PurchaseOrder>(PURCHASE_FORM_VALUES);   
  const [orderValues, handleChange, resetFormFields] = useFormFields<PurchaseOrder>(PURCHASE_FORM_VALUES);

  const orderRef = useRef<HTMLDivElement>(null);
  
  const onHomeClick = () => {
    setOrderBtn(true);
    orderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchAndSetProduct() { 
      const cookie = _getJsonCookie("cart");
      
      if(cookie.length){
        const aProductId : Array<string> = [...cookie].map((o)=>{return o.product_id});
        const { data, error } = await supabase.from("product")
        .select()
        .in('id', aProductId);

        error && console.error("error=>",error);
        data && setProduct(data);

      }
    }
      fetchAndSetProduct(); 
  },[]);

  // useEffect(() => {
  //   orderRef.current?.scrollIntoView({ behavior: 'smooth' });
    

  // },[orderBtn]);

  useEffect(() => {
      onSetCartList();
  },[product]);

  useEffect(() => {
    let sum = 0;
    let oOrder = {...order};

    // 총주문금액
    cartList.forEach((o)=>{
      sum += o.quantity * o.price;
    });
    oOrder.total_price = sum;
    setOrder(oOrder);
    
  },[cartList]);

  function onSetCartList(){
    const cookie = _getJsonCookie("cart");

    product && 
    setCartList(cookie.map((o: { product_id: string; })=>{
      return Object.assign({}, o, product.filter((r)=>{return o.product_id == r.id})[0]); 
    })) 
    // console.log("cookie==>",cookie)
  }

  const handleMap = (e:any, type:'update'|'delete'|'detail'|'order', key : String, )=>{

    const handler = {
      update: (
        sTargetValue:React.ChangeEvent<HTMLInputElement>
        , key : String
      ) =>{

        const cartCookie = _getJsonCookie("cart");
        let bUpdateCookie : boolean = false;
  
        const aUpdatedCookie = cartCookie.map((o:any)=>{
          if(o.product_id == key){
            o.quantity = sTargetValue;
            bUpdateCookie = true;
          }
          return o;
        })
  
        bUpdateCookie && setCookie('cart',JSON.stringify(aUpdatedCookie), {maxAge:30000});

        onSetCartList();
      },
      delete: (
        e:any
        , key : any
      ) =>{
        const cartCookie = _getJsonCookie("cart");
        let bUpdateCookie : boolean = false;
  
        const aUpdatedCookie = cartCookie.filter((o:any)=>{
          if(o.product_id != key){
            return o;
          }
        })
        
        setCookie('cart',JSON.stringify(aUpdatedCookie), {maxAge:30000});

        onSetCartList();
        // fetchAndSetProduct();

      },
      detail: (
        e:any
        , key : String
      ) =>{
        // [...order]
        Router.push(`/product/${key}`);
      },
      order : ( e:any
        , orderValues : PurchaseOrder
      ) =>{
      }
    }[type](e,key)
  }
    return (
      
      <div className="top-0 sticky-0" id="chec-div">
          <div className="container px-5 py-0 mx-auto w-2/3">
            <div className="w-full absolute z-10 right-0  " >
            {/* transform translate-x-0 transition ease-in-out duration-700 */}
              <div className="flex items-end lg:flex-row flex-col justify-end" id="cart">
                {/* 장바구니리스트 */}
                <div className="lg:w-3/5  w-full h-auto lg:px-8 lg:py-14 md:px-6 px-4 md:py-8 py-4 bg-white dark:bg-gray-800 overflow-y-hidden overflow-x-hidden  " id="scroll">
                  {/*  */}
                  <p className="lg:text-4xl text-3xl font-black leading-10 text-gray-800 dark:text-white pt-3">장바구니</p>
                  {
                    cartList.length ?
                    cartList.map((product: Product, idx) => (
                        <CartItem key={idx} product={product} linkOption={false} handleMap={handleMap}/>
                    )) 
                    : <p> 담긴 상품이 없습니다. </p>
                  } 

                  {
                    cartList.length&&orderBtn ? <Order  ref={orderRef} orderValues={orderValues} handleChange={handleChange} handleMap={handleMap}/> : <></>
                  } 
                
                </div>

                  
                {/* 합계 */}
                <div className="lg:sticky lg:bottom-7 lg:w-96 w-full h-full bg-gray-100 dark:bg-gray-900 ">
                  <div className="flex flex-col h-auto lg:px-8 md:px-7 px-4 lg:py-20 md:py-10 py-6 justify-between overflow-y-auto">
                  {/* lg:h-screen  */}
                    <div>
                    
                      <p className="lg:text-4xl text-3xl font-black leading-9 text-gray-800 dark:text-white">주문서</p>
                      <div className="flex items-center justify-between pt-16">
                        <p className="text-base leading-none text-gray-800 dark:text-white">총 상품가격</p>
                        <p className="text-base leading-none text-gray-800 dark:text-white">{(order.total_price)?.toLocaleString()}</p>
                      
                      </div>
                      <div className="flex items-center justify-between pt-5">
                        <p className="text-base leading-none text-gray-800 dark:text-white">할인</p>
                        <p className="text-base leading-none text-gray-800 dark:text-white">0</p>
                      </div>
                      <div className="flex items-center justify-between pt-5">
                        <p className="text-base leading-none text-gray-800 dark:text-white">배송비</p>
                        <p className="text-base leading-none text-gray-800 dark:text-white">0</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center pb-6 justify-between lg:pt-5 pt-20">
                        <p className="text-2xl leading-normal text-gray-800 dark:text-white">총 주문금액</p>
                        <p className="text-2xl font-bold leading-normal text-right text-gray-800 dark:text-white">{(order.total_price)?.toLocaleString()} 원</p>
                      </div>
                      {
                        cartList.length? 
                          <button  
                            className="text-base leading-none w-full py-5 bg-gray-800 border-gray-800 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white dark:hover:bg-gray-700"
                            onClick={(e)=>{ !orderBtn ? onHomeClick() : handleMap(e,'order', orderValues)}}
                          >
                            주문하기
                          </button>
                          : 
                          <button  
                            className="text-base leading-none w-full py-5 bg-gray-800 border-gray-800 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white dark:hover:bg-gray-700"
                            onClick={(e)=>{ Router.push(`/product/productList`)}}
                          >
                            상품구경하기
                          </button>
                      } 
                      
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
      </div>
  );
};


export default Cart;