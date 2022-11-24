import { useState } from 'react'

export function useFormFields<T>(
    initialValues: T
): [T, (event: React.ChangeEvent<HTMLInputElement>) => void, () => void] {
    const [values, setValues] = useState<T>(initialValues);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const { target } = event;
        const { name, value } = target;
        setValues({ ...values, [name]: value });
    }
    const resetFormFields = () => setValues(initialValues);
    return [values, handleChange, resetFormFields];
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