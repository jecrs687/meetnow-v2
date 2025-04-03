"use client";

import { getMessagesAction, sendMessageAction } from '@backend/actions/chat.action';
import { MessageSend } from '@backend/entity/MessageSend';
import { Message } from '@prisma/client';
import { create } from 'zustand';


type MessageServer = Awaited<ReturnType<typeof getMessagesAction>>[0]

type UseMessages = {
    messages: Array<MessageServer | MessageSend>;
    setMessages: (messages: any[]) => void;
    sending: boolean;
    setSending: (sending: boolean) => void;
    setMessagesMiddleware: (messages: any[]) => void;
    onSend: (message: MessageSend) => void;
    chatId: string;
    getMessages: ({ chatId }: { chatId: string }) => void;
    clearMessages: () => void;
}

export const useMessages = create<UseMessages>((set) => ({
    messages: [],
    setMessages: (messages) => set({ messages }),
    sending: false,
    setSending: (sending) => set({ sending }),
    chatId: '',
    clearMessages: () => set({ messages: [] }),
    getMessages: ({ chatId }) => {
        set((state) => {
            state.chatId = chatId;
            state.setSending(true);
            if (state.messages.length === 0)
                state.messages = JSON.parse(localStorage.getItem(`chat-${chatId}`) || '[]');
            if (state.messages.length) {
                getMessagesAction({
                    chatId,
                    lastMessageId: state.messages.filter((m: any) => m.id).pop()?.id
                }).then(state.setMessagesMiddleware);
            } else {
                getMessagesAction({
                    chatId
                }).then(state.setMessagesMiddleware);
            }
            return state;
        });
    },
    setMessagesMiddleware: (messages) => {
        set((state) => {
            localStorage.setItem(`chat-${state.chatId}`, JSON.stringify(messages));
            return {
                messages: [...messages, ...state.messages]
                    .filter((msg, index, self) => self.findIndex(m => m.id === msg.id) === index)
                    .sort(
                        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    )
            }
        });
    },
    onSend: (message: MessageSend) => {
        set((state) => {
            state.setSending(true);
            state.messages = [...state.messages, message];
            sendMessageAction(
                message.toString()
            ).then((x) => {
                state.messages = state.messages.filter((m) => m !== message);
                getMessagesAction({
                    chatId: state.chatId,
                    lastMessageId: state.messages.filter((m: any) => m.id).pop()?.id
                }).then(state.setMessagesMiddleware)
            });
            return state;
        });
    }
}));