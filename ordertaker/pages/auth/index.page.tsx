import React, { useState } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa"; 
import classNames from "classnames";
import { useFormFields } from "~/utils/utils";
import { useMessage } from "~/common/message";
import { useAuth } from "~/common/auth";
import { FormFieldProps, RecoveryFormFieldProps } from "~/types/auth";

const FORM_VALUES: FormFieldProps = {
  email: "",
  password: "",
};

const RECOVERY_FORM_VALUES: RecoveryFormFieldProps = {
  email: "",
};

const Auth: React.FC = (props) => {
  const [values, handleChange, resetFormFields] = useFormFields<FormFieldProps>(FORM_VALUES);
  const [isSignIn, setIsSignIn] = useState(true);
  const { loading, signIn, signUp, recoveryPassword } = useAuth();
  const { messages, handleMessage } = useMessage();
  const [recoveryAuth, setRecoveryAuth] = useState<boolean>(false);
  const [recoveryValues, handleRecovery, resetRecoveryFormFields] = useFormFields<RecoveryFormFieldProps>(RECOVERY_FORM_VALUES);

  const setRecovery = () => {
    setRecoveryAuth(!recoveryAuth);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    isSignIn ? signIn?.(values) : signUp?.(values);
    resetFormFields();
  };

  const handleRecoverySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    recoveryPassword?.(recoveryValues);
    resetRecoveryFormFields();
  };

  return (
    <div className="container px-5 py-10 mx-auto w-3/5">
      <div className="w-full text-center mb-4 flex flex-col place-items-center">
        {isSignIn ? <FaLockOpen className="w-6 h-6" /> : <FaLock className="w-6 h-6" />}
        <h1 className="text-2xl md:text-4xl text-gray-700 font-semibold">
          {isSignIn ? "로그인" : "회원가입"}
        </h1>
      </div>
      {messages &&
        messages.map((message, index) => (
          <div
            key={index}
            className={classNames(
              "shadow-md rounded px-3 py-2 text-shadow transition-all mt-2 text-center",
              message.type === "error" ? "bg-red-500 text-white" : message.type === "success" ? "bg-green-300 text-gray-800" : "bg-gray-100 text-gray-800"
            )}
          >
            {message?.message}
          </div>
        ))}
      {recoveryAuth ? (
        <form onSubmit={handleRecoverySubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              이메일
              <small className="text-blue-600">
                {isSignIn ? (
                  <a className="font-semibold float-right" href="" onClick={(e) => { e.preventDefault(); setRecovery(); }}>
                    로그인하기
                  </a>
                ) : (
                  ""
                )}{" "}
              </small>
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="email"
              required
              value={recoveryValues.email}
              onChange={handleRecovery}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              비밀번호 재설정 이메일 보내기
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              이메일
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="email"
              required
              value={values.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              비밀번호
              <small className="text-blue-600">
                {isSignIn ? (
                  <a className="font-semibold float-right" href="" onClick={(e) => { e.preventDefault(); setRecovery(); }}>
                    비밀번호를 잊으셨나요?
                  </a>
                ) : (
                  ""
                )}{" "}
              </small>
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="password"
              required
              value={values.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {isSignIn ? "로그인" : "회원가입"}
            </button>
            <div className="flex-1 text-right">
              <small className="block text-gray-600">
                {isSignIn ? "계정이 없으신가요?" : "계정이 있으신가요?"}{" "}
              </small>
              <a
                className="block font-semibold"
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignIn(!isSignIn);
                }}
              >
                {isSignIn ? "회원가입" : "로그인"}
              </a>
            </div>
          </div>
        </form>
      )}
      {loading && (
        <div className="shadow-md rounded px-3 py-2 text-shadow transition-all mt-2 text-center">Loading...</div>
      )}
    </div>
  );
};

export default Auth;