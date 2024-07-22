"use client";
import { getGroup } from '@backend/repository/group'
import styles from './index.module.scss'
import { useCallback, useEffect, useState } from 'react';
import { createChatAction, getMessagesAction } from '@backend/actions/chat';
import { Message } from '../Message';
import { Input } from '../Input';
import { useMessages } from '@store/useMessages';
import { ChatHeader } from '../ChatHeader';


type ChatProps = {
    group: Awaited<ReturnType<typeof getGroup>>
}

export function Chat({ group }: ChatProps) {
    const { messages, getMessages } = useMessages();
    const [currentGroup, setCurrentGroup] = useState(group);
    const UPDATE_INTERVAL = 2500;
    useEffect(() => {
        let interval;
        if (!group.chat) createChatAction({ groupId: group.id }).then(
            async () => {
                const newGroup = await getGroup(group.id);
                setCurrentGroup(newGroup);
                getMessages({
                    chatId: newGroup.chat.id
                });
                interval = setInterval(() => {
                    getMessages({
                        chatId: newGroup.chat.id
                    });
                }, UPDATE_INTERVAL);
            }
        );
        else {
            getMessages({
                chatId: currentGroup.chat.id
            });
            interval = setInterval(() => {
                getMessages({
                    chatId: currentGroup.chat.id
                });
            }, UPDATE_INTERVAL);
        }
        return () => clearInterval(interval);
    }, [currentGroup.chat.id, getMessages, group.chat, group.id]);
    return <div className={styles.container}>
        <ChatHeader group={currentGroup} />
        <div className={styles.messages}>
            {messages.map(Message)}
        </div>
        <Input />
    </div>
}