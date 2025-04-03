"use client";
import { getMessagesAction } from "@backend/actions/chat.action";
import { useCallback, useEffect, useState } from "react";

const useOldMessages = ({
    chatId
}) => {
    const [messages, setMessages] = useState([]);
    const localStorageName = `chat-${chatId}`;
    const setMessagesMiddleware = useCallback(async (messages) => {
        localStorage.setItem(localStorageName, JSON.stringify(messages));
        setMessages(messages);
    }, [localStorageName]);

    useEffect(() => {
        const messages = localStorage.getItem(localStorageName);
        if (messages) {
            const msgs = JSON.parse(messages);
            setMessages(msgs);
            getMessagesAction({
                chatId: chatId,
                lastMessageId: msgs[msgs.length - 1].id
            }).then(setMessagesMiddleware);
        } else {
            getMessagesAction({
                chatId
            }).then(setMessagesMiddleware);
        }
    }, [chatId, localStorageName, setMessagesMiddleware]);

    return {
        messages
    };
}

export default useOldMessages