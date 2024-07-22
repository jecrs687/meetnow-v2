"use client";
import { getMessagesAction } from "@backend/actions/chat";
import { useCallback, useEffect, useState } from "react";

const useOldMessages = ({
    groupId
}) => {
    const [messages, setMessages] = useState([]);
    const localStorageName = `chat-${groupId}`;
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
                groupId,
                lastMessageId: msgs[msgs.length - 1].id
            }).then(setMessagesMiddleware);
        } else {
            getMessagesAction({
                groupId
            }).then(setMessagesMiddleware);
        }
    }, [groupId, localStorageName, setMessagesMiddleware]);

    return {
        messages
    };
}

export default useOldMessages