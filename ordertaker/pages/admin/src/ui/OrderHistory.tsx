import React, { useEffect, useState } from 'react';
import { supabase } from '~/api/supabase';
import { PurchaseHistory, OrderDetail } from "~/types/purchase";
import { Product } from '~/types/product';
import { toParsingLocalDate } from '~/utils/utils';
import { CartItem as CartItemType } from "~/types/purchase";
import HistoryDetail from './HistoryDetail';

// Order 컴포넌트
const Order: React.FC<{ order: PurchaseHistory }> = ({ order }) => {
  const [orderDetail, setOrderDetail] = useState<any[]>();

  useEffect(() => {
  async function fetchAndSetOrderDetail() {
    try {
      // const aProductId: Array<string> = ['13','14'];
      const aProductId: Array<number> = order?.orderDetail.map((o: { product_id: number; }) => o.product_id);
      const { data, error } = await supabase.from("product")
        .select()
        .in('id', aProductId);


      if (error) {
        console.error("상품 데이터 가져오기 오류:", error);
        return;
      }

      const updatedOrderDetail = order?.orderDetail.map((orderDetail: { product_id: number; }) => ({
        ...orderDetail,
        imageSrc: data.find(productItem => productItem.id === orderDetail.product_id)?.imageSrc || ''
      }));

      setOrderDetail(updatedOrderDetail);

    } catch (error) {
      console.error(error);
    }
  }

  fetchAndSetOrderDetail();
}, [order]);

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{toParsingLocalDate(order.order_at)}</h2>

                {orderDetail?.map((product: CartItemType, idx) => (
                  <HistoryDetail key={idx} product={product} />
                ))}
                {/* <p className="mb-2">주문 번호: {order.id}</p> */}
                {/* <p className="mb-2">주문 일시: {order.order_at?.toLocaleString()}</p> */}
                {/* <p className="mb-2">결제 방법: {order.payment_method}</p> */}
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">총 주문 금액: {(order.total_price)?.toLocaleString()} 원</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">구매자 이름: {order.purchaser_name || 'N/A'}</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">구매자 연락처: {order.purchaser_phoneNumber || 'N/A'}</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">배송 주소: {order.address}</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">배송 요청 사항: {order.order_request || 'N/A'}</p>


                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">{order.purchaser_name || 'N/A'} / {order.purchaser_phoneNumber || 'N/A'} / {order.address} / {order.order_request || 'N/A'} / {(order.total_price)?.toLocaleString()} 원</p>

            </div>
      </div>
    );
  };
  
export default Order;