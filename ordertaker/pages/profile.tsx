import React, { useEffect, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useAuth } from "../lib/auth";
import Router from "next/router";
import { supabase } from './api/supabase';
import { User } from "@supabase/supabase-js";

import classNames from "classnames";
import { useFormFields } from "../lib/utils";
import { useMessage } from "../lib/message";


// Server Side 보안
// export type NextAppPageUserProps = {
//   props: {
//     user: User | null;
//     loggedIn: boolean;
//   };
// };

// export type NextAppPageRedirProps = {
//   redirect: {
//     destination: string;
//     permanent: boolean;
//   };
// };

// export type NextAppPageServerSideProps =
//   | NextAppPageUserProps
//   | NextAppPageRedirProps
//   | any;

// export const getServerSideProps: GetServerSideProps = async ({
//   req,
// }): Promise<NextAppPageServerSideProps> => {
//   // const { user } = await supabase.auth.api);
//   // const { user } = supabase.auth.getSession();

//   // returns user information
//   // const { data, error } = await supabase.auth.getUser();
//   // const { data: { user } } = await supabase.auth.getUser();

//   const { data} =  supabase.auth.getUser().then((response)=>{

//     return {
//       props: {
//         user: response.data.user,
//         loggedIn: !!user
//       }
//     };
//     // return response;
//   })
//   .catch((err)=>{
//     console.error(err);
//   })
//   .finally(()=>{
//   });

//   if (!user) {
//     return {
//       redirect: {
//         destination: "/auth",
//         permanent: false,
//       },
//     };
//   }

// };

type FormFieldProps = {
  updatePassword1: string;
  updatePassword2: string;
}

const FORM_VALUES: FormFieldProps = {
  updatePassword1: "",
  updatePassword2: "",
}
const ProfilePage = ({  }) => {

  // Client Side 보안
  const { user, signOut,loading, userLoading, loggedIn
  , updatePassword } = useAuth();

  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [values, handleChange, resetFormFields] = useFormFields<FormFieldProps>(FORM_VALUES);
  const { messages, handleMessage } = useMessage();

  // 클라이언트 사이드에서 useEffect로 유저가 로그인됐는지 체크해서 아니면 바로 "/auth" 라우팅으로 보내버리게 됩니다.
  // 클라이언트 사이드에서의 useEffect 방식은 useEffect가 실행될 때까지 기존 UI가 아주 잠깐 보인다는 단점이 있습니다.
  useEffect(() => {
    if (!userLoading && !loggedIn) {
      Router.push("/auth");
    }
  }, [userLoading, loggedIn]);
  if (loading) {
    return <div>Loading...</div>;
  }

  // Server Side 보안
  // const { signOut } = useAuth();

  // 비밀번호변경
  const handleSumbit = (event: React.FormEvent) => {
    event.preventDefault();
    if(values.updatePassword1 !== values.updatePassword2){
      resetFormFields();
      handleMessage?.({ message: "변경할 비밀번호가 일치하지 않습니다.", type:"error"});
    }else{
      updatePassword?.({ password: values.updatePassword1});
      resetFormFields();
      signOut?.();
    }
  }

  function alterPassword(){
    setChangePassword(!changePassword);
  }

  const toParsingLocalDate : Function = (date: string) => {
    return new Date(date).toLocaleString();
  }

  return (
    <div className="flex flex-col items-center justify-start py-36 min-h-screen">
      <h2 className="text-4xl my-4">
        마이페이지 <br />
      </h2>
      {!user && (
        <div>
          사용자 정보가 없습니다.
          <br />
          {/* Please{"  "} */}
          <Link href="/auth" className="font-bold text-blue-500">
            로그인
          </Link>{" "}
          후 이용해주세요
        </div>
      )}
      {user && ( 
        <div>
          이메일 : {user && user.email ? user.email : ""}<br />
          권한 : {user && user.role ? user.role : ""}<br />
          가입일자 : {user && user.created_at ? toParsingLocalDate(user.created_at) : ""}<br />
          이메일인증시간 : {user && user.email_confirmed_at ? toParsingLocalDate(user.email_confirmed_at) : "미인증"}<br />
          휴대폰인증시간 : {user && user.phone_confirmed_at ? toParsingLocalDate(user.phone_confirmed_at) : "미인증"}<br />
          최근로그인시간 : {user && user.last_sign_in_at ? toParsingLocalDate(user.last_sign_in_at) : ""}<br />
          최근변경일 : {user && user.updated_at ? toParsingLocalDate(user.updated_at) : ""}<br />
          <button
            className="border bg-gray-500 border-gray-600 text-white px-3 py-2 rounded text-center transition duration-150 shadow-lg"
            onClick={signOut}
          >
            로그아웃
          </button>
          <div>or</div>
          <button
            className="border bg-cyan-500 border-cyan-600 text-white px-3 py-2 rounded text-center transition duration-150 shadow-lg"
            onClick={alterPassword}
          >
            비밀번호변경
          </button>
        </div>
      )}
      {/* 메시지가 있을때 */}
      {messages && 
        messages.map((message, index) => (
          <div
            className={classNames(
              "shadow-md rounded px-3 py-2 text-shadow transition-all mt-2 text-center",
              message.type === "error"
                ? "bg-red-500 text-white"
                : message.type === "success"
                ? "bg-green-300 text-gray-800"
                : "bg-gray-100 text-gray-800"
            )}
          >
            {message.message}
          </div>
        ))}

      {/* 비밀번호변경을 눌렀을때 */}
      {changePassword && (
        <form
          onSubmit={handleSumbit}
          className="bg-white shadow-md rounded w-1/2 mt-4 px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              비밀번호 변경
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="updatePassword1"
              name="updatePassword1"
              type="password"
              placeholder="New password"
              required
              value={values.updatePassword1}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              비밀번호 변경확인
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="updatePassword2"
              name="updatePassword2"
              type="password"
              placeholder="Repeat password"
              required
              value={values.updatePassword2}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              변경
            </button>
          </div>
        </form>
      )}

      
    </div>
  );
};

export default ProfilePage;
