import { createContext, FunctionComponent, useState } from "react";
import { supabase } from "../api/supabase";
import { useMessage, MessageProps } from "../message";
import { SupabaseAuthPayload } from "./auth.types";

export type AuthContextProps = {

};

// Partial : {} 로 초기화가능
export const AuthContext = createContext<Partial<AuthContextProps>>({});

export const AuthProvider: FunctionComponent = ({ children }) => {
  
  return (
    <AuthContext.Provider
      value={{
       
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};