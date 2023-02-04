import React, { createContext, useState } from "react";
import { MessageProps } from "./message.types";

export type MessageContextProps = {
    messages : MessageProps[];
    handleMessage : ( arg0: MessageProps ) => void ;
};

export const MessageContext = createContext<Partial<MessageContextProps>>( {} );
type ContainerProps = {
    children: React.ReactNode; //👈 children prop typr
  };

export const MessageProvider = (props : ContainerProps) => {
    const [messages, setMessages] = useState<MessageProps[]>([]);
    
    const handleMessage = (message: MessageProps) => {
        setMessages((prevMessages) => prevMessages.concat([message]));
        setTimeout(()=> {
            setMessages((prevMessages) => prevMessages.slice(1));
        },5000);
    };

    return(
        <MessageContext.Provider
            value={{
                messages,
                handleMessage
            }}
        >
            {props.children} 
        </MessageContext.Provider>
    )
}
