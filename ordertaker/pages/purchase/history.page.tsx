// 주문내역페이지
// 주문자명과 휴대폰번호 입력 후 조회하시면 주문 내역을 확인 할 수 있습니다.
import React, { useState } from "react";

import classNames from "classnames";
import { useFormFields } from "~/utils/utils";
import { useMessage } from "~/common/message";
import { HistoryFormFieldProps } from "~/types/auth";
import { supabase } from "~/api/supabase";
import OrderHistory from "./src/ui/OrderHistory";

import {PurchaseHistory} from "~/types/purchase";

const FORM_VALUES: HistoryFormFieldProps = {
  purchaser_name: "구매자이름",
  purchaser_phoneNumber: "01012341234",
};

const History: React.FC = (props) => {
  const [values, handleChange, resetFormFields] = useFormFields<HistoryFormFieldProps>(FORM_VALUES);
  const { messages, handleMessage } = useMessage();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PurchaseHistory[]>();
  const [isHistory, setIsHistory] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    const { data, error } = await supabase
    .from('order')
    .select(`
      *,
      orderDetail:orderDetail(*)
    `)
    .eq('purchaser_name', values.purchaser_name)
    .eq('purchaser_phoneNumber', values.purchaser_phoneNumber);
    
    setLoading(false);

    if(!data?.length){
      handleMessage?.({
        message : "주문내역이 없습니다. 다시 확인해주세요.",
        type : "error"
      })
    }else{
      setIsHistory(true);
      setHistory(data);
      debugger;
    }
    console.log(data);

  };

  return (
    <div className="container px-5 py-10 mx-auto w-3/5">
      <div className="w-full text-center mb-4 flex flex-col place-items-center">
        {/* {isHistory ? <BsList className="w-6 h-6" /> : <BsList className="w-6 h-6" />} */}
        <h1 className="text-2xl md:text-4xl text-gray-700 font-semibold">
          {isHistory ? "조회내역" : "주문조회"}
        </h1>
      </div>
      {messages &&
        messages.map((message, index) => (
          <div
            key={index}
            className={classNames(
              "shadow-md rounded px-3 py-2 text-shadow transition-all mt-2 text-center",
              message.type === "error" ? "bg-red-500 text-white" : message.type === "success" ? "bg-green-300 text-gray-800" : "bg-gray-100 text-gray-800"
            )}
          >
            {message?.message}
          </div>
        ))}
      {
       isHistory ? 
        history?.map((order,idx) => (
          <OrderHistory key={order.id} order={order} />
        ))
       : 
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchaser_name">
            구매자이름
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="purchaser_name"
            name="purchaser_name"
            type="string"
            placeholder="구매자이름"
            required
            value={values.purchaser_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchaser_phoneNumber">
            구매자연락처
          </label>
          <input
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="purchaser_phoneNumber"
            name="purchaser_phoneNumber"
            type="tel"
            placeholder="'-'를 제외한 숫자만 입력해주세요"
            required
            value={values.purchaser_phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            주문조회
          </button>
        </div>
        </form>
      }
      {loading && (
        <div className="shadow-md rounded px-3 py-2 text-shadow transition-all mt-2 text-center">Loading...</div>
      )}
    </div>
  );
};

export default History;