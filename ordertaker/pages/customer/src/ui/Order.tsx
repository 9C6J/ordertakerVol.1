import OrderDetailItem from '../ui/OrderDetailItem';
import React, { useEffect, useState } from 'react';
import { supabase } from '~/api/supabase';
import { PurchaseOrder } from "~/types/order";
import { Product } from '~/types/product';
import { toParsingLocalDate } from '~/utils/utils';
import { CartItem as CartItemType } from "~/types/cart";

// Order 컴포넌트
const Order: React.FC<{ order: PurchaseOrder }> = ({ order }) => {
  const [orderDetail, setOrderDetail] = useState<Product[]>([]);

  useEffect(() => {
  async function fetchAndSetOrderDetail() {
    try {
      // const aProductId: Array<string> = ['13','14'];
      const aProductId: Array<string> = order?.orderDetail.map((o: { product_id: string; }) => o.product_id);
      const { data, error } = await supabase.from("product")
        .select()
        .in('id', aProductId);


      if (error) {
        console.error("상품 데이터 가져오기 오류:", error);
        return;
      }

      const updatedOrderDetail = order?.orderDetail.map((orderDetail: { product_id: any; }) => ({
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

                {orderDetail.map((product: CartItemType, idx) => (
                  <OrderDetailItem key={idx} product={product} />
                ))}
                {/* <p className="mb-2">주문 번호: {order.id}</p> */}
                {/* <p className="mb-2">주문 일시: {order.order_at?.toLocaleString()}</p> */}
                {/* <p className="mb-2">결제 방법: {order.payment_method}</p> */}
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">총 주문 금액: {(order.total_price)?.toLocaleString()} 원</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">구매자 이름: {order.purchaser_name || 'N/A'}</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">구매자 연락처: {order.purchaser_phoneNumber || 'N/A'}</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">수령인 이름: {order.recipient_name || 'N/A'}</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">수령인 연락처: {order.recipient_phoneNumber || 'N/A'}</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">배송 주소: {order.address}</p>
                <p className="text-xs leading-3 text-gray-600 dark:text-white pt-2">배송 요청 사항: {order.order_request || 'N/A'}</p>
            </div>
      </div>
    );
  };
  

export default Order;