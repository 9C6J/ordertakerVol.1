import React, { useState, useEffect, useRef } from "react";
import { supabase } from '../../src/api/supabase';
import {
  getCookies,
  getCookie,
  setCookie,
  hasCookie,
  removeCookies,
  CookieValueTypes,
} from 'cookies-next';
import OriginalCartItem from "./src/ui/CartItem"; // 이름 변경
import OrderComponent from "./src/ui/Order"; // 이름 변경
import { CartItem as CartItemType } from "~/types/cart";
import { PurchaseOrder } from "~/types/order";
import { cn, useFormFields, _getJsonCookie } from "~/utils/utils";
import Router from "next/router";

function Cart() {

  const PURCHASE_FORM_VALUES: PurchaseOrder = {
    // id: string;
    customer_id: "test"
    // order_at: Date;
    ,total_price: 0 // 주문총금액
    ,address: "주소입니다"    // 받을주소
    ,payment_method: "무통장" // 주문방법
    ,status: "주문요청" // 주문상태     주문요청 주문확인 배송중 배송완료
    ,purchaser_name : "구매자이름" // 구매자이름
    ,recipient_name : "수령인이름" // 수령인이름
    ,purchaser_phoneNumber : "01012341234" // 구매자연락처
    ,recipient_phoneNumber : "01023452345" // 수령인연락처
    ,order_request : "요청사항입니다" // 배송요청사항
  };
  const [product, setProduct] = useState<CartItemType[]>([]);
  const [cartList, setCartList] = useState<CartItemType[]>([]);
  const [orderBtn, setOrderBtn] = useState(false);
  const [order, setOrder] = useState<PurchaseOrder>(PURCHASE_FORM_VALUES);
  const [orderValues, handleChange, resetFormFields] = useFormFields<PurchaseOrder>(
    PURCHASE_FORM_VALUES
  );

  const ref = useRef();

  useEffect(() => {
    async function fetchAndSetProduct() {
      const cookie = _getJsonCookie("cart");

      if (cookie.length) {
        const aProductId: Array<string> = [...cookie].map((o) => o.product_id);
        const { data, error } = await supabase.from("product")
          .select()
          .in('id', aProductId);

        error && console.error("error=>", error);
        data && setProduct(data);
      }
    }
    fetchAndSetProduct();
  }, []);

  useEffect(() => {
    onSetCartList();
  }, [product]);

  useEffect(() => {
    let sum = 0;
    let oOrder = { ...order };

    // 총주문금액
    cartList.forEach((o) => {
      sum += o.quantity * o.price;
    });
    oOrder.total_price = sum;
    setOrder(oOrder);
  }, [cartList]);

  function onSetCartList() {
    const cookie = _getJsonCookie("cart");

    product &&
      setCartList(
        cookie.map((o: { product_id: number }) => {
          return Object.assign({}, o, product.filter((r) => o.product_id == r.id)[0]);
        })
      );
  }

  const handleMap = (
    e: any,
    type: 'update' | 'delete' | 'detail' | 'order' | 'orderSubmit',
    key: string
  ) => {
    const handler = {
      update: (sTargetValue: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const cartCookie = _getJsonCookie("cart");
        let bUpdateCookie: boolean = false;

        const aUpdatedCookie = cartCookie.map((o: any) => {
          if (o.product_id == key) {
            o.quantity = sTargetValue;
            bUpdateCookie = true;
          }
          return o;
        });

        bUpdateCookie && setCookie('cart', JSON.stringify(aUpdatedCookie), { maxAge: 30000 });

        onSetCartList();
      },
      delete: (e: any, key: any) => {
        const cartCookie = _getJsonCookie("cart");
        let bUpdateCookie: boolean = false;

        const aUpdatedCookie = cartCookie.filter((o: any) => {
          if (o.product_id != key) {
            return o;
          }
        });

        setCookie('cart', JSON.stringify(aUpdatedCookie), { maxAge: 30000 });
        onSetCartList();
      },
      detail: (e: any, key: string) => {
        Router.push(`/product/${key}`);
      },
      order: (e: any, orderValues: PurchaseOrder) => {
        const btnOrderSubmit: HTMLButtonElement | null = document.querySelector('#btnOrderSubmit');
        btnOrderSubmit?.click();
      },
      orderSubmit: async (e: any, orderValues: PurchaseOrder) => {
        e.preventDefault();

        const oOrderValues = { ...orderValues };
        oOrderValues.total_price = order.total_price;

        // 주문서등록
        const { data, error: errOrder } = await supabase.from('order').insert(oOrderValues).select();
        if (errOrder) {
          console.log(errOrder);
          return;
        } else {
          const orderId = data[0].id;

          const oOrderDetailValue = cartList.map(async (oRow) => {
            // 주문상세등록
            const { error: errOrderDetail } = await supabase.from('orderDetail').insert({
              "size": null,
              "price": oRow.price,
              "order_id": orderId,
              "product_id": oRow.id,
              "quantity": oRow.quantity
            });

            if (errOrderDetail) {
              console.log(errOrderDetail);
              return;
            } else {
              console.log("success create orderDetail");
              alert("주문이 정상적으로 접수되었습니다.");
              Router.push(`/`);
              setCookie('cart', []);
            }
          });
        }
      },
    }[type](e, key);
  };

  const onHomeClick = () => {
    setOrderBtn(true);
  };

  return (
    <div className="top-0 sticky-0" id="chec-div">
      <div className="container px-5 py-0 mx-auto w-2/3">
        <div className="w-full absolute z-10 right-0  ">
          <div className="flex items-end lg:flex-row flex-col justify-end" id="cart">
            {/* 장바구니리스트 */}
            <div className="lg:w-3/5 w-full h-auto lg:px-8 lg:py-14 md:px-6 px-4 md:py-8 py-4 bg-white dark:bg-gray-800 overflow-y-hidden overflow-x-hidden  " id="scroll">
              {/*  */}
              <p className="lg:text-4xl text-3xl font-black leading-10 text-gray-800 dark:text-white pt-3">장바구니</p>
              {cartList.length ? (
                cartList.map((product: CartItemType, idx) => (
                  <OriginalCartItem key={idx} product={product} linkOption={false} handleMap={handleMap} />
                ))
              ) : (
                <p> 담긴 상품이 없습니다. </p>
              )}

              {cartList.length && orderBtn ? <OrderComponent ref={ref} orderValues={orderValues} handleChange={handleChange} handleMap={handleMap} /> : <></>}
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
                    <p className="text-2xl font-bold leading-normal text-right text-gray-800 dark:text-white">
                      {(order.total_price)?.toLocaleString()} 원
                    </p>
                  </div>
                  {cartList.length ? (
                    <button
                      className={cn(
                        `text-base leading-none w-full py-5 border focus:outline-none 
                              focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white 
                              dark:hover:bg-gray-700 rounded transition duration-300`,
                        orderBtn
                          ? 'bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800'
                          : 'bg-gray-800 border-gray-800'
                      )}
                      onClick={(e) => {
                        !orderBtn ? onHomeClick() : handleMap(e, 'order', '');
                      }}
                    >
                      {orderBtn ? '주문하기' : '주문서작성하기'}
                    </button>
                  ) : (
                    <button
                      className="text-base leading-none w-full py-5 bg-gray-800 border-gray-800 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white dark:hover:bg-gray-700"
                      onClick={(e) => {
                        Router.push(`/product`);
                      }}
                    >
                      상품구경하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
