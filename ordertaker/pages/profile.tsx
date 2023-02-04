import { useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useAuth } from "../lib/auth";
import Router from "next/router";
import { supabase } from './api/supabase';
import { User } from "@supabase/supabase-js";


const ProfilePage = ({ user }) => {
  const { signOut } = useAuth();

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

  return (
    <div className="flex flex-col items-center justify-start py-36 min-h-screen">
      <h2 className="text-4xl my-4">
        Hello, {user && user.email ? user.email : "Supabase User!"}
      </h2>
      {!user && (
        <div>
          You have landed on a protected page.
          <br />
          Please{"  "}
          <Link href="/auth" className="font-bold text-blue-500">
            Log In
          </Link>{" "}
          to view the page's full content.
        </div>
      )}
      {user && ( 
        <div>
          <button
            className="border bg-gray-500 border-gray-600 text-white px-3 py-2 rounded w-full text-center transition duration-150 shadow-lg"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

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

export const getServerSideProps: GetServerSideProps = async ({
  req,
}): Promise<NextAppPageServerSideProps> => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
      loggedIn: !!user,
    },
  };
};
