import React, { forwardRef, useEffect } from "react";
import { useFormFields } from "../lib/utils";
import BlurImage from "./BlurImage";

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

// function Input(props, ref) {
//   return <input type="text" ref={ref} />;
// }

// Input = forwardRef(Input);

export default React.forwardRef((
  props : {
    orderValues : PurchaseOrder
    handleMap? : any
    handleChange? : any
  },
  ref : any  
) => {

  const handleSumbit = (event: React.FormEvent) => {
    event.preventDefault();
    debugger;
  };

  return (
    // 여기까지 a태그
    <div className="w-full h-full">
      <p className="lg:text-4xl text-3xl font-black leading-10 text-gray-800 dark:text-white pt-3">주문</p>

      <form
        className="  px-8 pt-6 pb-8 mb-4"
      >
        <div className="">
            <button
              className="hidden"
              type="submit"
              onClick={(e)=> props.handleMap(e,'orderSubmit',props.orderValues)}
              id="btnOrderSubmit"
            >
              변경
            </button>

          {/* 주문정보 */}
          <div >
            {/* 구매자이름 */}
            <p className="lg:text-2xl text-2xl font-black leading-10 text-gray-800 dark:text-white pt-3 mb-4">구매자정보</p>
            <div ref={ref} className="md:flex md:items-center mb-6">
              <div className="lg:w-2/12 md:w-3/12">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                  구매자이름 :
                </label>
              </div>
              <div className="lg:w-10/12 md:w-9/12">
                <input
                  // className="shadow appearance-none border border-red-500 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="purchaser_name"
                  name="purchaser_name"
                  type="text"
                  placeholder=""
                  required
                  value={props.orderValues.purchaser_name}
                  onChange={props.handleChange}
                />
              </div>                          
            </div>

            {/* 구매자연락처 */}
            <div className="md:flex md:items-center mb-6">
              <div className="lg:w-2/12 md:w-3/12">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                  구매자연락처 :
                </label>
              </div>
              <div className="lg:w-10/12 md:w-9/12">
                <input
                  // className="shadow appearance-none border border-red-500 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="purchaser_phoneNumber"
                  name="purchaser_phoneNumber"
                  type="text"
                  placeholder=""
                  required
                  value={props.orderValues.purchaser_phoneNumber}
                  onChange={props.handleChange}
                />
              </div>                          
            </div>
            <p className="lg:text-2xl text-2xl font-black leading-10 text-gray-800 dark:text-white pt-3 mb-4">수령인정보</p>
    
            {/* 수령인이름 */}
            <div className="md:flex md:items-center mb-6">
              <div className="lg:w-2/12 md:w-3/12">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                  수령인이름 :
                </label>
              </div>
              <div className="lg:w-10/12 md:w-9/12">
                <input
                  // className="shadow appearance-none border border-red-500 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="recipient_name"
                  name="recipient_name"
                  type="text"
                  placeholder=""
                  required
                  value={props.orderValues.recipient_name}
                  onChange={props.handleChange}
                />
              </div>                          
            </div>
    
            {/* 받을주소 */}
            <div className="md:flex md:items-center mb-6">
              <div className="lg:w-2/12 md:w-3/12">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                  주소 :
                </label>
              </div>
              <div className="lg:w-10/12 md:w-9/12">
                <input
                  // className="shadow appearance-none border border-red-500 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="address"
                  name="address"
                  type="text"
                  placeholder=""
                  required
                  value={props.orderValues.address}
                  onChange={props.handleChange}
                />
              </div>                          
            </div>
    
            {/* 수령인연락처 */}
            <div className="md:flex md:items-center mb-6">
              <div className="lg:w-2/12 md:w-3/12">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                  수령인연락처 :
                </label>
              </div>
              <div className="lg:w-10/12 md:w-9/12">
                <input
                  // className="shadow appearance-none border border-red-500 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="recipient_phoneNumber"
                  name="recipient_phoneNumber"
                  type="text"
                  placeholder=""
                  required
                  value={props.orderValues.recipient_phoneNumber}
                  onChange={props.handleChange}
                />
              </div>                          
            </div>
    
            {/* 배송요청사항 */}
            <div className="md:flex md:items-center mb-6">
              <div className="lg:w-2/12 md:w-3/12">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                  배송요청사항 :
                </label>
              </div>
              <div className="lg:w-10/12 md:w-9/12">
                <input
                  // className="shadow appearance-none border border-red-500 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="order_request"
                  name="order_request"
                  type="text"
                  placeholder="현관문 비밀번호 ( #0000* ) "
                  required
                  value={props.orderValues.order_request}
                  onChange={props.handleChange}
                />
              </div>                          
            </div>
          </div>
          
        </div>
      </form>
      
    </div>
  )
});


