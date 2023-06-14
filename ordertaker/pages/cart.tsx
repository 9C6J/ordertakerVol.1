import React, { useState, useEffect} from "react";
import { supabase } from './api/supabase';
import {getCookies, getCookie , setCookie, hasCookie, removeCookies, CookieValueTypes} from 'cookies-next';
import ProductItem  from "../components/ProductItem";
import CartItem  from "../components/CartItem";

import { useSetRecoilState, useRecoilValue ,useResetRecoilState } from 'recoil';
import { contentState } from '../recoil/state';
import { _getJsonCookie } from "../lib/utils";
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
  // customer_id: string;
  // id: string;
  // order_at: Date;
  total_price: number,
  address: string,
  payment_method_code: string,
  payment_method_name: string,
  status: string,
  // created_at: Date
}

// 주문서 초기화
const PURCHASE_FORM_VALUES: PurchaseOrder = {
  // customer_id: string;
  // order_at: Date;
  total_price: 0,
  address: "",
  payment_method_code: "mu",
  payment_method_name: "무통장",
  status: "",
  // created_at: Date
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
  const [cartCookie, setCartCookie] = useState<ProductCookie[]>([]);  
  // 상품
  const [product, setProduct] = useState<Product[]>([]);
  // 장바구니리스트
  const [cartList, setCartList] = useState<Product[]>([]);
  // 주문서
  const [order, setOrder] = useState<PurchaseOrder>(PURCHASE_FORM_VALUES);   
  // const [order, setOrder] = useState<PurchaseOrderDetail>();   
  // const [order, setOrder] = useState(new Map<Product["id"],Product["quantity"]>);   

  // const [reqContent, setReqContent] = useState({
  //   name:'sample',status:true,message:'xptmxm'
  // })
  // const setContent = useSetRecoilState(contentState);
  // const content = useRecoilValue(contentState);

  // useEffect(() => {
      
  //     // upsertAll(cookie);

  // }, []);
  
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

  useEffect(() => {
      onSetCartList();
  },[product]);

  useEffect(() => {
    let sum = 0;
    let oOrder = {...order};

    cartList.forEach((o)=>{
      sum += o.quantity * o.price;
    });

    oOrder.total_price = sum;
    setOrder(oOrder);
    
  },[cartList]);

  function onSetCartList(){
    const cookie = _getJsonCookie("cart");

    // console.log("handleMapCookie==>",cookie)
    // console.log("product==>",product)

    product && 
    setCartList(cookie.map((o: { product_id: string; })=>{
      return Object.assign({}, o, product.filter((r)=>{return o.product_id == r.id})[0]); 
    })) 
    // console.log("cookie==>",cookie)
  }

  const handleMap = (e:any, type:'update'|'delete'|'detail', key : String, )=>{

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
        , key : String
      ) =>{
        debugger;
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
      }
    }[type](e,key)
  }
  const upsert = (key : Product["id"], value : Product["quantity"]) => {
    // setOrder((prev) => (prev).set(key,value));
  }
  const upsertAll = (array : ProductCookie[]) => {
    array.map((o)=>{
      // setOrder((prev) => new Map((prev).set(o["product_id"],o["quantity"])));
    })
  }

    return (
      
      <div className="w-full h-full top-0 sticky-0" id="chec-div">
          <div className="container px-5 py-0 mx-auto w-2/3">
            <div className="w-full absolute z-10 right-0 h-full overflow-x-hidden" id="checkout">
            {/* transform translate-x-0 transition ease-in-out duration-700 */}
              <div className="flex items-end lg:flex-row flex-col justify-end" id="cart">
                {/* 장바구니리스트 */}
                <div className="lg:w-3/5 md:w-8/12 w-full lg:px-8 lg:py-14 md:px-6 px-4 md:py-8 py-4 bg-white dark:bg-gray-800 overflow-y-hidden overflow-x-hidden lg:h-screen h-auto" id="scroll">
                  <p className="lg:text-4xl text-3xl font-black leading-10 text-gray-800 dark:text-white pt-3">장바구니</p>
                  
                  {
                    cartList.length ?
                    cartList.map((product: Product) => (
                        <CartItem key={product.id} product={product} linkOption={false} handleMap={handleMap}/>
                    )) 
                    : <p> 담긴 상품이 없습니다. </p>
                  } 

                </div>
        
                {/* 합계 */}
                <div className="lg:w-96 md:w-8/12 w-full bg-gray-100 dark:bg-gray-900 h-full">
                  <div className="flex flex-col lg:h-screen h-auto lg:px-8 md:px-7 px-4 lg:py-20 md:py-10 py-6 justify-between overflow-y-auto">
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
                      <button  className="text-base leading-none w-full py-5 bg-gray-800 border-gray-800 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white dark:hover:bg-gray-700">주문하기</button>
                      {/* onClick="checkoutHandler1(true)" */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
  );
};



{/* <style>
  //width
  #scroll::-webkit-scrollbar {
    width: 1px;
  }

  // Track
  #scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  //Handle
  #scroll::-webkit-scrollbar-thumb {
    background: rgb(133, 132, 132);
  }
</style> */}
{/* <script>
let checkout = document.getElementById("checkout");
let checdiv = document.getElementById("chec-div");
let flag3 = false;
const checkoutHandler = () => {
  if (!flag3) {
    checkout.classList.add("translate-x-full");
    checkout.classList.remove("translate-x-0");
    setTimeout(function () {
      checdiv.classList.add("hidden");
    }, 1000);
    flag3 = true;
  } else {
    setTimeout(function () {
      checkout.classList.remove("translate-x-full");
      checkout.classList.add("translate-x-0");
    }, 1000);
    checdiv.classList.remove("hidden");
    flag3 = false;
  }
};
</script> */}

export default Cart;