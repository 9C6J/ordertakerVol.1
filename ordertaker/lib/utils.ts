import { useState } from 'react'

export function useFormFields<T>(
    initialValues: T
): [T, (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void, () => void] {
    const [values, setValues] = useState<T>(initialValues);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        event.persist();
        const { target } = event;
        const { name, value } = target;
        setValues({ ...values, [name]: value });
    }
    const resetFormFields = () => setValues(initialValues);
    return [values, handleChange, resetFormFields];
}

/**
 * 배열 안에 존재할 수 있는 falsy한 값들을 제거하여 배열을 믿을 수 있는 상태로 만들기 위해 사용
 * 참고: https://velog.io/@yongbum/filter-boolean
 * Boolean을 iterator 로 사용하여 false, 0, -0, 0n, "", null, undefined, NaN를 제거할 수 있다.
 * 위에 값들이 그대로 존재해야하는 data에는 사용하지않게 유의해야할듯.
*/
export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

//  Signup 같은 API 콜 관련 서버사이드 로직을 호출할 때 나올 수 있는 메시지를 핸들링할 수 있는 유틸리티 함수

// export type MessageType = "default" | "success" | "error";

// export type MessageProps = {
//     type: MessageType;
//     payload: string;
// };

// export function useMessage<MessageProps>(initialValues: MessageProps): [MessageProps, (mes: MessageProps) => void] {
//     const [message, setMessage] = useState<MessageProps>(initialValues);

//     const handleMessage = (mes: MessageProps) => setMessage(mes);
//     return [message, handleMessage];

// }