import { createContext, FunctionComponent, useEffect, useState } from "react";
import { supabase } from "../../pages/api/supabase";
import { User } from "@supabase/supabase-js";
import { useMessage, MessageProps } from "../message";
import { SupabaseAuthPayload } from "./auth.types";

export type AuthContextProps = {
  user : User | any;
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
  
  const [user, setUser] = useState<Partial<User>>({});
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
          message : "Signup successful. Please check your inbox for a confirmation email!",
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
      const { error } = await supabase.auth.signInWithPassword(payload);
      if (error) {
        console.log(error);
        handleMessage?.({ message: error.message, type: "error" });
      } else {
        handleMessage?.({
          message: "Log in successful. I'll redirect you once I'm done",
          type: "success",
        });

        handleMessage?.({
          message : `Welcom, ${user?.email}`,
          type : "success"
        });
      }
    } catch (error : any) {
      console.log(error);
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
    // const user = supabase.auth.getUser();
    // const user = supabase.auth.getSzession();
    const user =  supabase.auth.getUser()

    if (!!user) {
      setUser({});
      setUserLoading(false);
      setLoggedIn(true);
      // Router.push("/profile");

    }else{
      setUserLoading(false);
    }
    const { data : authListener} = supabase.auth.onAuthStateChange(
      async(event, session) => {
        const user = session?.user! ?? null;
        setUserLoading(false);
        if (user) {
          setUser(user);
          setLoggedIn(true);
          // Router.push("/profile");
          console.log("/profile")
        } else {
          setUser({});
          setLoading(false);
          setLoggedIn(false);
          // Router.push("/auth");
          console.log("/auth")

        }
      }
    )
    
    return () => {
      authListener.subscription.unsubscribe();
    }
    
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