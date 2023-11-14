// 로그인용
export type FormFieldProps = {
    email: string;
    password: string;
  };

// 계정복구용
export type RecoveryFormFieldProps = {
    email: string;
  };

// 주문조회
export type OrderInquiryFormFieldProps = {
    purchaser_name: string,
    purchaser_phoneNumber: string,
  };
