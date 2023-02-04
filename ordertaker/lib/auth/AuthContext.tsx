import { createContext, FunctionComponent, useEffect, useState } from "react";
import { supabase } from "../../pages/api/supabase";
import { AuthUser } from "@supabase/supabase-js";
import { useMessage, MessageProps } from "../message";
import { SupabaseAuthPayload } from "./auth.types";

import Router from "next/router";


export type AuthContextProps = {
  user : AuthUser;
  signUp : (payload: SupabaseAuthPayload) => void;
  signIn : (payload: SupabaseAuthPayload) => void;
  signOut : () => void | any;
  loading : boolean;
  loggedIn : boolean;
  userLoading : boolean;
};

type ContainerProps = {
  children: React.ReactNode; //👈 children prop typr
};

// Partial : {} 로 초기화가능
// export const AuthContext = createContext<AuthContextProps | null>(null) 
export const AuthContext = createContext<Partial<AuthContextProps>>({});
// √const AuthContext = React.createContext<AuthContextProps | null>(nu;l)
//  as React.Context<AuthContextProps>;

export const AuthProvider = (props : ContainerProps ) => {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthUser>();
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const { handleMessage } = useMessage();

  // sign-up a user with provided details
  const signUp = async (payload : SupabaseAuthPayload) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp(payload);

      if(error){
        console.log(error);
        handleMessage?.( { message: error.message, type : "error"} );
      }else{
        handleMessage?.({
          message : "인증 메일을 전송하였습니다. 해당 이메일 계정의 편지함을 확인해주세요.",
          type : "success"
        })
      }
    } catch (error : any) {
      console.log(error);
      handleMessage?.({
        message: error.error_description || error,
        type: "error",
      })
    } finally {
      setLoading(false);
    }
  };

  // sign-in a user with provided details
  // signIn -> signInWithPassword
  const signIn = async (payload: SupabaseAuthPayload) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword(payload);
      if (error) {
        console.log("로그인에실패하였습니다 : ",error);
        handleMessage?.({ message: "로그인에 실패하였습니다 비밀번호를 확인해주세요.", type: "error" });
      } else {
        console.log("로그인성공 success : "+data?.user?.email+" error :"+error);
        handleMessage?.({
          message: "로그인에 성공하였습니다.",
          type: "success",
        });
        handleMessage?.({
          message : `환영합니다. ${data?.user?.email}`,
          type : "success"
        });
      }
    } catch (error : any) {
      console.log("catch error =>",error);
      handleMessage?.({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async() => await supabase.auth.signOut();

  useEffect(() => {
    
    const user =  supabase.auth.getUser().then((response)=>{
      console.log("====useEffect :",event);
      
      if (response.data.user) {
        setUser(response.data.user);
        setUserLoading(false);
        setLoggedIn(true);
      }else{
        setUserLoading(false);
        Router.push("/auth");
      }
    })
    .catch((err)=>{
      console.error(err);
    })
    .finally(()=>{
      setUserLoading(false);
    });


    // 로그인한 유저의 액션에 따라서 페이지를 달리 보여줘야 하기 때문에 유저의 액션 상태를 항상 체크해야 하는 뭔가가 있어야 합니다.
    const { data : authListener} = supabase.auth.onAuthStateChange(
      async(event, session) => {
        // event : 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'PASSWORD_RECOVERY'
        console.log("====authStateChange :",event);

        const user = session?.user! ?? null;
        console.log("====session :",session);
        setUserLoading(false);

        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          // delete cookies on sign out
          const expires = new Date(0).toUTCString()
          document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`
          document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`
          setUser(undefined);
          setLoading(false);
          setLoggedIn(false);
          Router.push("/auth");
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
          document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
          document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
          setUser(user);
          setLoggedIn(true);
          Router.push("/");
        }

        return () => {
          authListener.subscription.unsubscribe();
        };
      }
    )
    
    
  },[]);
  
  return (
    <AuthContext.Provider
      value={
        {
        user,
        signUp,
        signIn,
        signOut,
        loading,
        loggedIn,
        userLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};