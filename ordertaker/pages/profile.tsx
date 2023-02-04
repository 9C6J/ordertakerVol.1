import { useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useAuth } from "../lib/auth";
import Router from "next/router";
import { supabase } from './api/supabase';
import { User } from "@supabase/supabase-js";


export type NextAppPageUserProps = {
  props: {
    user: User;
    loggedIn: boolean;
  };
};

export type NextAppPageRedirProps = {
  redirect: {
    destination: string;
    permanent: boolean;
  };
};

export type NextAppPageServerSideProps =
  | NextAppPageUserProps
  | NextAppPageRedirProps;

// export const getServerSideProps: GetServerSideProps = async ({
//   req,
// }): Promise<NextAppPageServerSideProps> => {
//   // const { user } = await supabase.auth.api);
//   // const { user } = supabase.auth.getSession();

//   const refreshToken = req.cookies['my-refresh-token']
//   const accessToken = req.cookies['my-access-token']

//   if (refreshToken && accessToken) {
//     await supabase.auth.setSession({
//       refresh_token: refreshToken,
//       access_token: accessToken,
//     })
//   } else {
//     // make sure you handle this case!
//     throw new Error('User is not authenticated.')
//   }

//   // returns user information
//   const { data, error } = await supabase.auth.getUser();

//   if (!data) {
//     return {
//       redirect: {
//         destination: "/auth",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       user,
//       loggedIn: !!user,
//     },
//   };
// };

const ProfilePage = ({  }) => {

  const { user, signOut, userLoading, loggedIn } = useAuth();
  
  // const { signOut } = useAuth();

  // 클라이언트 사이드에서 useEffect로 유저가 로그인됐는지 체크해서 아니면 바로 "/auth" 라우팅으로 보내버리게 됩니다.
  // 클라이언트 사이드에서의 useEffect 방식은 useEffect가 실행될 때까지 기존 UI가 아주 잠깐 보인다는 단점이 있습니다.
  // useEffect(() => {
  //   if (!userLoading && !loggedIn) {
  //     Router.push("/auth");
  //   }
  // }, [userLoading, loggedIn]);



  // if (loading) {
  //   return <div>Loading...</div>;
  // }

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
            className="border bg-gray-500 border-gray-600 text-white px-3 py-2 rounded w-full text-center transition duration-150 shadow-lg"
            onClick={signOut}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
