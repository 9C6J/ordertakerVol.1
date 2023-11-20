// 구매페이지
import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { supabase } from '../../src/api/supabase';
import {
  getCookies,
  getCookie,
  setCookie,
  hasCookie,
  removeCookies,
  CookieValueTypes,
} from 'cookies-next';
import OriginalCartItem from "./src/ui/CartItem";
import OrderComponent from "./src/ui/Order";
import { CartItem as CartItemType , CartCookie, CartCookies } from "~/types/purchase";
import { Purchase } from "~/types/purchase";
import { cn, useFormFields, _getJsonCookie } from "~/utils/utils";
import Router from "next/router";
import { PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";

interface CartProps {}

function Cart({}: CartProps) {
  const PURCHASE_FORM_VALUES: Purchase = {
    // id: null;
    customer_id: "test",
    // order_at: Date;
    total_price: 0,
    address: "주소입니다",
    payment_method: "무통장",
    status: "주문요청",
    purchaser_name: "구매자이름",
    recipient_name: "수령인이름",
    purchaser_phoneNumber: "01012341234",
    recipient_phoneNumber: "01023452345",
    order_request: "요청사항입니다",
  };

  const [product, setProduct] = useState<CartItemType[]>([]);
  const [cartList, setCartList] = useState<CartItemType[]>([]);
  const [orderBtn, setOrderBtn] = useState<boolean>(false);
  const [order, setOrder] = useState<Purchase>(PURCHASE_FORM_VALUES);
  const [orderValues, handleChange, resetFormFields] = useFormFields<Purchase>(
    PURCHASE_FORM_VALUES
  );

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchAndSetProduct() {
      const cookie: CartCookies = _getJsonCookie("cart");

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
    let oOrder: Purchase = { ...order };

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
          return Object.assign({}, o, product.find((r) => o.product_id == r.id));
        })
      );
  }

  const updateCartCookie = (key: string, quantity: number) => {
    const cartCookie: CartCookies = _getJsonCookie("cart");
    let bUpdateCookie = false;

    const aUpdatedCookie = cartCookie.map((o) => {
      if (o.product_id == key) {
        o.quantity = quantity;
        bUpdateCookie = true;
      }
      return o;
    });

    bUpdateCookie && setCookie('cart', JSON.stringify(aUpdatedCookie), { maxAge: 30000 });
    onSetCartList();
  };

  const deleteFromCart = (key: string) => {
    const cartCookie: CartCookies = _getJsonCookie("cart");

    const aUpdatedCookie = cartCookie.filter((o) => o.product_id != key);
    setCookie('cart', JSON.stringify(aUpdatedCookie), { maxAge: 30000 });
    onSetCartList();
  };

  const handleOrderSubmit = async (e: FormEvent, orderValues: Purchase) => {
    e.preventDefault();

    const oOrderValues = { ...orderValues };
    oOrderValues.total_price = order.total_price;
    try {
      type OrderData = {
        id: string;
      };
      
      const { data, error }: PostgrestResponse<OrderData> = await supabase.from('order').insert(oOrderValues).select('id');

      if (error) {
        console.error('Error inserting order:', error);
        return;
      }
      const orderId = data?.[0]?.id;

      await Promise.all(
        cartList.map(async (oRow) => {
          await supabase.from('orderDetail').insert({
            size: null,
            price: oRow.price,
            title: oRow.title,
            order_id: orderId,
            product_id: oRow.id,
            quantity: oRow.quantity,
          });
        })
      );

      alert("주문이 정상적으로 접수되었습니다.");
      Router.push(`/`);
      setCookie('cart', []);
    } catch (err) {
      console.error("Error creating order or order details:", err);
    }
  };

  const handleMap = (e: ChangeEvent<HTMLInputElement>, type: string, key: string) => {
    const handlers: Record<string, () => void> = {
      update: () => {updateCartCookie(key, Number(e))},
      delete: () => deleteFromCart(key),
      detail: () => Router.push(`/product/${key}`),
      order: () => {
        const btnOrderSubmit = document.querySelector<HTMLButtonElement>('#btnOrderSubmit');
        // btnOrderSubmit?.dispatchEvent(new Event('click'));
        btnOrderSubmit?.click();
      },
      orderSubmit: () =>{ handleOrderSubmit(e, orderValues)},
    };

    handlers[type]();
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
                      onClick={(e:any) => {
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