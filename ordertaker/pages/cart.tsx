import React, { useState, useEffect} from "react";
import { supabase } from './api/supabase';
import {getCookies, getCookie , setCookie, hasCookie, removeCookies, CookieValueTypes} from 'cookies-next';
import ProductItem  from "../components/ProductItem";
import CartItem  from "../components/CartItem";

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
  id: string;
  quantity : number;
  created_at: string;
  title: string;
  imageSrc : string;
  price : number;
  content : string;
}

type ProductCookie = {
  product_id: string;
  quantity : number;
};

type PurchaseOrder = {

}

function Cart(){
  const [cookie, setCookieList] = useState<ProductCookie[]>([]);  
  const [cartList, setCartList] = useState<Product[]>([]);  
  const [order, setOrder] = useState(new Map<Product["id"],Product["quantity"]>);   

  useEffect(() => {
    // 쿠키id 값을받아서 유효성체크한후 object로 바꿔주는 공통함수필요할듯.
    const cartCookie : CookieValueTypes = getCookie("cart");
    console.log("cartCookie",cartCookie);

    if(typeof cartCookie === "string"){
      const parseCookie = JSON.parse(cartCookie);
      setCookieList(parseCookie);
      
      upsertAll(parseCookie);

      console.log("쿠키저장완료",cartCookie)
    }else{
      console.log("쿠키저장실패")
    }
  }, []);
  
  useEffect(() => {
    async function fetchAndSetProduct() { 
      if(cookie.length){
        const aProductId : Array<string> = [...cookie].map((o)=>{return o.product_id});
        const { data , error } = await supabase.from("product")
        .select()
        .in('id', aProductId);
        
        data &&
        setCartList(cookie.map((o)=>{
          return Object.assign({}, o, data.filter((r)=>{return o.product_id == r.id})[0]); 
        }))
      
      }

      // if(order.size){
      //   let arrCartList : Array<Product> = [];
      //   let arrProductId : Array<string> = [];
      //   order.forEach((value,key)=>{return arrProductId.push(key)})
      //   // for (const [key, value] of order) {
      //   //   arrProductId.push(key)
      //   // }
        
      //   const { data , error } = await supabase.from("product")
      //   .select()
      //   .in('id', arrProductId);

      //   data && 
      //   order.forEach((value,key)=>{
      //     // return arrProductId.push(key)
      //     arrCartList.push(Object.assign({}, {product_id:key,quantity:value}, data.filter((r)=>{return key == r.id})[0])); 
      //   }) 
      //   setCartList(arrCartList)
      // }
    }
      fetchAndSetProduct(); 
  },[cartList,order]);

  const handleMap = (e:any, type:'update'|'delete'|'sum', key : String, )=>{
    const handler = {
      update: () =>{
        setOrder((prev) => new Map((prev).set(String(key),e.target.value)));
      },
      delete: () =>{
      },
      sum: () =>{
        // [...order]
      }
    }[type]()
  }
  const upsert = (key : Product["id"], value : Product["quantity"]) => {
    setOrder((prev) => (prev).set(key,value));
  }
  const upsertAll = (array : ProductCookie[]) => {
    array.map((o)=>{
      setOrder((prev) => new Map((prev).set(o["product_id"],o["quantity"])));
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
                  {cartList?.map((product: Product) => (
                      <CartItem key={product.id} product={product} linkOption={false} handleMap={handleMap}  />
                  ))}
                </div>

                {/* 합계 */}
                <div className="lg:w-96 md:w-8/12 w-full bg-gray-100 dark:bg-gray-900 h-full">
                  <div className="flex flex-col lg:h-screen h-auto lg:px-8 md:px-7 px-4 lg:py-20 md:py-10 py-6 justify-between overflow-y-auto">
                    <div>
                      <p className="lg:text-4xl text-3xl font-black leading-9 text-gray-800 dark:text-white">주문서</p>
                      <div className="flex items-center justify-between pt-16">
                        <p className="text-base leading-none text-gray-800 dark:text-white">총 상품가격</p>
                        <p className="text-base leading-none text-gray-800 dark:text-white">1</p>
                      </div>
                      <div className="flex items-center justify-between pt-5">
                        <p className="text-base leading-none text-gray-800 dark:text-white">할인</p>
                        <p className="text-base leading-none text-gray-800 dark:text-white"></p>
                      </div>
                      <div className="flex items-center justify-between pt-5">
                        <p className="text-base leading-none text-gray-800 dark:text-white">배송비</p>
                        <p className="text-base leading-none text-gray-800 dark:text-white"></p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center pb-6 justify-between lg:pt-5 pt-20">
                        <p className="text-2xl leading-normal text-gray-800 dark:text-white">총 주문금액</p>
                        <p className="text-2xl font-bold leading-normal text-right text-gray-800 dark:text-white">{order}</p>
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