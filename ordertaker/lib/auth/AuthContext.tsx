import { createContext, FunctionComponent, useEffect, useState } from "react";
import { supabase } from "../../pages/api/supabase";
import { AuthUser, AuthChangeEvent,Session} from "@supabase/supabase-js";
import { useMessage, MessageProps } from "../message";
import { SupabaseAuthPayload, SupabaseChangePasswordPayload, SupabaseRecoveryPasswordPayload } from "./auth.types";

import Router from "next/router";

export type AuthContextProps = {
  user : AuthUser; // 유저객체
  signUp : (payload: SupabaseAuthPayload) => void; // 회원가입
  signIn : (payload: SupabaseAuthPayload) => void; // 로그인
  signOut : () => void | any; // 로그아웃
  loading : boolean;
  loggedIn : boolean; // 로그인여부
  userLoading : boolean;
  updatePassword : (payload: SupabaseChangePasswordPayload) => void; // 비밀번호변경
  recoveryPassword : (payload: SupabaseRecoveryPasswordPayload) => void; // 비밀번호복구
};
/storage/v1/object/public/images/public/chajae1.png
type ContainerProps = {
  children: React.ReactNode; //👈 children prop typr
};

// Partial : {} 로 초기화가능
export const AuthContext = createContext<Partial<AuthContextProps>>({});
export const AuthProvider = (props : ContainerProps ) => {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthUser>();
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const { handleMessage } = useMessage();

  // 회원가입
  const signUp = async (payload : SupabaseAuthPayload) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp(payload);
      
      if(error){
        console.log(error);
        error.status === 422 ? handleMessage?.( { message: "비밀번호는 6자리 이상으로 지정해주세요.", type : "error"} ) :
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

  // signIn -> signInWithPassword  supabase 버전업
  // 로그인
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

        Router.push("/");
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

  //로그아웃
  const signOut = async() => await supabase.auth.signOut();

  // Server Side 보안 로그인시 Session설정
  // const setServerSession = async(session: Session)=>{
  //   console.log("====setSession :",session);
  //   // supabase.auth.setSession(session);
    
  //   // await fetch("/api/auth", {
  //   //   method: "POST",
  //   //   headers: new Headers({ "Content-Type": "application/json"}),
  //   //   credentials: "same-origin",
  //   //   body: JSON.stringify({event, session})
  //   // })
  // }

  //비밀번호변경
  const updatePassword = async(payload: SupabaseChangePasswordPayload) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.updateUser(payload);
      // const { error, user } = await supabase.auth.update(payload);
        if(error){
          console.log(error);
          handleMessage?.({message : error.message, type:"error"});
        }else{
          handleMessage?.({message: "비밀번호를 변경하였습니다. 재로그인 해주세요.", type:"success"});
        }
        
    } catch (error: any) {
      console.log(error);
      handleMessage?.({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  //비밀번호복구
  const recoveryPassword = async(payload: SupabaseRecoveryPasswordPayload) => {
    try {
      debugger;
      setLoading(true);
      let { data, error } = await supabase.auth.resetPasswordForEmail(payload?.email);

        if(error){
          console.log(error);
          handleMessage?.({message : error.message, type:"error"});
        }else{
          handleMessage?.({message: "해당 이메일로 비밀번호 복구 메일을 전송하였습니다.", type:"success"});
        }
        
    } catch (error: any) {
      console.log(error);
      handleMessage?.({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // mount, unmount 시점에 실행됨
  useEffect(() => {
    // mount
    const user =  supabase.auth.getUser().then((response)=>{
      // console.log("====user :",response?.data?.user);
      
      if (response.data.user) {
        setUser(response.data.user);
        setUserLoading(false);
        setLoggedIn(true);
        // Router.push("/");
      }else{
        setUserLoading(false);
        // Router.push("/auth");
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
        setUserLoading(false);

        // 쿠키 세션설정
        // if(session){
        //   await setServerSession(session);
        // }
     
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setUser(undefined);
          setLoading(false);
          setLoggedIn(false);
          // Router.push("/auth");
        } else if (event === 'SIGNED_IN' 
        // || event === 'TOKEN_REFRESHED'
        ) {
          setUser(user);
          setLoggedIn(true);
          // Router.push("/");
        } else if (event == "PASSWORD_RECOVERY") {
          const newPassword = prompt("6자리 이상의 변경할 비밀번호를 입력해주세요.") || undefined;
          const { data, error } = await supabase.auth.updateUser({ password: newPassword });
   
          if (data) alert("비밀번호 변경을 완료하였습니다.");
          if (error) alert(error.message);
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
        updatePassword,
        recoveryPassword
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};