import React, { createContext, useState } from "react";
import { MessageProps } from "./message.types";
import {Props} from "~/types/common";

export type MessageContextProps = {
    messages : MessageProps[];
    handleMessage : ( arg0: MessageProps ) => void ;
};

export const MessageContext = createContext<Partial<MessageContextProps>>( {} );

export const MessageProvider = (props : Props) => {
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
