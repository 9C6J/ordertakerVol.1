import { getCookie } from 'cookies-next';
import { useState } from 'react'

export function useFormFields<T>(
    initialValues: T
): [T, (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void, () => void] {
    const [values, setValues] = useState<T>(initialValues);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        event.persist();
        const { target  } = event;
        let { name, value } = target;

        // if(target?.type  === "number"){
        //     setValues({ ...values, [name]: Number(value) });
        // }else{
            setValues({ ...values, [name]: value });
        // }
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

export function _getJsonCookie(key : string){
    const cookie = getCookie(key);
    
    if(typeof cookie === "string"){
        return JSON.parse(cookie);
    }else{
        return []
    }

}

export function _isNotNumber(value : string){
    const regExp = /[a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;

    return regExp.test(value);
}


// 파일 이름에 한글이 포함되어 있는지 확인
export const checkFileForKorean = (fileName: string): boolean => {
    const CheckRegExpKorean: RegExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return CheckRegExpKorean.test(fileName);
  };

  
export const toParsingLocalDate : Function = (date: string) => {
    return new Date(date).toLocaleString();
  }